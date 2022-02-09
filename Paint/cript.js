

onload = () => {
    const canvas = document.createElement('canvas');
    const cont = document.getElementById('cont');
    
    cont.appendChild(canvas);

    canvas.width = 1300;
    canvas.height = 700;
    canvas.style.margin = 'auto';
    canvas.style.boxShadow = '5px 5px 10px 5px rgba(0, 0, 0, .4)';


    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Кисти

    const brush = document.getElementById('BRUSH');
    const brushCanvas = document.createElement('canvas');
    brushCanvas.style = `display:none;`;
    brushCanvas.width = brush.width ;
    brushCanvas.height = brush.height;
    const brushCtx = brushCanvas.getContext('2d');
    
    const selectColor = (r, g, b) => {
        brushCtx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
        brushCtx.drawImage(brush, 0, 0, brushCanvas.width, brushCanvas.height);
        const imageData = brushCtx.getImageData(0, 0, brushCanvas.width, brushCanvas.height);
        const pixels = imageData.data;

        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const offset = 4 * (y * imageData.width + x);
                pixels[offset+0] = Math.floor(r*pixels[offset+0]/255);
                pixels[offset+1] = Math.floor(g*pixels[offset+1]/255);
                pixels[offset+2] = Math.floor(b*pixels[offset+2]/255);
            }
        }
        console.log(r, g, b);

        brushCtx.putImageData(imageData, 0, 0);
    };


    let white = document.getElementById('white');
    white.onclick = function(){ selectColor(255, 255, 255); }

    let red = document.getElementById('red');
    red.onclick = function(){ selectColor(255, 0, 0); }

    let black = document.getElementById('black');
    black.onclick = function(){ selectColor(0, 0, 0); }

    let orange = document.getElementById('orange');
    orange.onclick = function(){ selectColor(255, 165, 0); }

    let yellow = document.getElementById('yellow');
    yellow.onclick = function(){ selectColor(255, 255, 0); }

    let green = document.getElementById('green');
    green.onclick = function(){ selectColor(0, 128, 0); }

    let blue = document.getElementById('blue');
    blue.onclick = function(){ selectColor(0, 0, 255); }

    let indigo = document.getElementById('indigo');
    indigo.onclick = function(){ selectColor(75, 0, 130); }

    let violet = document.getElementById('violet');
    violet.onclick = function(){ selectColor(238, 130, 238); }

    document.getElementById('color').oninput = function () {
        let bigint = parseInt(this.value.split('#')[1], 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        selectColor(r, g, b)
    }



    selectColor(0, 0, 0);




    let size = 4;
    let tinySize = document.getElementById('tiny_size');
    tinySize.onclick = function(){ size = 2 }

    let verySmallSize = document.getElementById('very_small_size');
    verySmallSize.onclick = function(){ size = 4 }

    let smallSize = document.getElementById('small_size');
    smallSize.onclick = function(){ size = 6 }

    let mediumSize = document.getElementById('medium_size');
    mediumSize.onclick = function(){ size = 10 }

    let largeSize = document.getElementById('large_size');
    largeSize.onclick = function(){ size = 14 }

    let verylargeSize = document.getElementById('very_large_size');
    verylargeSize.onclick = function(){ size = 30 }

    

    const drawBrush = (x, y) => {
      ctx.drawImage(brushCanvas, x - size/2, y - size/2, size, size);
//      ctx.fillStyle = color;
//      ctx.fillRect(x - size/2, y - size/2, size, size);
    }

    const getMouseCoords = e => {
      const rect = canvas.getBoundingClientRect();
      return [e.clientX - rect.x, e.clientY - rect.y]
    }

    let prevX = null;
    let prevY = null;

    
    let workingBrushType = "default";


    let default_brush_button = document.getElementById('default');
    default_brush_button.onclick = function(){ 
        workingBrushType = "default";
        prevX = null;
        prevY = null;
    }

    let line_button = document.getElementById('line');
    line_button.onclick = function(){ 
        workingBrushType = "line";
        prevX = null;
        prevY = null;
    }

    let kvadrat_button = document.getElementById('kvadrat');
    kvadrat_button.onclick = function(){ 
        workingBrushType = "kvadrat";
        prevX = null;
        prevY = null;
    }
    
        

    canvas.onmousedown = e => {
        console.log(e);
        if (e.button == 0) {

        [prevX, prevY] = getMouseCoords(e);

        drawBrush(prevX + 1, prevY);

        } else if (e.button == 2 && e.ctrlKey == true) {
        ctx.fillStyle = `rgb(255, 255, 255)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    
    }

    canvas.onmouseup = e => {
        'if (e.button !== 0) {return ;}'
        if (workingBrushType == "default"){
            prevX = null;
            prevY = null;
        } else if (workingBrushType == "line"){
            if (e.button == 0){
                [x, y] = getMouseCoords(e);
                forEachPixel(prevX, prevY, x, y, drawBrush);
            }
        } else if (workingBrushType == "kvadrat"){
            if (e.button == 0){
                [x, y] = getMouseCoords(e);
                forEachPixel(prevX, prevY, x, prevY, drawBrush);
                forEachPixel(prevX, prevY, prevX, y, drawBrush);

                forEachPixel(x, prevY, x, y, drawBrush);
                forEachPixel(prevX, y, x, y, drawBrush);
            }
        }        
    }

    onmousemove = e => {
        if (workingBrushType == "default"){
            if (prevX > canvas.width) {return;}
            if (prevY > canvas.width) {return;}

            if (prevX == null) {return;}

            [x, y] = getMouseCoords(e);

            

            forEachPixel(prevX, prevY, x, y, drawBrush);

            prevX = x;
            prevY = y;
        } else if (workingBrushType == "line" || workingBrushType == "kvadrat"){
            let trash = 0;
        }
    };
        
};



function drawSpiral(ctx) {
      let size = 1;
      let color = 0;
      let step = 0;
      let angle = Math.PI/2;
      let posX = ctx.canvas.width/2;
      let posY = ctx.canvas.height/2;
      for (let i = 0; i < 3000; i++) {
        const nextPosX = posX + step * Math.cos(angle);
        const nextPosY = posY + step * Math.sin(angle);
  
  
        forEachPixel(posX, posY, nextPosX, nextPosY, (x, y) => {
         ctx.fillStyle = `rgb(255, ${Math.floor(color)}, 255)`;
         ctx.fillRect(posX - size/2, posY - size/2, size, size);
        })
  
        posX = nextPosX
        posY = nextPosY
  
        size += 0.0001;
        color += 0.001; if (color > 255){color = 255;};
        step += 0.1;
        angle = (angle + 0.1) % (Math.PI * 2);
      }
}




function forEachPixel(x0, y0, x1, y1, action){
    x0 = Math.round(x0)
    x1 = Math.round(x1)
    y0 = Math.round(y0)
    y1 = Math.round(y1)

    const dx = x1 - x0;
    const dy = y1 - y0;

    action(x0, y0);

    if (dx == 0 && dy == 0){ return; }

    const maxDiff = Math.max(Math.abs(dx), Math.abs(dy));
    let x = x0;
    let y = y0;
    for (let i = 0; i < maxDiff; i++){
      x += dx / maxDiff;
      y += dy / maxDiff;

      action(x, y);
    }
}

