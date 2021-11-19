/*
@author Kiwi
@date 2021-11-19

this project attempts to replicate the scrolling dialog box in Metroid Dread
that appears whenever Adam is speaking.

what am I aiming for?
    WEBGL with something 3D in the background
    beginHUD, endHUD: semi-transparent box design
        slope=1 corner
        ADAM displayed permanently
        colors:
            border hsv ( 186, 19, 93 )
            background 205, 67, 12. somewhat transparent black or dark blue
    text from a passage using elements from p5-typerc including:
        text cursor
        word wrapping
        time based display from left to right, top to bottom
    additional features:
        colors for letters


 */
let font

function preload() {
    font = loadFont('data/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
}

function draw() {
    background(209, 80, 30)
    
    background(234, 34, 24)
}