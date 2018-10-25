/*
by @threadsmind
http://threadsmind.com

this script creates an svg image that looks like a lonely little monolith on an alien planet
*/
var version = '2018.indev.1';


(function () {
    var h = 'height=';
    var w = 'width=';
    var o = 'opacity=';
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


    function generateColors(lightness) {
        var colorLight = ["c", "d", "e", "f"];
        var colorDark = ["1", "2", "3", "4", "5"];
        var colorFull = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var colorNonDark = ["6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
        var colorMid = ["6", "7", "8", "9", "a", "b"];
        var color = '';
        if (lightness == 'light') {
            for (i = 0; i < 6; i++) {
                color += colorLight[generateRandomNumber(0, colorLight.length - 1)];
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
            color += colorDark[generateRandomNumber(0, colorDark.length - 1)];
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
        return `<rect ${f + skyColor}" ${h}"100%" ${w}"100%" />`;
    }


    function generateGround(groundHeight, groundColor) {
        return `<rect ${f + groundColor}" ${h}"${groundHeight}%" ${w}"100%" y="${100 - groundHeight}%" />`;
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
        return `<rect ${f + tintColor}" ${h}"100%" ${w}"100%" ${o}".${opacity}" />`;
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
                //width stuff
                var rectHighestPoint = highestPoint;
                var widthMin = 10;
                var widthMax = 36;
                if (monolithType == 'wide') {
                    widthMax = 70;
                    rectHighestPoint += 15;
                }
                var width = generateRandomNumber(widthMin, widthMax);
                var xShift = 50 - (width / 2);
                //height stuff
                var height = generateRandomNumber(1, (lowestPoint - rectHighestPoint));
                var yShift = generateRandomNumber(rectHighestPoint, (lowestPoint - height));
                if (isFirst) {
                    yShift = lowestPoint - height;
                }
                //curve stuff
                function feelSoft() {
                    return [1, 1];
                }

                function feelRound() {
                    return [generateRandomNumber(1, 50), generateRandomNumber(0, 50)];
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

                return `<rect ${f + monolithColor}" ${h}"${height}" ${w}"${width}" x="${xShift}" y="${yShift}" rx="${rx}" ry="${ry}" />`;
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

        monolithType = getMonolithType();
        monolithColors = {
            'sky': generateColors('light'),
            'ground': generateColors('mid'),
            'tint': generateColors('noDark'),
            'monolith': generateColors('gsDark')
        };
        groundHeight = generateGroundHeight(monolithType);
        baseHeight = generateBaseHeight(monolithType, groundHeight);
        monolithFeel = generateFeel();

        //TODO generate defs - here? or end? does it matter?
        sky = generateSky(monolithColors.sky); // TODO add gradient mask
        //TODO generate planets? - ground color, VERY low opacity
        //TODO generate horizon scenery? - ground color, slightly lowered opacity?
        ground = generateGround(groundHeight, monolithColors.ground); // TODO add blur mask
        //TODO generate ground texture?
        //TODO generate monolith shadow
        monolith = generateMonolith(monolithType, baseHeight, monolithColors.monolith, monolithFeel);
        tint = generateTint(monolithColors.tint);

        console.log('type: ' + monolithType);  // TODO indev only
        return sky + ground + monolith + tint;
    }


    //Main block
    paintCanvas(createImage());
    unveilCanvas();
})();
