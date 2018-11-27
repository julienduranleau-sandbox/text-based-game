PIXI.glCore.VertexArrayObject.prototype.addAttribute = function(buffer, attribute, type, normalized, stride, start)
{
    if (!attribute) {
        return this;
    }
    this.attributes.push({
        buffer:     buffer,
        attribute:  attribute,

        location:   attribute.location,
        type:       type || this.gl.FLOAT,
        normalized: normalized || false,
        stride:     stride || 0,
        start:      start || 0
    });

    this.dirty = true;

    return this;
};

var pixiApp = new PIXI.Application(800, 600, { backgroundColor: 0x222222 })
document.body.appendChild(pixiApp.view)

const map = new Map(pixiApp)
this.pixiApp.stage.addChild(map.container)
const keyboard = new Keyboard()

let frame = 0

keyboard.fakeKeyPress('s', 400)

pixiApp.ticker.add((delta) => {
    if (keyboard.isPressed('w')) map.moveUp()
    if (keyboard.isPressed('d')) map.moveRight()
    if (keyboard.isPressed('s')) map.moveDown()
    if (keyboard.isPressed('a')) map.moveLeft()
    frame++
})

