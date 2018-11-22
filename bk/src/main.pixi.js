const ROWS = 50
const COLS = 200
const CHAR_WIDTH = 8
const CHAR_HEIGHT = 18

const characters = generateCharacterList()
const bitmapFont = generateBitmapFont('16px Inconsolata', characters.str.split(''))

function generateBitmapFont(font, characters) {
    const textures = {}

    for (let [i, character] of characters.entries()) {
        const canvas = document.createElement('canvas')
        canvas.width = CHAR_WIDTH
        canvas.height = CHAR_HEIGHT

        const ctx = canvas.getContext('2d')
        ctx.font = font
        ctx.textBaseline = 'top'

        ctx.fillStyle = "#FFFFCC"
        ctx.fillRect(0,0,canvas.width,canvas.height)

        ctx.fillStyle = "#000000"
        ctx.fillText(character, 0, 0)

        textures[character] = PIXI.Texture.fromCanvas(canvas)
    }

    return textures
}

function generateCharacterList() {
    let str = ''
    for (let i = 32; i <= 126; i++) str += String.fromCharCode(i)

    let list = {}
    for (let i = 0; i < str.length; i++) list[str[i]] = i 

    return {
        str,
        list,
        count: str.length,
    }
}



let chars = []
let frame = 0
var app = new PIXI.Application(800, 600, {backgroundColor : 0x000000})
document.body.appendChild(app.view)

var container = new PIXI.Container()
app.stage.addChild(container)

for (var i = 0; i < 10000; i++) {
    var char = new PIXI.Sprite(bitmapFont[' '])
    char.x = (i % COLS) * CHAR_WIDTH
    char.y = Math.floor(i / COLS) * CHAR_HEIGHT
    container.addChild(char)
    chars.push(char)
}

var brt = new PIXI.BaseRenderTexture(800, 600, PIXI.SCALE_MODES.LINEAR, 1)
var rt = new PIXI.RenderTexture(brt)
var sprite = new PIXI.Sprite(rt)
app.stage.addChild(sprite)

app.ticker.add(function() {
    frame++
    for (let i = 0; i < chars.length; i++) {
        chars[i].setTexture(bitmapFont[characters.str[(i + frame) % characters.str.length]])
    }
    app.renderer.render(container, rt)
})
