let grid = generateGrid()
let tileCount = { w: 41, h: 21 }
let offset = { x: 0, y: 0 }
let container = null
let rows = []

init()
tick()

window.addEventListener('keydown', function(e) {
   if (e.key == 'a') { offset.x = Math.max(0, offset.x - 1) }
   if (e.key == 'd') { offset.x = Math.min(100 - tileCount.w, offset.x + 1) }
   if (e.key == 'w') { offset.y = Math.max(0, offset.y - 1) }
   if (e.key == 's') { offset.y = Math.min(100 - tileCount.h, offset.y + 1) }
})

function init() {
    container = document.createElement('div')
    container.classList.add('container')
    document.body.appendChild(container)
    
    $(container).css({
        transform: 'perspective(1000px) rotateX(45deg)'
    })

    for (let row = 0; row < tileCount.h; row++) {
        let rowEl = document.createElement('div')
        rowEl.classList.add('row')

        let blurStr = Math.abs(row - (tileCount.h * 0.5)) / tileCount.h * 3
        blurStr = blurStr.toFixed(4)

        $(rowEl).css({
            'text-shadow': `0px 0px ${blurStr * 3}px #fff`,
            'filter': `blur(${blurStr}px)`,
            'opacity': Math.max(0.3, 1 - blurStr * 0.5)
        })

        container.appendChild(rowEl)
        rows.push(rowEl)
    }

    let containerOverlay = document.createElement('div')
    containerOverlay.classList.add('container-overlay')
    container.appendChild(containerOverlay)
}

function tick() {
    for (let row = 0; row < tileCount.h; row++) {
        let str = ''

        for (let col = 0; col < tileCount.w; col++) {
            str += grid[row + offset.y][col + offset.x]
        }

        rows[row].innerHTML = str
    }
    window.requestAnimationFrame(tick)
}

function generateGrid() {
    const grid = []

    for (let row = 0; row < 100; row++) {
        const line = []
        for (let col = 0; col < 100; col++) {
            line.push(Math.random() > 0.6 ? '#' : '&nbsp;')
        }
        grid.push(line)
    }

    return grid
}

