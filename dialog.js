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
let cam // easycam!

// define the hue and saturation for all 3 axes
const X_HUE = 0, X_SAT = 80, Y_HUE = 90, Y_SAT = 80, Z_HUE = 210, Z_SAT = 80
const DIM = 40 // brightness value for the dimmer negative axis
const BRIGHT = 75 // brightness value for the brighter positive axis

// read the amplitude of our voice from the mic
let voice
let p5amp

let passage

// prevent the context menu from showing up :3 nya~
document.oncontextmenu = function() {
    return false;
}


function preload() {
    font = loadFont('data/Meiryo-01.ttf')
    voice = loadSound('data/adam.mp3')
}


/* Fixes: sound being blocked https://talonendm.github.io/2020-11-16-JStips/
   Errors messages (CTRL SHIFT i) Chrome Developer Tools:
   The AudioContext was not allowed to start. It must be resumed (or
   created)  after a user gesture on the page. https://goo.gl/7K7WLu

   Possibly unrelated: maybe we need to add sound.js.map too.
   DevTools failed to load SourceMap: Could not load content for
   https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.1.9/addons/p5.sound.min.js.map
   : HTTP error: status code 404, net::ERR_HTTP_RESPONSE_CODE_FAILURE
 */
function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(r => {});
    }
}


function setup() {
    createCanvas(640, 360)
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 16)

    cam = new Dw.EasyCam(this._renderer, {distance:240});

    /*
        cam.rotateX(-PI/2)
        p5amp = new p5.Amplitude()
        voice.play()
     */

    passage = new Passage("So you've accessed a network station! ")
}


function draw() {
    background(234, 34, 24)
    // background(223, 29, 35)
    // ambientLight(250);
    // directionalLight(0, 0, 10, .5, 1, 0); // z axis seems inverted

    // drawBlenderAxes()
    // displayHUD()
    displayPassage()

    /*  to get around the unconnected beginShape problem in WEBGL, maybe we can
        use a p5Image and output the result of the 2D image as an overlay in
        3D? let's focus on drawing the 2D image first.

     */
}

function displayPassage() {
    // cam.beginHUD(this._renderer, width, height)
    passage.render()
    // cam.endHUD()
}


function displayHUD() {
    cam.beginHUD(this._renderer, width, height)
    const PADDING = 10
    const LETTER_HEIGHT = textAscent()

    textFont(font, 10)

    // display the colors of the axes
    fill(X_HUE, X_SAT, BRIGHT)
    text("x axis", PADDING, height-LETTER_HEIGHT*3)

    // green y axis
    fill(Y_HUE, Y_SAT, BRIGHT)
    text("y axis", PADDING, height-LETTER_HEIGHT*2)

    // blue z axis
    fill(Z_HUE, Z_SAT, BRIGHT)
    text("z axis", PADDING, height-LETTER_HEIGHT)
    cam.endHUD()
}


// draw axes in blender colors, with negative parts less bright
function drawBlenderAxes() {
    const ENDPOINT = 10000
    strokeWeight(1)

    // red x axis
    stroke(X_HUE, X_SAT, DIM)
    line(-ENDPOINT, 0, 0, 0, 0, 0)
    stroke(X_HUE, X_SAT, BRIGHT)
    line(0, 0, 0, ENDPOINT, 0, 0)

    // green y axis
    stroke(Y_HUE, Y_SAT, DIM)
    line(0, -ENDPOINT, 0, 0, 0, 0)
    stroke(Y_HUE, Y_SAT, BRIGHT)
    line(0, 0, 0, 0, ENDPOINT, 0)

    // blue z axis
    stroke(Z_HUE, Z_SAT, DIM)
    line(0, 0, -ENDPOINT, 0, 0, 0)
    stroke(Z_HUE, Z_SAT, BRIGHT)
    line(0, 0, 0, 0, 0, ENDPOINT)
}


function keyPressed() {

}