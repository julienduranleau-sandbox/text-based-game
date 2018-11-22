class Keyboard {

    static get LEFT() { return "ArrowLeft" }
    static get UP() { return "ArrowUp" }
    static get RIGHT() { return "ArrowRight" }
    static get DOWN() { return "ArrowDown" }
    static get SPACE() { return " " }
    static get ENTER() { return "Enter" }

    constructor() {
        this.pressed = {}

        window.addEventListener('keydown', this.keydown.bind(this))
        window.addEventListener('keyup', this.keyup.bind(this))
    }

    keydown(e) {
        this.pressed[e.key] = true
    }

    keyup(e) {
        this.pressed[e.keyCode] = false
    }

    isPressed(keyCode) {
        if (this.pressed[keyCode]) {
            return true
        }
        return false
    }
}
