// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
var imgIn;
var matrix = [
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64],
    [1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64, 1/64]
];


var changeFilter = 1;
/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage("assets/husky.jpg");
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas((imgIn.width * 2), imgIn.height);
     varText = createDiv("PRESS 1 - DEFAULT Filter<br/>\ PRESS 2 - GRAYSCALE Filter<br/>\
                     PRESS 3 - INVERT Filter");
    varText.style('font-size', '16px');
    
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    image(earlyBirdFilter(imgIn), imgIn.width, 0);
    

    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed(){
  loop();
}
/////////////////////////////////////////////////////////////////
function earlyBirdFilter(img){
  var resultImg = createImage(imgIn.width, imgIn.height);
    // allow the users to change the filter based on the key pressed
    if(changeFilter == 1){
        resultImg = sepiaFilter(imgIn);
        resultImg = darkCorners(resultImg);
        resultImg = radialBlurFilter(resultImg);
        resultImg = borderFilter(resultImg);
    }
    else if(changeFilter == 2){
        resultImg = grayscaleFilter(imgIn);    
        resultImg = darkCorners(resultImg);
        resultImg = radialBlurFilter(resultImg);
        resultImg = borderFilter(resultImg);
    }
    else if(changeFilter == 3){
        resultImg = invertFilter(imgIn);
        resultImg = darkCorners(resultImg);
        resultImg = radialBlurFilter(resultImg);
        resultImg = borderFilter(resultImg);
    }
  
  return resultImg;
}

//Step 1
function sepiaFilter(img){
    var imgOut = createImage(imgIn.width, img.height);
    
    imgOut.loadPixels();
    img.loadPixels();
    
    for(var x=0; x<img.width;x++){
        for(var y=0; y<img.height;y++){
            var index = (y*img.width + x) * 4;
            
            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            var newRed = (oldRed * .393) + (oldGreen *.769) + (oldBlue * .189);
            var newGreen = (oldRed * .349) + (oldGreen *.686) + (oldBlue * .168);
            var newBlue = (oldRed * .272) + (oldGreen *.534) + (oldBlue * .131);
            
            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}


//Step 2
function darkCorners(img){
    var imgOut = createImage(img.width, img.height);
    
    imgOut.loadPixels();
    img.loadPixels();
    var midX = img.width/2;
    var midY = img.height/2;
    var maxDistance = dist(midX, midY, 0, 0);
    
    for(var x=0; x<imgOut.width;x++){
        for(var y=0; y<imgOut.height;y++){
            var dynLum = 1;
            var distance = dist(x, y, midX, midY);
            
            if(distance >= 300 && distance <= 450){
                var dynLum = map(distance, 300, 450, 1, 0.4);
                var dynLum = constrain(dynLum, 0.4, 1);
            }
            
            else if(distance > 450){
                    var maxDistance = dist(midX, midY, 0, 0);
                    var dynLum = map(distance, 450, maxDistance, 0.4, 0);
                    var dynLum = constrain(dynLum, 0, 0.4);
            }
            else{
                dynLum = 1;
            }
                
            var index = (y*img.width + x) * 4;
            
            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2]; 
                
            imgOut.pixels[index + 0] = oldRed * dynLum;
            imgOut.pixels[index + 1] = oldGreen * dynLum;
            imgOut.pixels[index + 2] = oldBlue * dynLum;
            imgOut.pixels[index + 3] = 255;
            }
        }
    
    imgOut.updatePixels();
    return imgOut;
}


//step 3
function radialBlurFilter(img){
    var imgOut = createImage(imgIn.width, img.height);
    
    imgOut.loadPixels();
    img.loadPixels();
    var matrixSize = matrix.length;
    
    for(var x=0; x<img.width;x++){
        for(var y=0; y<img.height;y++){
            var index = (y*img.width + x) * 4;
            
            var oldRed = img.pixels[index + 0];
            var oldGreen = img.pixels[index + 1];
            var oldBlue = img.pixels[index + 2];
            
            var c = convolution(x, y, matrix, matrixSize, img);
            
            var mouseDistance = dist(x, y, mouseX, mouseY);
            var dynBlur = map(mouseDistance, 100, 300, 0, 1);
            dynBlur = constrain(dynBlur, 0, 1);
            
          
            
            var newRed = c[0] * dynBlur + oldRed * (1 - dynBlur);
            var newGreen = c[1] * dynBlur + oldGreen * (1 - dynBlur);
            var newBlue = c[2] * dynBlur + oldBlue * (1 - dynBlur);
            
            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

function convolution(x, y, matrix, matrixSize, img){
    var totalRed = 0.0;
    var totalGreen = 0.0;
    var totalBlue = 0.0;
    
    var offset = floor(matrixSize / 2);
    
    for(var i=0; i<matrixSize; i++){
        for(var j=0; j<matrixSize; j++){
            var xloc = x + i - offset;
            var yloc = y + j - offset;
            
            var index = (img.width * yloc + xloc) * 4;
            
            index = constrain(index, 0, img.pixels.length - 1);
            
            totalRed += img.pixels[index + 0] * matrix[i][j];
             totalGreen += img.pixels[index + 1] * matrix[i][j];
             totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    return [totalRed, totalGreen, totalBlue]
}


//step 4 - add border around the image
function borderFilter(img){
    var borderBuffer = createGraphics(img.width,img.height);
    borderBuffer.image(img, 0, 0);
    borderBuffer.noFill();
    borderBuffer.stroke(255,255,255);
    borderBuffer.strokeWeight(40);
    borderBuffer.rect(0, 0, img.width, img.height, 100);
    borderBuffer.strokeWeight(35);
    borderBuffer.rect(0, 0, img.width, img.height);
    return borderBuffer;
}



//step 5 - further development

// gray scale filter activated if key '2' is pressed
function grayscaleFilter(img){
    var imgOut = createImage(imgIn.width, img.height);
    
    imgOut.loadPixels();
    img.loadPixels();
    
    for(var x=0; x<img.width;x++){
        for(var y=0; y<img.height;y++){
            var index = (y*img.width + x) * 4;
            
            var r = img.pixels[index + 0];
            var g = img.pixels[index + 1];
            var b = img.pixels[index + 2];
            
           // var gray = (r + g + b) / 3;
            var gray = r * 0.299 + g * 0.587 + b * 0.0114;
            imgOut.pixels[index + 0] = gray;
            imgOut.pixels[index + 1] = gray;
            imgOut.pixels[index + 2] = gray;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}


// invert filter activated if key '3' is pressed
function invertFilter(img){
    var imgOut = createImage(imgIn.width, img.height);
    
    imgOut.loadPixels();
    img.loadPixels();
    
    for(var x=0; x<img.width;x++){
        for(var y=0; y<img.height;y++){
            var index = (y*img.width + x) * 4;
            
            var r = 255 - img.pixels[index + 0];
            var g = 255 - img.pixels[index + 1];
            var b = 255 - img.pixels[index + 2];
            
            imgOut.pixels[index + 0] = r;
            imgOut.pixels[index + 1] = g;
            imgOut.pixels[index + 2] = b;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}

function keyPressed() {
    // change to default filter (sepia) if key '1' is pressed
    if (key === '1') {
        changeFilter = 1;
        loop();
    } 
    // change to gray scale filter if key '2' is pressed
    if (key === '2'){
        changeFilter = 2;
        loop();
    }
    // change to invert filter if key '3' is pressed
    if (key === '3'){
        changeFilter = 3;
        loop();
    }
  
    return false; 
}



