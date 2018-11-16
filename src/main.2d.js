const ROWS = 50
const COLS = 200
const CHAR_WIDTH = 8
const CHAR_HEIGHT = 18

const characters = generateCharacterList()
const bitmapFont = generateBitmapFont('16px Inconsolata', characters.str.split(''))

const renderCanvas = document.createElement('canvas', { alpha: false })
const renderCtx = renderCanvas.getContext('2d')
renderCanvas.width = window.innerWidth
renderCanvas.height = window.innerHeight
document.body.appendChild(renderCanvas)

const bufferCanvas = document.createElement('canvas', { alpha: false })
const ctx = bufferCanvas.getContext('2d')
bufferCanvas.width = renderCanvas.width
bufferCanvas.height = renderCanvas.height

let frame = 1

tick()

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
            drawCharacter(characters.str[characterIndex], col, row)
        }
    }

    renderCtx.drawImage(bufferCanvas, 0, 0)

    frame++
    window.requestAnimationFrame(tick)
}


function drawCharacter(char, col, row) {
    ctx.putImageData(bitmapFont[char], col * CHAR_WIDTH, row * CHAR_HEIGHT)
}

function generateBitmapFont(font, characters) {
    const cachedList = {}

    const canvas = document.createElement('canvas')
    canvas.width = characters.length * CHAR_WIDTH
    canvas.height = CHAR_HEIGHT

    const ctx = canvas.getContext('2d')
    ctx.font = font
    ctx.textBaseline = 'top'

    ctx.fillStyle = "#000000"
    ctx.fillRect(0,0,canvas.width,canvas.height)

    ctx.fillStyle = "#FFFFFF"

    for (let [i, character] of characters.entries()) {
        ctx.fillText(character, i * CHAR_WIDTH, 0)
        cachedList[character] = ctx.getImageData(i * CHAR_WIDTH, 0, CHAR_WIDTH, CHAR_HEIGHT)
    }

    // document.body.appendChild(canvas)

    return cachedList
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
