class Map {
    constructor(pixiApp) {
        this.pixiApp = pixiApp
        this.lastMoveTime = Date.now()
        this.tileCount = { w: 31, h: 21 }
        this.offset = { x: 0, y: 0 }
        this.tileSize = { w: 40, h: 80 }
        this.gridSize = { w: 100, h: 100 }
        this.displaySize = {
            w: this.tileCount.w * this.tileSize.w,
            h: this.tileCount.h * this.tileSize.h
        }
        this.fadeInSpeed = 0.9
        this.fadeOutSpeed = 0.3
        this.panSpeed = 0.1
        this.sprites = {}

        this.grid = this.generateGrid()
        this.container = this.initializeContainer()
        this.tileContainer = new PIXI.projection.Container2d()
        this.container.addChild(this.tileContainer)

        this.displayInitialFrame()
    }

    initializeContainer() {
        const container = new PIXI.projection.Container2d()
        container.position.set(this.pixiApp.screen.width / 2, this.pixiApp.screen.height)
        container.proj.setAxisY(new PIXI.Point(0, 1100), -1)
        return container
    }

    displayInitialFrame() {
        for (let row = 0; row < this.tileCount.h; row++) {
            for (let col = 0; col < this.tileCount.w; col++) {
                this.addSprite(this.grid[this.offset.y + row][this.offset.x + col], col, row)
            }
        }
        this.updateBlurs()
    }

    addSprite(tile, col, row) {
        const texture = TextureAtlas.getInstance().get(tile)
        const s = new PIXI.projection.Sprite2d(texture)
        s.width = this.tileSize.w
        s.height = this.tileSize.h
        s.position = this.xyToPerspective(
            s.x = col * this.tileSize.w + this.offset.x * this.tileSize.w,
            s.y = row * this.tileSize.h + this.offset.y * this.tileSize.h
        )
        s.alpha = 0

        this.tileContainer.addChild(s)

        const tileId = `${col + this.offset.x},${row+this.offset.y}`
        this.sprites[tileId] = s

        new TweenLite(s, this.fadeInSpeed, { alpha: 1 })
    }

    updateBlurs() {
        for (let key in this.sprites) {
            let s = this.sprites[key]
            let yValue = s.y + this.tileContainer.y
            let blurStrenth  = Math.abs(1 - Math.abs(yValue) / (this.tileCount.h * this.tileSize.h * 0.3)) * 3
            //s.filters = [new PIXI.filters.BlurFilter(blurStrenth, 1, 1)]
        }
    }

    removeSprite(id) {
        let s = this.sprites[id]

        new TweenLite(s, this.fadeOutSpeed, { alpha: 0, onComplete: () => {
            this.tileContainer.removeChild(s)
        }})

        delete this.sprites[id]
    }

    moveLeft() {
        if (this.offset.x === 0) return
        if (Date.now() - this.lastMoveTime < this.panSpeed * 1000) return

        for (let row = 0; row < this.tileCount.h; row++) {
            this.addSprite(this.grid[this.offset.y + row][this.offset.x - 1], -1, row)

            const oppositeTileId = `${this.offset.x + this.tileCount.w-1},${row+this.offset.y}`
            this.removeSprite(oppositeTileId)
        }

        new TweenLite(this.tileContainer, this.panSpeed, { x: this.tileContainer.x + this.tileSize.w })
        this.updateBlurs()

        this.offset.x--
        this.lastMoveTime = Date.now()
    }

    moveRight() {
        if (this.offset.x === this.gridSize.w - this.tileCount.w) return
        if (Date.now() - this.lastMoveTime < this.panSpeed * 1000) return

        for (let row = 0; row < this.tileCount.h; row++) {
            this.addSprite(this.grid[this.offset.y + row][this.offset.x + this.tileCount.w], this.tileCount.w, row)

            const oppositeTileId = `${this.offset.x},${ row + this.offset.y }`
            this.removeSprite(oppositeTileId)
        }

        new TweenLite(this.tileContainer, this.panSpeed, { x: this.tileContainer.x - this.tileSize.w })
        this.updateBlurs()

        this.offset.x++
        this.lastMoveTime = Date.now()
    }

    moveUp() {
        if (this.offset.y === 0) return
        if (Date.now() - this.lastMoveTime < this.panSpeed * 1000) return

        for (let col = 0; col < this.tileCount.w; col++) {
            this.addSprite(this.grid[this.offset.y - 1][this.offset.x + col], col, -1)

            const oppositeTileId = `${this.offset.x + col},${ this.offset.y + this.tileCount.h - 1 }`
            this.removeSprite(oppositeTileId)
        }

        new TweenLite(this.tileContainer, this.panSpeed, { y: this.tileContainer.y + this.tileSize.h })
        this.updateBlurs()

        this.offset.y--
        this.lastMoveTime = Date.now()
    }

    moveDown() {
        if (this.offset.y === this.gridSize.h - this.tileCount.h) return
        if (Date.now() - this.lastMoveTime < this.panSpeed * 1000) return

        for (let col = 0; col < this.tileCount.w; col++) {
            this.addSprite(this.grid[this.offset.y + this.tileCount.h][this.offset.x + col], col, this.tileCount.h)

            const oppositeTileId = `${this.offset.x + col},${ this.offset.y }`
            this.removeSprite(oppositeTileId)
        }

        new TweenLite(this.tileContainer, this.panSpeed, { y: this.tileContainer.y - this.tileSize.h })
        this.updateBlurs()

        this.offset.y++
        this.lastMoveTime = Date.now()
    }

    xyToPerspective(x, y) {
        return new PIXI.Point(
            this.displaySize.w * -0.5 + x,
            -this.displaySize.h + y,
        )
    }

    generateGrid() {
        const grid = []

        const dbgChars = TextureAtlas.getInstance().generateCharacterList()
        const nChars = dbgChars.length

        for (let row = 0; row < this.gridSize.h; row++) {
            const line = []
            for (let col = 0; col < this.gridSize.w; col++) {
                line.push(Math.random() > 0.6 ? '#' : '')
            }
            grid.push(line)
        }

        return grid
    }
}

