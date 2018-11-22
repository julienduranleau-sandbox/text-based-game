const ROWS = 50
const COLS = 200
const CHAR_WIDTH = 8
const CHAR_HEIGHT = 18

const characters = generateCharacterList()
const bitmapFont = generateBitmapFont('16px Inconsolata', characters.str.split(''))

const renderCanvas = document.createElement('canvas', { alpha: false })
document.body.appendChild(renderCanvas)

const vertexFile = 'shader.vert'
const fragmentFile = 'shader.frag'

const glsl = new GlslSandbox(renderCanvas, vertexFile, fragmentFile, 800, 600)
const gl = glsl.gl

let frame = 1
let chars = new Uint8Array(256 * 256 * 4)

for (let i = 0; i < chars.length; i += 4) {
    chars[i] = 66 //(i + frame) % characters.str.length
}

glsl.on('post-init', () => {
    glsl.registerUniform('u_texture', 't', bitmapFont)
    glsl.registerUniform('u_chars', 'tarray', chars)
})


glsl.on('pre-render', () => {
    for (let i = 0; i < chars.length; i += 4) {
        chars[i] = (i + frame) % characters.str.length
    }

    glsl.uniforms.u_chars.value = chars

    frame++
})

function generateCachedCharacterBitmaps(bitmapFont, characters) {
    const list = {}
    const bitmapFontCtx = bitmapFont.getContext('2d')

    return list
}

function tick() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            // ctx.fillText(randomLetter, col * 8, row * 18)
            let characterIndex = (row * COLS + col + frame) % characters.count
//            drawCharacter(characters.str[characterIndex], col, row)
        }
    }

    frame++
    window.requestAnimationFrame(tick)
}


function drawCharacter(char, col, row) {
    ctx.putImageData(bitmapFont[char], col * CHAR_WIDTH, row * CHAR_HEIGHT)
}

function generateBitmapFont(font, characters) {
    const canvas = document.createElement('canvas')
    canvas.width = 1024 //characters.length * CHAR_WIDTH
    canvas.height = 1024 //CHAR_HEIGHT

    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textBaseline = 'top'

    ctx.fillStyle = "#FFFFCC"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    ctx.fillStyle = "#000000"

    for (let [i, character] of characters.entries()) {
        ctx.fillText(character, i * CHAR_WIDTH, 0)
    }

    //document.body.appendChild(canvas)

    return canvas
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
