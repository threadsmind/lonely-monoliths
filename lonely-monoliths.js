/*
by @threadsmind
http://threadsmind.com

this script creates an svg image
*/


(function () {
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


    function generateMonolith() {
        //store values as objects before populating svg
        //generate defs for mask cutout by using these values from the stored monolith data


        //generate colors
        //set type: floating, wide, tall
            //set ground height
            //generate sky - rect with color fill, rect with black/white gradient & low opacity, low opacity circles for planets?
            //generate skyline - mountains, hills, ruins, nothing
            //generate ground
            //generate monolith
            //?generate shadow? - onlt for floating? can we make shadows happen with standing monoliths?
        //?generate color grade rect? - normally #fff, set to another light color if this gets chosen as a feature
        return 'monolith is lonely';
    }


    //Main logic block
    paintCanvas(generateMonolith());
    unveilCanvas();
})();
