class Passage {
    constructor(text) {
        /*  contains an array of passage texts:
                ["passage 1...", "passage 2...", "passage 3...", etc.]
         */
        this.passageList = text
        this.index = 0 // the char index we are currently displaying
        this.passageIndex = 0 // which passage in our passage array are we on?
        this.passage = this.passageList[this.passageIndex]

        this.LEFT_MARGIN = 50
        this.RIGHT_MARGIN = this.LEFT_MARGIN
        this.BOTTOM_MARGIN = 10
        this.HEIGHT = 120

        this.boxWidth = width - this.LEFT_MARGIN - this.RIGHT_MARGIN
    }

    // advance to the next section
    nextPassage() {
        this.passageIndex += 1
    }


    render() {
        this.renderBox()
        this.renderText()
    }


    // advances the current char in the current passage
    advanceChar() {

    }

    // display the current passage up to the current index
    renderText() {
        /* use text() to display characters with character wrap

         */
    }


    saveRenderImg() {
        const pg = createGraphics(width, height)
        pg.colorMode(HSB, 360, 100, 100, 100)

        /*  we want a rectangle without the corners, but the rounded border
            arguments in rect() don't work in WEBGL. let's make our own
            rectangle with the corners removed using beginShape and vertices!
         */
        const boxWidth = width - this.LEFT_MARGIN - this.RIGHT_MARGIN

        /*
        rect(
            this.LEFT_MARGIN, // top left corner x
            height-this.HEIGHT-this.BOTTOM_MARGIN, // tlc y
            boxWidth, // width
            this.HEIGHT, // height
            50) // rounded borders don't work in WEBGL!
        */

        // these are the coordinates for the top left corner of our target box
        const x = this.LEFT_MARGIN
        const y = height-this.HEIGHT-this.BOTTOM_MARGIN
        const r = 5 // side length of the corner triangle

        const TLC = new p5.Vector(x, y) // top left corner
        const TRC = new p5.Vector(x+boxWidth, y) // top right corner
        const BRC = new p5.Vector(x+boxWidth, y+this.HEIGHT) // bottom r. corner
        const BLC = new p5.Vector(x, y+this.HEIGHT)


        pg.fill(210, 62, 12, 75)
        pg.noStroke()
        pg.beginShape()

        // vertices around each of the four corners of the rectangle
        pg.vertex(TLC.x, TLC.y+r)
        pg.vertex(TLC.x+r, TLC.y)
        pg.vertex(TRC.x-r, TRC.y)
        pg.vertex(TRC.x, TRC.y+r)
        pg.vertex(BRC.x, BRC.y-r)
        pg.vertex(BRC.x-r, BRC.y)
        pg.vertex(BLC.x+r, BLC.y)
        pg.vertex(BLC.x, BLC.y-r)
        pg.endShape()



        // the cyan outline
        const cyan = color(188, 20, 94)
        pg.stroke(cyan)
        pg.strokeWeight(3)

        pg.beginShape()

        // top border including corner guards
        pg.vertex(TLC.x, TLC.y+3*r)
        pg.vertex(TLC.x, TLC.y+r)
        pg.vertex(TLC.x+r, TLC.y)
        pg.vertex(TRC.x-r, TRC.y)
        pg.vertex(TRC.x, TRC.y+r)
        pg.vertex(TRC.x, TRC.y+3*r)
        pg.endShape()

        pg.beginShape()
        // bottom border including corner guards
        pg.vertex(BRC.x, BRC.y-3*r)
        pg.vertex(BRC.x, BRC.y-r)
        pg.vertex(BRC.x-r, BRC.y)
        pg.vertex(BLC.x+r, BLC.y)
        pg.vertex(BLC.x, BLC.y-r)
        pg.vertex(BLC.x, BLC.y-3*r)

        pg.endShape()

        pg.save()
    }


    // renders the transparent dialog box
    renderBox() {
        /*  we want a rectangle without the corners, but the rounded border
            arguments in rect() don't work in WEBGL. let's make our own
            rectangle with the corners removed using beginShape and vertices!
         */

        /*
        rect(
            this.LEFT_MARGIN, // top left corner x
            height-this.HEIGHT-this.BOTTOM_MARGIN, // tlc y
            boxWidth, // width
            this.HEIGHT, // height
            50) // rounded borders don't work in WEBGL!
        */

        // these are the coordinates for the top left corner of our target box
        const x = this.LEFT_MARGIN
        const y = height-this.HEIGHT-this.BOTTOM_MARGIN
        const r = 3 // side length of the corner triangle
        const s = 3.5 // scaling factor of r to extend brackets in corners

        const TLC = new p5.Vector(x, y) // top left corner
        const TRC = new p5.Vector(x+this.boxWidth, y) // top right corner
        const BRC = new p5.Vector(x+this.boxWidth, y+this.HEIGHT) // bottom r.
        // corner
        const BLC = new p5.Vector(x, y+this.HEIGHT)


        fill(210, 62, 12, 75)
        noStroke()
        beginShape()

        // vertices around each of the four corners of the rectangle
        vertex(TLC.x, TLC.y+r)
        vertex(TLC.x+r, TLC.y)
        vertex(TRC.x-r, TRC.y)
        vertex(TRC.x, TRC.y+r)
        vertex(BRC.x, BRC.y-r)
        vertex(BRC.x-r, BRC.y)
        vertex(BLC.x+r, BLC.y)
        vertex(BLC.x, BLC.y-r)
        endShape()

        // the cyan outline
        const cyan = color(188, 20, 94)
        stroke(cyan)
        strokeWeight(2)

        noFill()
        beginShape()

        // top border including corner guards
        vertex(TLC.x, TLC.y+s*r)
        vertex(TLC.x, TLC.y+r)
        vertex(TLC.x+r, TLC.y)
        vertex(TRC.x-r, TRC.y)
        vertex(TRC.x, TRC.y+r)
        vertex(TRC.x, TRC.y+s*r)
        endShape()

        beginShape()
        // bottom border including corner guards
        vertex(BRC.x, BRC.y-s*r)
        vertex(BRC.x, BRC.y-r)
        vertex(BRC.x-r, BRC.y)
        vertex(BLC.x+r, BLC.y)
        vertex(BLC.x, BLC.y-r)
        vertex(BLC.x, BLC.y-s*r)

        endShape()
    }
}