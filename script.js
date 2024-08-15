const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const inputSave = document.getElementById('inputSave');

// const basePixelSize = 16;
let scale = 1;

const width = canvas.width
const height = canvas.height

const pixelSize = 8

const zoomSlider = document.getElementById('zoomSlider');
const colorInput = document.getElementById('color');

let isDragging = false;
let isDrawing = false;
let isClearing = false;

let startX, startY;
let offsetX = 0, offsetY = 0;

var save = []

console.log(width, height)

ctx.fillStyle = "#000000"

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
    const canvasWidth = width * scale;  // Largeur du canevas avec l'échelle appliquée
    const canvasHeight = height * scale;  // Hauteur du canevas avec l'échelle appliquée

    // Limites maximales du décalage (le canevas ne peut pas être déplacé au-delà de son origine)
    const maxOffsetX = 0;
    const maxOffsetY = 0;

    // Limites minimales du décalage (le canevas ne peut pas être déplacé au-delà du bord visible)
    const minOffsetX = width - canvasWidth;
    const minOffsetY = height - canvasHeight;

    console.log('limites', minOffsetX, minOffsetY, maxOffsetX, maxOffsetY);
    return { minOffsetX, minOffsetY, maxOffsetX, maxOffsetY };
}

function applyLimits() {
    const { minOffsetX, minOffsetY, maxOffsetX, maxOffsetY } = calculateLimits();
    offsetX = Math.max(Math.min(offsetX, maxOffsetX), minOffsetX);
    offsetY = Math.max(Math.min(offsetY, maxOffsetY), minOffsetY);
}

// Mettre à jour l'écouteur d'événements pour le zoom
zoomSlider.addEventListener('input' , (e)=>{
    scale = e.target.value;
    applyLimits();
    drawGrid();
});

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
        applyLimits()
        drawGrid();
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

document.getElementById('draw').addEventListener('scroll', (e) => {
    console.log('Défilement détecté', e);
    console.log('Scroll position:', canvasContainer.scrollTop, canvasContainer.scrollLeft);
})

colorInput.addEventListener('input', () => {
    ctx.fillStyle = colorInput.value;
})

function exportSave(){
    console.log('export');
    
    const saveData = JSON.stringify(save);
    
    const filename = 'PhoMEl.$MEL';
    
    // Créer un élément <a>
    const element = document.createElement('a');
    
    // Créer un objet Blob avec le contenu du fichier (le texte de l'utilisateur)
    const file = new Blob([saveData], {type: 'text/plain'});
    
    // Créer une URL pour le Blob
    element.href = URL.createObjectURL(file);
    
    // Spécifier le nom du fichier à télécharger
    element.download = filename;
    
    // Ajouter l'élément <a> au DOM
    document.body.appendChild(element);
    
    // Déclencher un clic sur l'élément <a>
    element.click();
    
}
function importSave() {
    if (inputSave.files.length === 0) {
        console.error('Aucun fichier sélectionné.');
        return;
    }

    const file = inputSave.files[0];

    if (!file.name.endsWith('.$MEL')) {
        console.error('Le fichier sélectionné n\'a pas l\'extension .MEL.');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const fileContent = e.target.result;

        try {
            // Parser le contenu comme JSON
            save = JSON.parse(fileContent);
            console.log('Données JSON:', save);
            console.log(JSON.stringify(save));
            drawGrid(); // Redessiner la grille avec les nouvelles données
        } catch (err) {
            console.error('Le contenu du fichier n\'est pas du JSON valide.');
        }
    };

    // Lire le fichier comme texte
    reader.readAsText(file);
}
