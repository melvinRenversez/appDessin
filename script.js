const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const width = canvas.width
const height = canvas.height

const pixelSize = 32
let scale = 1

const zoomSlider = document.getElementById('zoomSlider')
const colorInput = document.getElementById('color')

let imageData = ctx.createImageData(width, height);

function drawGrid(){
    ctx.fillStyle = '#cccccc'
    ctx.lineWidth = 1 / scale;

    for(let x = 0; x < width; x += pixelSize){
        for(let y = 0; y < height; y += pixelSize){
            ctx.strokeRect(x, y, pixelSize, pixelSize)
        }
    }
}
function drawImageData() {
    // Restaurer les pixels colorés
    ctx.putImageData(imageData, 0, 0);
}

function fillPixel(x, y, color){

    const pixelX = Math.floor(x / scale);
    const pixelY = Math.floor(y / scale);

    ctx.fillStyle = color
    ctx.fillRect(x, y, pixelSize, pixelSize)

    let pixelIndex = (Math.floor(y / pixelSize) * canvas.width + Math.floor(x / pixelSize)) * 4;
    let [r, g, b] = ctx.fillStyle.match(/\d+/g).map(Number);
    imageData.data[pixelIndex] = r;
    imageData.data[pixelIndex + 1] = g;
    imageData.data[pixelIndex + 2] = b;
    imageData.data[pixelIndex + 3] = 255;

}
zoomSlider.addEventListener('input' , (e)=>{
    scale = e.target.value
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    drawImageData()
    drawGrid()
})

canvas.addEventListener('click', (e)=>{
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize * scale) * pixelSize
    const y = Math.floor((e.clientY - rect.top) / pixelSize * scale) * pixelSize
    color = colorInput.value
    fillPixel(x, y, color)
})

drawGrid()