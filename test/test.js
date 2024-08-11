const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const basePixelSize = 32;
let scale = 1;

const width = canvas.width
const height = canvas.height

const pixelSize = 32

const zoomSlider = document.getElementById('zoomSlider');
const colorInput = document.getElementById('color');

let isDragging = false;
let isDrawing = false;
let isClearing = false;

let startX, startY;
let offsetX = 0, offsetY = 0;

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

    ctx.setTransform(scale, 0, 0, scale, offsetX, offsetY);

    for(let i = 0; i < save.length; i+=1){
        info = save[i]
        ctx.strokeRect(info.x, info.y, pixelSize, pixelSize)
        if(info.color.r != '#' && info.color.g != '#' && info.color.b != "#"){
            ctx.fillStyle = `#${info.color.r}${info.color.g}${info.color.b}`
            ctx.fillRect(info.x, info.y, pixelSize, pixelSize)
        }
    }
}
function calculateLimits() {
    const canvasWidth = width / scale;
    const canvasHeight = height / scale;
    const contentWidth = width;
    const contentHeight = height;

    // Limites du décalage en fonction du zoom
    const maxOffsetX = Math.min(0, canvasWidth - contentWidth);
    const maxOffsetY = Math.min(0, canvasHeight - contentHeight);

    return { maxOffsetX, maxOffsetY };
}

function applyLimits() {
    const { maxOffsetX, maxOffsetY } = calculateLimits();
    offsetX = Math.max(Math.min(offsetX, 0), maxOffsetX);
    offsetY = Math.max(Math.min(offsetY, 0), maxOffsetY);
}

zoomSlider.addEventListener('input' , (e)=>{
    scale = e.target.value
    applyLimits()
    drawGrid()
})

function fillPixel(x, y, color){
    ctx.fillStyle = color
    ctx.fillRect(x, y, pixelSize, pixelSize)
    for(let i = 0; i < save.length; i+=1){
        info = save[i]
        if(info.x === x && info.y === y){
            info.color = {'r': colorInput.value.substring(1, 3), 'g': colorInput.value.substring(3, 5), 'b': colorInput.value.substring(5, 7)}
        }
    }
}


canvas.addEventListener('click', (e)=>{
    color = colorInput.value
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / scale / pixelSize) * pixelSize
    const y = Math.floor((e.clientY - rect.top - offsetY) / scale / pixelSize) * pixelSize

    console.log(x, y)

    fillPixel(x, y, color)
})

canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    color = "#ffffff"
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / scale / pixelSize) * pixelSize
    const y = Math.floor((e.clientY - rect.top - offsetY) / scale / pixelSize) * pixelSize
    console.log(x, y, scale, (e.clientX - rect.left) / pixelSize / scale, e.clientY)
    fillPixel(x, y, color)
})

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 1) {
        isDragging = true;
        startX = e.clientX - offsetX;
        startY = e.clientY - offsetY;
        console.log(startX, startY)
        canvas.style.cursor = 'move';
    }
    if (e.button === 0) {
        isDrawing = true;
    }
    if (e.button === 2) {
        isClearing = true;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        console.log("o", offsetX, offsetY)
        drawGrid(); // Redessiner la grille avec le décalage
        console.log("drawing grid")
    }
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left - offsetX) / scale / pixelSize) * pixelSize
    const y = Math.floor((e.clientY - rect.top - offsetY) / scale / pixelSize) * pixelSize
        console.log(x, y, scale, (e.clientX - rect.left) / pixelSize / scale, e.clientY)
        fillPixel(x, y)
    }
    if(isClearing) {
        color = "#ffffff"
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left - offsetX) / scale / pixelSize) * pixelSize
        const y = Math.floor((e.clientY - rect.top - offsetY) / scale / pixelSize) * pixelSize
        console.log(x, y, scale, (e.clientX - rect.left) / pixelSize / scale, e.clientY)
        fillPixel(x, y, color)
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    isDrawing = false;
    isClearing = false;
    canvas.style.cursor = 'default';
});

canvas.addEventListener('mouseout', () => {
    isDragging = false;
});

colorInput.addEventListener('input', () => {
    ctx.fillStyle = colorInput.value;
})

ctx.fillStyle = "#000000"