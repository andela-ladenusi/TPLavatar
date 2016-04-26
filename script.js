var tplTemp = document.createElement('img');
tplTemp.src = 'avatar-template.png';

function previewFile(){
    var filename = $(this).val().split('\\');
    $("#file-info").val(filename[filename.length - 1]);
    var cropCanvas = document.getElementById('cropCanvas');
    var finalCanvas = document.getElementById('finalCanvas');
    var preview = document.getElementById('canvasImg'); //selects the query named img
    var cCtx = cropCanvas.getContext('2d');
    var fCtx = finalCanvas.getContext('2d');
    var x = cropCanvas.width/2 - preview.width/2;
    var y = cropCanvas.height/2 - preview.height/2;
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        cCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
        fCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        preview.src = reader.result;
        preview.onload = function () {
            var translatePos = {
                x: cropCanvas.width / 2,
                y: cropCanvas.height / 2
            };
            var scale = 1.0;

            draw(scale, translatePos);
            // cCtx.drawImage(preview, 0, 0);
            updateTPLCanvas();
        };
    };

    if (file) {
       reader.readAsDataURL(file); //reads the data as a URL
    } else {
       preview.src = "";
    }
}

function updateTPLCanvas() {
    var finalCanvas = document.getElementById('finalCanvas');
    var fCtx = finalCanvas.getContext('2d');
    
    fCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
    fCtx.drawImage(cropCanvas, 20, 20);
    // fCtx.fillStyle = "RGBA(140, 29, 29, 0.6)";
    // fCtx.fillRect(0, 0, 600, 600);
    fCtx.drawImage(tplTemp, 0, 0, 600, 600);
}


function draw(scale, translatePos){
    var preview = document.getElementById('canvasImg');
    var cropCanvas = document.getElementById("cropCanvas");
    var cCtx = cropCanvas.getContext("2d");
 
    // clear cropCanvas
    cCtx.clearRect(0, 0, cropCanvas.width, cropCanvas.height);
 
    cCtx.save();
    cCtx.translate(translatePos.x, translatePos.y);
    cCtx.scale(scale, scale);
    cCtx.translate(-translatePos.x, -translatePos.y);
    cCtx.drawImage(preview, translatePos.x, translatePos.y);

    cCtx.restore();

    updateTPLCanvas();
}

function init(){
    var canvas = document.getElementById("cropCanvas");
 
    var translatePos = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
 
    var scale = 1.0;
    var scaleMultiplier = 0.9;
    var startDragOffset = {};
    var mouseDown = false;
 
    // add button event listeners
    document.getElementById("plus").addEventListener("click", function(){
        scale /= scaleMultiplier;
        draw(scale, translatePos);
    }, false);
 
    document.getElementById("minus").addEventListener("click", function(){
        scale *= scaleMultiplier;
        draw(scale, translatePos);
    }, false);
 
    canvas.addEventListener("mouseover", function(evt){
        mouseDown = false;
    });
 
    canvas.addEventListener("mouseout", function(evt){
        mouseDown = false;
    });
    
    canvas.addEventListener("mouseup", function(evt){
        mouseDown = false;
    });
    
    // add event listeners to handle screen drag
    canvas.addEventListener("mousedown", function(evt){
        mouseDown = true;
        startDragOffset.x = evt.clientX - translatePos.x;
        startDragOffset.y = evt.clientY - translatePos.y;
    });
 
    canvas.addEventListener("mousemove", function(evt){
        if (mouseDown) {
            translatePos.x = evt.clientX - startDragOffset.x;
            translatePos.y = evt.clientY - startDragOffset.y;
            draw(scale, translatePos);
        }
    });

    // add event listeners to handle mobile drag
    canvas.addEventListener("touchstart", function (e) {
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