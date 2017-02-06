let Cell = require('./cell');

class Maze{
    constructor(mazeSize, mazeRows){
        this.size = mazeSize;
        this.rows = this.cols = mazeRows;
        this.grid = [];
        this.cellSize = mazeSize / this.rows;
    }
    
    createGrid(){
        for(var i=0; i<this.rows; i++){
            for(var j=0; j<this.cols; j++){
                this.grid.push(new Cell(i, j, this.cellSize));
            }
        }
    }
    
    generateMaze(){
        
        // Setting the final cell on a random position
        let random = Math.floor(Math.random() * grid.length);
        grid[random].final = true;
    }
}

module.exports = Maze;