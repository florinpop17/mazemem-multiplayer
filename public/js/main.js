var socket;

function setup() {
    createCanvas(700, 700);
    
    socket = io.connect();
}

function draw() {
    background(51);
}