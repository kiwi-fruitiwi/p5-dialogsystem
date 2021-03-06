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

let dialogBox
let mode_2D = true /* test in 2D? */

let passages // our json file input
let lastPassageAdvanceTime = 0 // when was the last passage advance?

let finishedTextFrame; /* load a rendered textFrame */

function preload() {
    // font = loadFont('data/giga.ttf') // doesn't work due to textWidth issues
    // font = loadFont('data/VDL-GigaMaru M.ttf')
    // font = loadFont('data/lucida-console.ttf')
    // font = loadFont('data/notjustgroovy.ttf')
    font = loadFont('data/meiryo.ttf')
    voice = loadSound('data/adam.mp3')
    passages = loadJSON('passages.json')
    finishedTextFrame = loadImage('data/textFrame.png')
}

/* populate an array of passage text */
let textList = []
/* grab other information: ms spent on each passage, highlights */
let highlightList = [] // a list of tuples specifying highlights and indexes
let msPerPassage = 0 // how long to wait before advancing a passage

function setup() {
    // noSmooth()
    noCursor()

    if (mode_2D) {
        createCanvas(1280, 720)
    } else {
        createCanvas(640, 360, WEBGL)
        cam = new Dw.EasyCam(this._renderer, {distance: 240});
    }
    
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 12)

    /* 'in' makes our variable the index, while 'of' makes it the value! */
    for (let key in passages) {
        textList.push(passages[key]['text'])

        // for (let highlightKey in passages[key]['highlightIndices'])
        //     highlightList.push(passages[key]['highlightIndices'])
        highlightList.push(passages[key]['highlightIndices'])
        msPerPassage = passages[key]['ms']
    }

    /* we can also use the Object.keys method to grab keys from JSON! */
    for (let i = 0; i < Object.keys(passages).length; i++) {
        // console.log(passages[i].highlightIndices)
    }

    // TODO add arguments to DialogBox: tpp, hll
    dialogBox = new DialogBox(textList, highlightList, msPerPassage)

    // dialogBox.saveRenderedTextBoxImg()
}

function draw() {
    background(234, 34, 24)
    // background(223, 29, 35)

    // 2D mode is for testing our dialog box!
    if (mode_2D) {
        dialogBox.render2DTextBox(this)

        /**
         *  create a cropped version of the 1280x720 textFrame. this is the
         *  frame itself without the rest of the transparent background. Use
         *  image.get(x, y, w, h). we need STROKE_WIDTH_ADJUST because the
         *  stroke of the original frame exceeds the coordinates roughly by the
         *  strokeWidth/2
         *
         *  https://p5js.org/reference/#/p5.Image/get
         *  syntax: get(x, y, w, h)
         */
        const STROKE_WIDTH_ADJUST = 3;
        const x = dialogBox.LEFT_MARGIN-STROKE_WIDTH_ADJUST
        const y = height
            - dialogBox.BOTTOM_MARGIN
            - dialogBox.HEIGHT-STROKE_WIDTH_ADJUST
        const w = dialogBox.boxWidth+STROKE_WIDTH_ADJUST*2
        const h = dialogBox.HEIGHT+STROKE_WIDTH_ADJUST*2

        let frameCrop = finishedTextFrame.get(x, y, w, h)

        /* top half of our frame */
        const HALF_HEIGHT = h-dialogBox.HEIGHT/2 + STROKE_WIDTH_ADJUST
        const frameTop = frameCrop.get(0, 0, w, HALF_HEIGHT)

        /* bottom half of our frame */
        const frameBottom = frameCrop.get(0, HALF_HEIGHT, w, HALF_HEIGHT)

        image(frameTop, x, 50)
        image(frameBottom, x, 250)

        fill(90, 100, 100, 50)
        noStroke()
        circle(x, y, 4)
        circle(x+w, y+h, 4)
    } else {
        // otherwise, we go into 3D and load our transparent, generated dialog
        // box img on top of a simple 3D scene.
        ambientLight(250);
        directionalLight(0, 0, 10, .5, 1, 0); // z axis seems inverted
        drawBlenderAxes()
        displayHUD()

        dialogBox.renderTextFrame(cam)
        dialogBox.renderText(cam)

        if (frameCount % 1 === 0) {
            dialogBox.advanceChar()
        }

        if (millis() - lastPassageAdvanceTime > 4000) {
            dialogBox.nextPassage()
            lastPassageAdvanceTime = millis()
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