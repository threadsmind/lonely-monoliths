/*
by @threadsmind
http://threadsmind.com

this script creates an svg image
*/


//grab the canvas div
var canvas = document.getElementById("m");

//svg setup
var svgOpen = '<svg viewBox="0 0 100 100" preserveAspectRatio="true" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">';
var svgClose = '</svg>';

//compile svg
var svgImage = svgOpen + svgClose;

//send the image to the webpage
canvas.innerHTML = svgImage;
