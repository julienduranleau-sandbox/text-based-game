var pixiApp = new PIXI.Application(800, 600, { backgroundColor: 0x222222 })
document.body.appendChild(pixiApp.view)

const map = new Map(pixiApp)
this.pixiApp.stage.addChild(map.container)
const keyboard = new Keyboard()

let frame = 0

pixiApp.ticker.add((delta) => {
    if (keyboard.isPressed('w')) map.moveUp()
    if (keyboard.isPressed('d')) map.moveRight()
    if (keyboard.isPressed('s')) map.moveDown()
    if (keyboard.isPressed('a')) map.moveLeft()
    frame++
})

