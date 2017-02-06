var socket;
var grid;
var canvasSize = 700; // Same as on server

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    socket = io.connect();
    
    // Getting the grid
    socket.on('theGrid', function(_grid){
        grid = _grid; 
        
        console.log('got maze / loop');
        loop();
    });
    
    console.log('setup / noLoop');
    noLoop();
}

function draw() {
    background(51);
    
    
    if(maze){
        drawGrid();
    }
}

function drawGrid(){
    
}