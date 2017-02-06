var socket;
var grid;
var user;
var users;
var canvasSize = 700; // Same as on server
var nrOfRows = 15; // Same as on server
var cellWidth = cellHeight = canvasSize / nrOfRows;

var offset = 4; // Small offset for smaller user box

var thisUserColor = '#e67e22';
var othersColor = '#c0392b';

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    socket = io.connect();
    
    user = {
        i: 0,
        j: 0,
        name: 'SomeName',
        finished: false
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
    drawAUser(user, thisUserColor);
    
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
            drawAUser(user, othersColor);
        }
    });
}

function drawAUser(_user, color){
    noStroke();
    fill(color);
    ellipse(_user.i * cellWidth + cellWidth/2, _user.j * cellHeight + cellHeight/2, cellWidth - 2*offset, cellHeight - 2*offset);
}

function keyPressed() {
    
    if(!user.finished){
        // Check if that cell exists and if there isn't a wall opposite to the key pressed
        if(keyCode === UP_ARROW){
            if(grid[getIndex(user.i, user.j - 1)] && !grid[getIndex(user.i, user.j - 1)].walls[2]){
                user.j--;
            }
        }

        if(keyCode === RIGHT_ARROW){
            if(grid[getIndex(user.i + 1, user.j)] && !grid[getIndex(user.i + 1, user.j)].walls[3]){
                user.i++;
            }
        }

        if(keyCode === DOWN_ARROW){
            if(grid[getIndex(user.i, user.j + 1)] && !grid[getIndex(user.i, user.j + 1)].walls[0]){
                user.j++;
            }
        }

        if(keyCode === LEFT_ARROW){
            if(grid[getIndex(user.i - 1, user.j)] && !grid[getIndex(user.i - 1, user.j)].walls[1]){
                user.i--;
            }
        }
    }
}

function getIndex(i, j){
    // Same function as on the server
    if(i < 0 || j < 0 || i > nrOfRows - 1 || j > nrOfRows - 1)
        return -1;
    
    return j + i * nrOfRows;
}