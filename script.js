var angle = 0,
    scale = 1.0;
    tplTemp = document.createElement("img");

tplTemp.src = 'avatar-template.png';

function previewFile(){
    var filename = $(this).val().split('\\'),
        cropCanvas = document.getElementById('cropCanvas'),
        finalCanvas = document.getElementById('finalCanvas'),
        preview = document.getElementById('canvasImg'),
        cCtx = cropCanvas.getContext('2d'),
        fCtx = finalCanvas.getContext('2d'),
        file = document.querySelector('input[type=file]').files[0],
        reader = new FileReader();
    
    $("#file-info").val(filename[filename.length - 1]);

    reader.onloadend = function () {
        cCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        fCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        
        preview.src = reader.result;
        
        preview.onload = function () {
            var translatePos = getCoordinates(cropCanvas, preview),
                scale = 1.0;

            draw(scale, translatePos);
            
            updateTPLCanvas();
            
            $("#TPLCanvas").removeClass("hidden");
        };
    };

    if (file) {
       reader.readAsDataURL(file); //reads the data as a URL
    } else {
       preview.src = "";
    }
}

function updateTPLCanvas() {
    var cropCanvas = document.getElementById('cropCanvas'),
        canvas = document.getElementById('finalCanvas'),
        ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(cropCanvas, 20, 20);
    // ctx.fillStyle = "RGBA(140, 29, 29, 0.6)";
    // ctx.fillRect(0, 0, 600, 600);
    ctx.drawImage(tplTemp, 0, 0, 600, 600);
}

function rotateCanvas(deg, translatePos) {
    var preview = document.getElementById('canvasImg'),
        canvas = document.getElementById("cropCanvas"),
        ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(deg * (Math.PI/180));
    ctx.drawImage(preview, -preview.width/2, -preview.height/2);
    ctx.restore();

    updateTPLCanvas();
}


function draw(scale, translatePos) {
    var preview = document.getElementById('canvasImg'),
        canvas = document.getElementById("cropCanvas"),
        ctx = cropCanvas.getContext("2d");
 
    // clear cropCanvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(translatePos.x, translatePos.y);
    ctx.scale(scale, scale);
    ctx.translate(-translatePos.x, -translatePos.y);
    ctx.drawImage(preview, translatePos.x, translatePos.y);
    ctx.restore();

    updateTPLCanvas();
}

function getCoordinates(canvas, image) {
    return {
        x: (canvas.width / 2) - (image.width / 2),
        y: (canvas.height / 2) - (image.height / 2)
    };
}

function init(){
    var canvas = document.getElementById("cropCanvas"),
        preview = document.getElementById("canvasImg"),
        zoomIn = document.getElementById("plus"),
        zoomOut = document.getElementById("minus"),
        clockwise = document.getElementById("clockwise"),
        counterclockwise = document.getElementById("counterclockwise"),
        translatePos = {},
        scaleMultiplier = 0.9,
        startDragOffset = {},
        mouseDown = false;
 
    // add button event listeners
    zoomIn.addEventListener("click", function () {
        translatePos = getCoordinates(canvas, preview);
        scale /= scaleMultiplier;
        draw(scale, translatePos);
    }, false);
 
    zoomOut.addEventListener("click", function () {
        translatePos = getCoordinates(canvas, preview);
        scale *= scaleMultiplier;
        draw(scale, translatePos);
    }, false);

    clockwise.addEventListener("click", function (e) {
        translatePos = getCoordinates(canvas, preview);
        angle += 45;
        rotateCanvas(angle, translatePos);
    });

    counterclockwise.addEventListener("click", function (e) {
        translatePos = getCoordinates(canvas, preview);
        angle -= 45;
        rotateCanvas(angle, translatePos);
    });
 
    canvas.addEventListener("mouseover", function (e) {
        mouseDown = false;
    });
 
    canvas.addEventListener("mouseout", function (e) {
        mouseDown = false;
    });
    
    canvas.addEventListener("mouseup", function (e) {
        mouseDown = false;
    });
    
    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", function (e) {
        translatePos = getCoordinates(canvas, preview);
        mouseDown = true;
        startDragOffset.x = e.clientX - translatePos.x;
        startDragOffset.y = e.clientY - translatePos.y;
    });
 
    canvas.addEventListener("mousemove", function(e){
        if (mouseDown) {
            translatePos.x = e.clientX - startDragOffset.x;
            translatePos.y = e.clientY - startDragOffset.y;
            draw(scale, translatePos);
        }
    });

    // add event listeners to handle mobile drag
    canvas.addEventListener("touchstart", function (e) {
        translatePos = getCoordinates(canvas, preview);
        mouseDown = true;
        startDragOffset.x = e.touches[0].clientX - translatePos.x;
        startDragOffset.y = e.touches[0].clientY - translatePos.y;
    });

    canvas.addEventListener("touchmove", function (e){
        if (mouseDown) {
            translatePos.x = e.touches[0].clientX - startDragOffset.x;
            translatePos.y = e.touches[0].clientY - startDragOffset.y;

            draw(scale, translatePos);
            e.preventDefault();
        }
    });

    canvas.addEventListener("touchend", function (e) {
        mouseDown = false;
    });

    canvas.addEventListener("touchcancel", function (e) {
        mouseDown = false;
    });
 
    draw(scale, translatePos);
}

$(document).ready(function () {
    init();
    $('.browser').on('change', previewFile);
});