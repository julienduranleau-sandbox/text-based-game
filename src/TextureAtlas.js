class TextureAtlas {
    constructor() {
        const canvasTiles = this.generateCharacterList().split('')
        const font = 'normal normal 120px Inconsolata'
        this.textures = this.generateTiles(font, canvasTiles, 64)
    }

    get(name) {
        return this.textures[name]
    }

    generateTiles(font, characters, size, yOffset = 0) {
        const list = {}

        for (let [i, character] of characters.entries()) {
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size * 2

            const ctx = canvas.getContext('2d')
            ctx.font = font
            ctx.textBaseline = 'top'
            ctx.textAlign = 'start'
            ctx.fillStyle = '#FFFFFF'

            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillText(character, 0, 0 + yOffset - 7)
            list[character] = PIXI.Texture.fromCanvas(canvas)

            // document.body.appendChild(canvas)
        }

        return list
    }

    generateCharacterList() {
        let str = ''
        for (let i = 32; i <= 126; i++) str += String.fromCharCode(i)
        return str
    }

    static getInstance() {
        if ( ! TextureAtlas.instance) {
            TextureAtlas.instance = new TextureAtlas()
        }
        return TextureAtlas.instance
    }
}
