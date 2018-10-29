/*
by @threadsmind
http://threadsmind.com
*/
var version = '2018.indev.2';


(function () {
    var h = 'height="';
    var w = 'width="';
    var o = 'opacity="';
    var f = 'fill="#';


    function generateRandomNumber(randLow, randHigh) {
        return Math.floor(Math.random() * (randHigh - randLow + 1)) + randLow;
    }


    function paintCanvas(lonelyMonoliths) {
        var canvas = document.getElementById("canvas");
        canvas.innerHTML += lonelyMonoliths;
    }


    function unveilCanvas() {
        var cover = document.getElementById('cover');
        cover.classList.add('cover');
    }


    function getMonolithType() {
        var monolithTypes = [
            'floating',
            'tall',
            'wide'
        ];
        return monolithTypes[generateRandomNumber(0, 2)];
    }


    function generateColors(lightness, dayNight) {
        var colorLight = ["c", "d", "e", "f"];
        var colorMid = ["6", "7", "8", "9", "a", "b"];
        var colorDark = ["5", "4", "3", "2", "1"];
        var colorFull = colorLight.concat(colorMid, colorDark);
        var colorNonDark = colorLight.concat(colorMid);
        var color = '';
        if (lightness == 'light') {
            if (dayNight == 'day') {
                for (i = 0; i < 6; i++) {
                    color += colorLight[generateRandomNumber(0, colorLight.length - 1)];
                }
            } else {
                var night = `${generateRandomNumber(1, 3)}${generateRandomNumber(0, 9)}`;
                night += night + `${generateRandomNumber(0,6)}${generateRandomNumber(0, 9)}`;
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


    function generateGroundHeight(monolithType) {
        var groundHeight;
        if (monolithType == 'wide') {
            groundHeight = generateRandomNumber(40, 50);
        } else {
            groundHeight = generateRandomNumber(30, 40);
        }
        return groundHeight;
    }


    function generateBaseHeight(monolithType, groundHeight) {
        var lowestPoint = 85;
        var baseHeight;
        if (monolithType == 'floating') {
            baseHeight = generateRandomNumber(50, ((100 - groundHeight) + 5));
        } else {
            baseHeight = generateRandomNumber(((100 - groundHeight) + 5), lowestPoint);
        }

        return baseHeight;
    }


    function generateSky(skyColor) {
        var sky = `<rect ${f + skyColor}" ${h}100%" ${w}100%" />`;
        sky += `<rect fill="url(#sky-fill)" ${h}100%" ${w}100%" />`;
        return sky;
    }


    function generateGround(groundHeight, groundColor) {
        var ground = `<rect ${f + groundColor}" ${h}${groundHeight + 3}%" ${w}106%" x="-3%" y="${100 - groundHeight}%" filter="url(#ground-blur)" />`;
        ground += `<rect fill="url(#ground-fill)" ${h + groundHeight}%" ${w}100%" y="${100 - groundHeight}%" />`;
        return ground;
    }


    function generateTint(tintColor) {
        var rand = generateRandomNumber(0, 20);
        var opacity = 2;
        if (rand < 7 || rand > 10) {
            tintColor = 'fff';
        } else {
            rand = generateRandomNumber(0, 20);
            if (rand == 6) {
                opacity = generateRandomNumber(4, 7);
            }
        }
        return `<rect ${f + tintColor}" ${h}100%" ${w}100%" ${o}.${opacity}" />`;
    }


    function generateFeel() {
        var feelList = [
            'hard',
            'soft',
            'round',
            'random'
        ]
        return feelList[generateRandomNumber(0, (feelList.length - 1))];
    }

    function generateDayNight() {
        var rand = generateRandomNumber(0, 12);
        if (rand == 7) {
            return 'night';
        } else {
            return 'day';
        }
    }


    function generateDefs(monolithType, monolithFeel, groundHeight) { //TODO
        var defs = '<defs>';

        function makeGradient(id, height, direction) {
            var offset;
            if (height == 'half') {
                offset = generateRandomNumber(40, 60);
            } else {
                offset = generateRandomNumber(80, 99);
            }
            var opacity;
            if (direction == 'up') {
                opacity = [generateRandomNumber(2, 4), generateRandomNumber(0, 1)];
            } else {
                opacity = [generateRandomNumber(0, 0), generateRandomNumber(3, 4)];
            }
            var gradient = `<lineargradient id="${id}" gradientTransform="rotate(90)">
                <stop offset="${generateRandomNumber(1, 5)}%" stop-color="#242424" stop-opacity=".${opacity[0]}" />
                <stop offset="${offset}%" stop-color="#${generateColors('gsDark', null)}" stop-opacity=".${opacity[1]}" />
                </lineargradient>`;
            return gradient;
        }

        function makeBlurFilter(id) {
            var blur = generateRandomNumber(1, 2);
            return `<filter id="${id}"><feGaussianBlur in="SourceGraphic" stdDeviation=".${blur}"></feGaussianBlur></filter>`;
        }

        defs += makeGradient('sky-fill', 'half', 'up');
        defs += makeGradient('ground-fill', 'full', 'up');
        defs += makeBlurFilter('ground-blur');
        return defs + '</defs>';
    }


    function generateMonolith(monolithType, lowestPoint, monolithColor, monolithFeel) {
        var highestPoint = 15;
        var monolith = `<g mask="url(#monolith-mask)">`;

        function makeShape(shapeType, isFirst) {
            var shapeList = {
                'rect': makeRect,
                //TODO 'circle': makeCircle,
                //TODO 'ellispe': makeEllipse(),
                //TODO 'polygon': makePolygon()
                // multi rect?
                // generator that calls shapes within itself and creates them at off-center locations?
            }

            function makeRect() {
                //width & height stuff
                var widthMin = 10;
                var widthMax = 36;
                var rectHighestPoint = highestPoint;
                if (monolithType == 'wide') {
                    widthMax = 60;
                    rectHighestPoint += generateRandomNumber(15, 20);
                }
                var width = generateRandomNumber(widthMin, widthMax);
                if (width > 30) {
                    rectHighestPoint += generateRandomNumber(8, 12);
                }
                var height = generateRandomNumber(1, (lowestPoint - rectHighestPoint));
                //offset stuff
                var xShift = 50 - (width / 2);
                var yShift = generateRandomNumber(rectHighestPoint, (lowestPoint - height));
                if (isFirst) {
                    yShift = lowestPoint - height;
                }
                //curve stuff
                function feelSoft() {
                    return [1, 1];
                }

                function feelRound() {
                    var roundUpperBound = 50;
                    if (height < 20) {
                        roundUpperBound = generateRandomNumber(5, 20);
                    }
                    return [generateRandomNumber(1, roundUpperBound), generateRandomNumber(0, roundUpperBound)];
                }

                function feelHard() {
                    return [0, 0];
                }

                function feelRandom() {
                    var feelList = {
                        'soft': feelSoft,
                        'round': feelRound,
                        'hard': feelHard
                    }
                    var feelListKeyArray = Object.keys(feelList);
                    var feelListKey = generateRandomNumber(0, feelListKeyArray.length - 1);
                    return feelList[feelListKeyArray[feelListKey]]();
                }

                var followFeel = generateRandomNumber(0, 20);
                var rxy = [0, 0];
                if (followFeel < 7 || followFeel > 10) {
                    if (monolithFeel == 'soft') {
                        rxy = feelSoft();
                    } else if (monolithFeel == 'round') {
                        rxy = feelRound();
                    } else if (monolithFeel == 'random') {
                        rxy = feelRandom();
                    }
                } else {
                    rxy = feelRandom();
                }
                var rx = rxy[0];
                var ry = rxy[1];

                return `<rect ${f + monolithColor}" ${h + height}" ${w + width}" x="${xShift}" y="${yShift}" rx="${rx}" ry="${ry}" />`;
            }

            var shape;
            if (shapeType == null) {
                //pick a generator at random
                var shapeListKeyArray = Object.keys(shapeList);
                var shapeListKey = generateRandomNumber(0, (shapeListKeyArray.length - 1));
                shape = shapeList[shapeListKeyArray[shapeListKey]]();
            } else {
                //define a specific generator
                shape = shapeList[shapeType]();
            }
            return shape;
        }

        //always generates at least 1 shape...
        if (monolithType != 'floating') {
            monolith += makeShape('rect', true);
        } else {
            monolith += makeShape(null, true);
        }

        //...then decides if it wants to make more
        var quitNum = generateRandomNumber(0, 6);
        var randNum;
        var currentSafetyNum = 0;
        var safetyNum = 30; // TODO tweak this
        while (true) {
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
        console.log(`parts: ${currentSafetyNum + 1}`); // TODO indev only

        return monolith + '</g>';
    }


    function createImage() {
        console.log('lonely monoliths\nv' + version);
        var dayNight = generateDayNight();

        var monolithType = getMonolithType();
        var monolithColors = {
            'sky': generateColors('light', dayNight),
            'ground': generateColors('mid', dayNight),
            'tint': generateColors('noDark', dayNight),
            'monolith': generateColors('gsDark', dayNight)
        };
        var groundHeight = generateGroundHeight(monolithType);
        var baseHeight = generateBaseHeight(monolithType, groundHeight);
        var monolithFeel = generateFeel();

        var sky = generateSky(monolithColors.sky); // TODO add gradient mask
        //TODO generate planets? - ground color, VERY low opacity
        //TODO generate horizon scenery? - ground color, slightly lowered opacity?
        var ground = generateGround(groundHeight, monolithColors.ground); // TODO add blur mask
        //TODO generate ground texture?
        //TODO generate monolith shadow
        var monolith = generateMonolith(monolithType, baseHeight, monolithColors.monolith, monolithFeel);
        var tint = generateTint(monolithColors.tint);

        var defs = generateDefs(monolithType, monolithFeel, groundHeight);//TODO generate defs 

        console.log('type: ' + monolithType);  // TODO indev only
        return defs + sky + ground + monolith + tint;
    }


    //Main block
    paintCanvas(createImage());
    unveilCanvas();
})();
