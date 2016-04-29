var startX,
    startY,
    angle = 0,
    scale = 1.0,
    scaleMultiplier = 0.1,
    preview = document.getElementById('canvasImg'),
    canvas = document.getElementById('cropCanvas'),
    tplCanvas = document.getElementById('finalCanvas'),
    ctx = cropCanvas.getContext('2d'),
    tplCtx = finalCanvas.getContext('2d'),
    pos = {},
    isDown = false,
    tplTemp = document.createElement("img");

tplTemp.src = 'avatar-template.png';

function previewFile(){
    var filename = $(this).val().split('\\'),
        file = document.querySelector('input[type=file]').files[0],
        reader = new FileReader();
    
    $("#file-info").val(filename[filename.length - 1]);

    reader.onloadend = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tplCtx.clearRect(0, 0, tplCanvas.width, tplCanvas.height);
        
        preview.src = reader.result;
        
        preview.onload = function () {
            pos.x = (canvas.width / 2) - (preview.width / 2);
            pos.y = (canvas.height / 2) - (preview.height / 2);
            drawImage();
            
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
    tplCtx.clearRect(0, 0, canvas.width, canvas.height);
    tplCtx.drawImage(cropCanvas, 20, 20);
    // tplCtx.fillStyle = "RGBA(140, 29, 29, 0.6)";
    // tplCtx.fillRect(0, 0, 600, 600);
    tplCtx.drawImage(tplTemp, 0, 0, 600, 600);
}

function drawImage() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.scale(scale, scale);
    ctx.rotate(angle * Math.PI/180);
    ctx.translate(-canvas.width/2, -canvas.height/2);
    ctx.drawImage(preview, pos.x, pos.y);
    ctx.restore();

    updateTPLCanvas();
}

function init() {
    var zoomIn = document.getElementById("plus"),
        zoomOut = document.getElementById("minus"),
        clockwise = document.getElementById("clockwise"),
        counterclockwise = document.getElementById("counterclockwise"),
        mousePos = {},
        x, y;
 
    // add button event listeners
    zoomIn.addEventListener("click", function () {
        scale += scaleMultiplier;
        drawImage();
    }, false);
 
    zoomOut.addEventListener("click", function () {
        scale -= scaleMultiplier;
        drawImage();
    }, false);

    clockwise.addEventListener("click", function (e) {
        angle += 45;
        drawImage();
    });

    counterclockwise.addEventListener("click", function (e) {
        angle -= 45;
        drawImage();
    });
 
    canvas.addEventListener("mouseover", function (e) {
        isDown = false;
    });
 
    canvas.addEventListener("mouseout", function (e) {
        isDown = false;
    });
    
    canvas.addEventListener("mouseup", function (e) {
        isDown = false;
    });
    
    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", function (e) {
        startX = e.clientX - pos.x;
        startY = e.clientY - pos.y;
        isDown = true;
    });
 
    canvas.addEventListener("mousemove", function (e) {
        if (isDown) {
            pos.x = e.clientX - startX;
            pos.y = e.clientY - startY;

            drawImage();
        }
    });

    // add event listeners to handle mobile drag
    canvas.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX - pos.x;
        startY = e.touches[0].clientY - pos.y;
        isDown = true;
    });

    canvas.addEventListener("touchmove", function (e) {
        if (isDown) {
            pos.x = e.touches[0].clientX - startX;
            pos.y = e.touches[0].clientY - startY;
            
            drawImage();

            e.preventDefault();
        }
    });

    canvas.addEventListener("touchend", function (e) {
        isDown = false;
    });

    canvas.addEventListener("touchcancel", function (e) {
        isDown = false;
    });
}

$(document).ready(function () {
    init();
    $('.browser').on('change', previewFile);
});