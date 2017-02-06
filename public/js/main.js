var socket;
var grid;
var user;
var canvasSize = 700; // Same as on server

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    socket = io.connect();
    
    user = {
        i: 0,
        j: 0,
        name: 'SomeName',
        col: [random(255), random(255), random(255)]
    }
    
    socket.emit('start', user);
    
    // Getting the grid
    socket.on('theGrid', function(_grid){
        grid = _grid; 
        
        loop();
    });
    
    noLoop();
}

function draw() {
    background(51);
    
    
    if(grid){
        drawGrid();
    }
}

function drawGrid(){
    grid.forEach(cell => {
        
        stroke('#FFFFFF');
        strokeWeight(2);
        // The top wall
        if(cell.walls[0]){
            line(cell.x, cell.y, cell.x + cell.size, cell.y);
        }
        
        // The right wall
        if(cell.walls[1]){
            line(cell.x + cell.size, cell.y, cell.x + cell.size, cell.y + cell.size);
        }
        
        // The bottom wall
        if(cell.walls[2]){
            line(cell.x, cell.y + cell.size, cell.x + cell.size, cell.y + cell.size);
        }
        
        // The left wall
        if(cell.walls[3]){
            line(cell.x, cell.y, cell.x, cell.y + cell.size);
        }
        
        if(cell.visited){
            fill(200, 0, 100);
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
        // Draw final cell
        if(cell.final){
            fill('#0b0e21');
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
        if(cell.hasPlayer){
            fill(cell.col[0], cell.col[1], cell.col[2]);
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
    });
}