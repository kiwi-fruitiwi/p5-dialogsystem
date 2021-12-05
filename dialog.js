/*

@author Kiwi
@date 2021-11-19

this project attempts to replicate the animated dialog box in Metroid Dread
that appears whenever Adam is speaking.

what am I aiming for?
    ☒ WEBGL with something 3D in the background
    ☒ beginHUD, endHUD: semi-transparent box design.
    ☒ generate image for box because of WEBGL errors
    ☒ use math to generate "corner guards"
    text from a passage using elements from p5-typerc including:
        text cursor
        word wrapping
        time based display from left to right, top to bottom
    additional features:
        colors for letters using objects for each character
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
let mode_2D = false



function preload() {
    // font = loadFont('data/giga.ttf')
    // font = loadFont('data/VDL-GigaMaru M.ttf')
    // font = loadFont('data/lucida-console.ttf')
    font = loadFont('data/meiryo.ttf')
    // voice = loadSound('data/adam.mp3')
}


function setup() {
    if (mode_2D) {
        createCanvas(640, 360)
    } else {
        createCanvas(640, 360, WEBGL)
        cam = new Dw.EasyCam(this._renderer, {distance: 240});
    }

    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /*  old code from p5.sphericalgeometry
            cam.rotateX(-PI/2)
            p5amp = new p5.Amplitude()
            voice.play()
     */

    passage = new Passage(["So, you've accessed a network station. Well" +
    " done, Samus. I have reviewed your vital signs and video log from the" +
    " data you uploaded. ", "I've run a full analysis. But I cannot account" +
    " for why you lost consciousness. My reading indicate dramatic physical" +
    " changes in you. "])
    // passage.saveRenderedTextBoxImg()
}


function draw() {
    background(234, 34, 24)
    // background(223, 29, 35)

    // 2D mode is for testing our dialog box!
    if (mode_2D) {
        passage.render2DTextBox(this)

        noStroke()
        fill(0, 0, 100)
        // text(" ", 190, 200)
        // text("A", 200, 200)
        // text("D", 210, 200)
        // text("A", 220, 200)
        // text("M", 230, 200)
        passage.renderText()
    } else {
        // otherwise, we go into 3D and load our transparent, generated dialog
        // box img on top of a simple 3D scene.
        ambientLight(250);
        directionalLight(0, 0, 10, .5, 1, 0); // z axis seems inverted
        drawBlenderAxes()
        displayHUD()

        passage.renderTextFrame(cam)
        passage.renderText(cam)

        if (frameCount % 2 === 0) {
            passage.advanceChar()
        }

        if (millis() > 4000 && passage.passageIndex === 0) {
            passage.nextPassage()
        }
    }

    /*  to get around the unconnected beginShape problem in WEBGL, maybe we can
        use a p5Image and output the result of the 2D image as an overlay in
        3D? let's focus on drawing the 2D image first.
     */
}

function displayHUD() {
    cam.beginHUD(this._renderer, width, height)
    const PADDING = 10
    const LETTER_HEIGHT = textAscent()

    textFont(font, 10)

    // display the colors of the axes
    fill(X_HUE, X_SAT, BRIGHT)
    text("x axis", PADDING, height - LETTER_HEIGHT * 3)

    // green y axis
    fill(Y_HUE, Y_SAT, BRIGHT)
    text("y axis", PADDING, height - LETTER_HEIGHT * 2)

    // blue z axis
    fill(Z_HUE, Z_SAT, BRIGHT)
    text("z axis", PADDING, height - LETTER_HEIGHT)
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
        getAudioContext().resume().then(r => {
        });
    }
}


// prevent the context menu from showing up :3 nya~
document.oncontextmenu = function () {
    return false;
}