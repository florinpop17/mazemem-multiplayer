var socket;
var maze;
var canvasSize = 700; // Same as on server

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    socket = io.connect();
    socket.on('theMaze', function(_maze){
        maze = _maze; 
        
        console.log('got maze / loop');
        loop();
    });
    
    console.log('setup / noLoop');
    noLoop();
}

function draw() {
    background(51);
    
    
    if(maze){
        drawMaze();
    }
}

function drawMaze(){
    
}