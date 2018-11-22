class Map {
    constructor(pixiApp) {
        this.pixiApp = pixiApp
        this.lastMoveTime = Date.now()
        this.tileCount = { w: 31, h: 21 }
        this.offset = { x: 10, y: 10 }
        this.tileSize = { w: 40, h: 80 }
        this.gridSize = { w: 100, h: 100 }
        this.displaySize = {
            w: this.tileCount.w * this.tileSize.w,
            h: this.tileCount.h * this.tileSize.h
        }

        this.grid = this.generateGrid()
        this.container = this.initializeContainer()

        this.container.addChild(this.container)

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
    }

    addSprite(tile, col, row) {
        const texture = TextureAtlas.getInstance().get(tile)
        const s = new PIXI.projection.Sprite2d(texture)
        s.width = this.tileSize.w
        s.height = this.tileSize.h
        s.position = this.xyToPerspective(
            s.x = col * this.tileSize.w,
            s.y = row * this.tileSize.h
        )
        this.container.addChild(s)
    }

    moveLeft() {
        if (this.offset.x === 0) return
        if (Date.now() - this.lastMoveTime < 200) return

        for (let row = 0; row < this.tileCount.h; row++) {
            this.addSprite(this.grid[this.offset.y + row][this.offset.x - 1], -1, row)
        }

        this.offset.x--
        this.lastMoveTime = Date.now()
    }

    translateY(offset) {

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
                line.push(dbgChars[( row + col ) % nChars])
            }
            grid.push(line)
        }

        return grid
    }
}

