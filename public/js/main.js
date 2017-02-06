var socket;
var grid;
var user;
var users;
var canvasSize = 700; // Same as on server
var nrOfRows = 15; // Same as on server
var cellWidth = cellHeight = canvasSize / nrOfRows;

var offset = 3; // Small offset for smaller user box

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
    background(50, 50, 200);
    
    
    if(grid){
        drawGrid();
    }
    
    if(users){
        drawUsers();
    }
    
    // Drawing this user
    noStroke();
    fill(user.col[0], user.col[1], user.col[2]);
    rect(user.i * cellWidth, user.j * cellHeight, cellWidth, cellHeight);
    
    socket.emit('userNewLocation', user);
}

function drawGrid(){
    grid.forEach(cell => {
        
        noStroke();
        if(cell.visited){
            fill(50, 50, 200);
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
        // Draw final cell
        if(cell.final){
            fill('#0b0e21');
            rect(cell.x, cell.y, cell.size, cell.size);
        }
        
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
        
    });
}

function drawUsers(){
    users.forEach(user => {
        if(user.id !== socket.id) {// only draw the other users
            fill(user.col[0], user.col[1], user.col[2]);
            rect(user.i * cellWidth, user.j * cellHeight, cellWidth, cellHeight);
        }
    });
}