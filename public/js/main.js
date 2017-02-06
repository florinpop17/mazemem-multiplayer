var socket;
var grid;
var user;
var users;
var canvasSize = 700; // Same as on server
var nrOfRows = 15; // Same as on server
var cellWidth = cellHeight = canvasSize / nrOfRows;

var offset = 4; // Small offset for smaller user box

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    socket = io.connect();
    
    user = {
        i: 0,
        j: 0,
        name: 'SomeName'
    }
    
    socket.emit('start', user);
    
    // Getting the grid && setting the user.id
    socket.on('theGrid', function(_grid){
        grid = _grid; 
        user.id = socket.id;
        loop();
    });
    
    socket.on('tick', function(_users){
        users = _users; 
    });
    
    noLoop();
}

function draw() {
    background('#3498db');
    
    
    if(grid){
        drawGrid();
    }
    
    if(users){
        drawUsers();
    }
    
    // Drawing this user
    drawAUser(user);
    
    socket.emit('userNewLocation', user);
}

function drawGrid(){
    grid.forEach(cell => {
        
        noStroke();
        if(cell.visited){
            fill('#3498db');
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
        // Draw final cell
        if(cell.final){
            fill(255, 0, 255);
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
        stroke('#000000');
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
        
    });
}

function drawUsers(){
    users.forEach(user => {
        if(user.id !== socket.id) {// only draw the other users
            drawAUser(user);
        }
    });
}

function drawAUser(_user){
    noStroke();
    fill(_user.col[0], _user.col[1], _user.col[2]);
//    rect(_user.i * cellWidth + offset, _user.j * cellHeight + offset, cellWidth - 2*offset, cellHeight - 2*offset);
}