// Default variables
var socket = io.connect();
var user = {
    i: 0,
    j: 0,
    name: 'NoName',
    finished: false,
    startTime: 0,
    endTime: 0,
    timeToComplete: 0
};

var grid;
var users;
var canvasSize = 650; // Same as on server
var nrOfRows = 10; // Same as on server
var cellWidth = cellHeight = canvasSize / nrOfRows;

var offset = 4; // Small offset for the user ellipses

var thisUserColor = '#e67e22';
var othersColor = '#c0392b';

var gameIsRunning = false;

var startBtn = document.getElementById('startBtn');

startBtn.addEventListener('click', function(){
    document.getElementById('popup').style.display = 'none';
    
    var newName = document.getElementById('name').value;
        
    user.name = newName;
    
    socket.emit('start', user);
    
    gameIsRunning = true;
    loop();
});

function setup() {
    createCanvas(canvasSize, canvasSize);
    
    // Getting the grid && setting the user.id
    socket.on('theGrid', function(_grid){
        grid = _grid; 
        user.id = socket.id;
    });
    
    socket.on('tick', function(_users){
        users = _users;
        users.forEach(aUser => {
            if(aUser.id === user.id){
                user.finished = aUser.finished;
                user.startTime = aUser.startTime;
                user.endTime = aUser.endTime;
                user.timeToComplete = aUser.timeToComplete;
            }
        })
    });
    
    noLoop();
}

function draw() {
    background('#3498db');
    
    //if isn't undefined and isn't false
    if(gameIsRunning){
        if(grid){
            drawGrid();
        }

        if(users){
            drawUsers();

            // Draw the total time to complete for each user
            drawUserFinishedTimes();
        }

        // Drawing this user
        drawAUser(user, thisUserColor);

        socket.emit('userNewLocation', user);
    }
}

function drawUserFinishedTimes() {
    var usersThatFinished = [];
    users.forEach(user => {
        if(user.finished){
            usersThatFinished.push(user);
        } 
    });
    
    fill(255);
    textSize(16);
    textAlign(RIGHT, CENTER);
    noStroke();
    text('Leaderboard', width - 30, 15);
    
    usersThatFinished.sort(function(a, b){
        return a.timeToComplete - b.timeToComplete;
    }).forEach((user,idx) => {
        text(`${user.name} - ${user.timeToComplete.toFixed(2)}`, width - 30, 16 * idx + 35);
    });
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
            drawAUser(user, othersColor);
        }
    });
}

function drawAUser(_user, color){
    noStroke();
    fill(color);
    ellipse(_user.i * cellWidth + cellWidth/2, _user.j * cellHeight + cellHeight/2, cellWidth - 2*offset, cellHeight - 2*offset);
    
    // Draw user name
    textSize(14);
    textAlign(CENTER, CENTER);
    fill(255);
    text(_user.name, _user.i * cellWidth + cellWidth/2, _user.j * cellHeight + cellHeight/2);
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