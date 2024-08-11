const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const basePixelSize = 32;
let scale = 1;

const width = canvas.width
const height = canvas.height

const pixelSize = 32

const zoomSlider = document.getElementById('zoomSlider');
const colorInput = document.getElementById('color');

var save = []

console.log(width, height)

function setGrid(){
    for(let x = 0; x < width; x += pixelSize){
        for(let y = 0; y < height; y += pixelSize){
            color = {'r': '12','g': 'ac','b': '32'}
            info = {'x': x,'y': y,'color': color}
            save.push(info)
        }
    }
    drawGrid()
}
setGrid()


function drawGrid(){
    ctx.clearRect(0, 0, width, height)
    for(let i = 0; i < save.length; i+=1){
        info = save[i]
        // ctx.strokeRect(info.x, info.y, pixelSize, pixelSize)
        if(info.color.r != '#' && info.color.g != '#' && info.color.b != "#"){
            ctx.fillStyle = `#${info.color.r}${info.color.g}${info.color.b}`
            ctx.fillRect(info.x, info.y, pixelSize, pixelSize)
        }
    }
}

function fillPixel(x, y){
    ctx.fillStyle = colorInput.value
    ctx.fillRect(x, y, pixelSize, pixelSize)
    for(let i = 0; i < save.length; i+=1){
        info = save[i]
        if(info.x === x && info.y === y){
            info.color = {'r': colorInput.value.substring(1, 3), 'g': colorInput.value.substring(3, 5), 'b': colorInput.value.substring(5, 7)}
        }
    }
}

zoomSlider.addEventListener('input' , (e)=>{
    scale = e.target.value
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    drawGrid()
})


canvas.addEventListener('click', (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize / scale) * pixelSize
    const y = Math.floor((e.clientY - rect.top) / pixelSize / scale) * pixelSize
    console.log(x, y, scale, (e.clientX - rect.left) / pixelSize / scale, e.clientY)
    fillPixel(x, y)
})

