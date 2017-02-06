const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

let Maze = require('./libs/maze');

let connections = [];
let users = [];

let canvasSize = 700; // Same as on client
let nrOfRows = 15; // Same as on client

// Creating the maze
let maze = new Maze(canvasSize, nrOfRows);
maze.createGrid();
maze.generateMaze();


// Set interval + Tick function
setInterval(tick, 33);

function tick() {
    io.sockets.emit('tick', users);
}



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('index.html');
});

server.listen(PORT, () => {
    console.log("Server listening on port", PORT);
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected.', connections.length);
    
    // Starting the game + getting the user initial data into the users array
    socket.on('start', (user) => {
        let newUser = user;
        newUser.id = socket.id;        
        users.push(newUser);
    });
    
    // Sending the grid to the user
    socket.emit('theGrid', maze.grid);
    
    //Disconnect
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        users = users.filter(user => user.id !== socket.id);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
});