/*
by @threadsmind
http://threadsmind.com
*/
const version = '2020.indev.3';
console.log('lonely monoliths\nv' + version);

const cover = document.getElementById('cover');
const canvas = document.getElementById("canvas");

const newMonolith = () => {
  const h = 'height="';
  const w = 'width="';
  const o = 'opacity="';
  const f = 'fill="#';
  let veilOpacity = 1;


  const generateRandomNumber = (randLow, randHigh) => {
    return Math.floor(Math.random() * (randHigh - randLow + 1)) + randLow;
  }

  const paintCanvas = (lonelyMonoliths) => {
    canvas.innerHTML = lonelyMonoliths;
  }

  const lerp = (from, to, delta) => {
    return (1 - delta) * from + delta * to;
  }

  const reveilCanvas = () => {
    cover.style.opacity = 1;
  }

  const unveilCanvas = () => {
    if (veilOpacity >= 0.01) {
      veilOpacity = lerp(veilOpacity, 0, 0.08);
      window.requestAnimationFrame(unveilCanvas);
    } else {
      veilOpacity = 0;
    }
    cover.style.opacity = veilOpacity;
  }


  const getMonolithType = () => {
    const monolithTypes = [
      'floating',
      'tall',
      'wide'
    ];
    return monolithTypes[generateRandomNumber(0, 2)];
  }

  const generateColors = (lightness, dayNight) => {
    const colorLight = ["c", "d", "e", "f"];
    const colorMid = ["6", "7", "8", "9", "a", "b"];
    const colorDark = ["5", "4", "3", "2", "1"];
    const colorFull = colorLight.concat(colorMid, colorDark);
    const colorNonDark = colorLight.concat(colorMid);
    let color = '';
    if (lightness == 'light') {
      if (dayNight == 'day') {
        for (i = 0; i < 6; i++) {
          color += colorLight[generateRandomNumber(0, colorLight.length - 1)];
        }
      } else {
        let night = `${generateRandomNumber(1, 3)}${generateRandomNumber(0, 9)}`;
        night += night + `${generateRandomNumber(0, 6)}${generateRandomNumber(0, 9)}`;
        color = night;
      }
    } else if (lightness == 'mid') {
      for (i = 0; i < 6; i++) {
        color += colorMid[generateRandomNumber(0, colorMid.length - 1)];
      }
    } else if (lightness == 'noDark') {
      for (i = 0; i < 6; i++) {
        color += colorNonDark[generateRandomNumber(0, colorNonDark.length - 1)];
      }
    } else if (lightness == 'gsDark') {

      if (dayNight == 'day') {
        color += colorDark[generateRandomNumber(0, colorDark.length - 1)];
      } else {
        color += colorMid[generateRandomNumber(0, colorMid.length - 1)];
      }
      color += colorFull[generateRandomNumber(0, colorFull.length - 1)];
      color += color + color;
    } else {
      for (i = 0; i < 6; i++) {
        color += colorFull[generateRandomNumber(0, colorFull.length - 1)];
      }
    }
    return color;
  }

  const generateGroundHeight = (monolithType) => {
    return monolithType === 'wide' ?
      generateRandomNumber(40, 50) :
      generateRandomNumber(30, 40);
  }

  const generateBaseHeight = (monolithType, groundHeight) => {
    const lowestPoint = 85; // TODO why is this here?
    return monolithType === 'floating' ?
      generateRandomNumber(50, ((100 - groundHeight) + 5)) :
      generateRandomNumber(((100 - groundHeight) + 5), lowestPoint);
  }

  const generateSky = (skyColor) => {
    return `<rect ${f}${skyColor}" ${h}100%" ${w}100%" /><rect fill="url(#sky-fill)" ${h}100%" ${w}100%" />`;
  }

  // TODO clean this
  const generateGround = (groundHeight, groundColor) => {
    let ground = `<rect ${f}${groundColor}" ${h}${groundHeight + 3}%" ${w}106%" x="-3%" y="${100 - groundHeight}%" filter="url(#ground-blur)" />`;
    ground += `<rect fill="url(#ground-fill)" ${h}${groundHeight}%" ${w}100%" y="${100 - groundHeight}%" />`;
    return ground;
  }

  const generateTint = (tintColor) => {
    let opacity = 2;
    let rand = generateRandomNumber(0, 20);
    if (rand < 7 || rand > 10) { // TODO why?
      tintColor = 'fff';
    } else {
      rand = generateRandomNumber(0, 20);
      if (rand == 6) {
        opacity = generateRandomNumber(4, 7);
      }
    }
    return `<rect ${f + tintColor}" ${h}100%" ${w}100%" ${o}.${opacity}" />`;
  }

  const generateFeel = () => {
    const feelList = [
      'hard',
      'soft',
      'round',
      'random'
    ]
    return feelList[generateRandomNumber(0, 3)];
  }

  const generateDayNight = () => {
    const rand = generateRandomNumber(0, 12);
    return rand === 7 ? 'night' : 'day'; // TODO why 7?
  }

  const generateDefs = (monolithType, monolithFeel, groundHeight) => { //TODO
    const makeGradient = (id, height, direction) => {
      const offset = height === 'half' ?
        generateRandomNumber(40, 60) :
        generateRandomNumber(80, 99);
      const opacity = direction === 'up' ?
        [generateRandomNumber(2, 4), generateRandomNumber(0, 1)] :
        [generateRandomNumber(0, 0), generateRandomNumber(3, 4)];
      const gradient = `<lineargradient id="${id}" gradientTransform="rotate(90)">
        <stop offset="${generateRandomNumber(1, 5)}%" stop-color="#242424" stop-opacity=".${opacity[0]}" />
        <stop offset="${offset}%" stop-color="#${generateColors('gsDark', null)}" stop-opacity=".${opacity[1]}" />
        </lineargradient>`;
      return gradient;
    }

    const makeBlurFilter = (id) => {
      const blur = generateRandomNumber(1, 3);
      return `<filter id="${id}"><feGaussianBlur in="SourceGraphic" stdDeviation=".${blur}"></feGaussianBlur></filter>`;
    }

    const makeMask = (id, cutout) => {
      const doMask = cutout ?
        generateRandomNumber(0, 2) === 1 ? true : false :
        generateRandomNumber(0, 12) === 4 ? true : false;
      let mask = ''
      if (doMask) {
        const masks = cutout ? Math.abs(generateRandomNumber(3, 8) - generateRandomNumber(0, 5)) :
          generateRandomNumber(0, 3);
        mask = `<mask id="${id}">`;
        mask += cutout ? '<rect width=100% height=100% fill=#fff></rect>' :
          `<circle cx=50% cy=${generateRandomNumber(35, 55)}% r=${generateRandomNumber(16, 28)} fill=#fff /></circle>`;
        if (masks != 0) {
          for (i = 0; i < masks; i++) {
            mask += `<circle cx=50% cy=${generateRandomNumber(30, 60)}% r=${generateRandomNumber(1, 6)} fill=#${cutout ? `000` : 'fff'} /></circle>`
          }
        }
        mask += '</mask>'
      }
      if (!cutout && doMask) {
        console.log('filter cutout');
      }
      return mask;
    }

    return `<defs>
      ${makeGradient('sky-fill', 'half', 'up')}
      ${makeGradient('ground-fill', 'full', 'down')}
      ${makeBlurFilter('ground-blur')}
      ${makeMask('cutout-mask', true)}
      ${monolithType === 'floating' ? makeMask('filter-mask', false) : ''}
      </defs>`;
  }

  const generateMonolith = (monolithType, lowestPoint, monolithColor, monolithFeel) => {
    const highestPoint = 15;

    const makeShape = (shapeType, isFirst) => {
      const makeRect = () => {
        //width & height stuff
        const widthMin = 10;
        const widthMax = monolithType === 'wide' ? 60 : 36;
        const width = generateRandomNumber(widthMin, widthMax);
        let rectHighestPoint = monolithType === 'wide' ? generateRandomNumber(15, 20) : highestPoint; // TODO ???
        if (width > 30) { // TODO ???????????????/
          rectHighestPoint += generateRandomNumber(8, 12);
        }
        const height = generateRandomNumber(1, (lowestPoint - rectHighestPoint));
        //offset stuff
        const xShift = 50 - (width / 2);
        const yShift = isFirst ? lowestPoint - height :
          generateRandomNumber(rectHighestPoint, (lowestPoint - height));

        //curve stuff
        const feelSoft = () => {
          const soft = generateRandomNumber(1, 2);
          return [soft, soft];
        }
        const feelRound = () => {
          const roundUpperBound = height < 20 ? generateRandomNumber(5, 20) : 50;
          return [generateRandomNumber(1, roundUpperBound), generateRandomNumber(0, roundUpperBound)];
        }
        const feelHard = () => { // TODO why?
          return [0, 0];
        }
        const feelRandom = () => { // TODO maybe revisit this
          const feelList = {
            'soft': feelSoft,
            'round': feelRound,
            'hard': feelHard
          }
          const feelListKeyArray = Object.keys(feelList);
          const feelListKey = generateRandomNumber(0, feelListKeyArray.length - 1);
          return feelList[feelListKeyArray[feelListKey]]();
        }

        const followFeel = generateRandomNumber(0, 20);
        const rxy = !(followFeel < 7 || followFeel > 10) ? feelRandom() :
          monolithFeel == 'soft' ? feelSoft() :
            monolithFeel == 'round' ? feelRound() :
              monolithFeel == 'random' ? feelRandom() :
                feelHard();

        return `<rect ${f}${monolithColor}" ${h}${height}" ${w}${width}" x="${xShift}" y="${yShift}" rx="${rxy[0]}" ry="${rxy[1]}" />`;
      }

      const shapeList = {
        'rect': makeRect,
        //TODO 'circle': makeCircle,
        //TODO 'ellispe': makeEllipse(),
        //TODO 'polygon': makePolygon()
        // multi rect?
        // generator that calls shapes within itself and creates them at off-center locations?
      }

      // define a random shape if no shape was provided
      const fallbackShapeType = () => {
        const shapeListKeyArray = Object.keys(shapeList);
        const shapeListKey = generateRandomNumber(0, (shapeListKeyArray.length - 1));
        return shapeList[shapeListKeyArray[shapeListKey]]();
      };

      // generate a shape and return it's SVG element as a string
      return !!shapeType ? shapeList[shapeType]() :
        fallbackShapeType();;
    }

    let monolith = `<g mask="url(#filter-mask)"><g mask="url(#cutout-mask)">`;

    //always generates at least 1 shape...
    monolith += monolithType != 'floating' ?
      makeShape('rect', true) :
      makeShape(null, true);

    //...then decides if it wants to make more
    const quitNum = generateRandomNumber(0, 6);
    const safetyNum = 30; // TODO tweak this
    let randNum;
    let currentSafetyNum = 0;
    while (true) { // TODO revisit this
      if (currentSafetyNum != safetyNum) {
        randNum = generateRandomNumber(0, 6);
        if (randNum == quitNum && currentSafetyNum > 1) {
          break;
        } else {
          monolith += makeShape(null, false);
        }
        currentSafetyNum++;
      } else {
        break;
      }
    }
    console.log(`parts: ${currentSafetyNum + 1}`); // TODO indev only - maybe add custom logger

    return monolith.concat('</g></g>');
  }

  const createImage = () => {
    const dayNight = 'day'; //generateDayNight();

    const monolithType = getMonolithType();
    const monolithColors = {
      'sky': generateColors('light', dayNight),
      'ground': generateColors('mid', dayNight),
      'tint': generateColors('noDark', dayNight),
      'monolith': generateColors('gsDark', dayNight)
    };
    const groundHeight = generateGroundHeight(monolithType);
    const baseHeight = generateBaseHeight(monolithType, groundHeight);
    const monolithFeel = generateFeel();

    const sky = generateSky(monolithColors.sky); // TODO add gradient mask
    //TODO generate planets? - ground color, VERY low opacity
    //TODO generate horizon scenery? - ground color, slightly lowered opacity?
    const ground = generateGround(groundHeight, monolithColors.ground); // TODO add blur mask
    //TODO generate ground texture?
    //TODO generate monolith shadow
    const monolith = generateMonolith(monolithType, baseHeight, monolithColors.monolith, monolithFeel);
    const tint = generateTint(monolithColors.tint);

    const defs = generateDefs(monolithType, monolithFeel, groundHeight); // TODO generate defs

    console.log(`type: ${monolithType}\nfeel: ${monolithFeel}`);  // TODO indev only - custom logger?

    return `${defs}${sky}${ground}${monolith}${tint}`;
  }

  reveilCanvas();
  paintCanvas(createImage());
  unveilCanvas();
};

// add button input
const newBtn = document.getElementById('new-lith');
['mousedown', 'touchstart', 'keydown'].forEach(input => {
  newBtn.addEventListener(input, newMonolith);
});

// build first monolith
newMonolith();
