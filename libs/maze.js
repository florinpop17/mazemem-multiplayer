let Cell = require('./cell');

let next, current;

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
        // Following the Maze generator algorithm from Wikipedia
        // Recursive backtracker
        
        // STEP 1
        current = this.grid[0];
        current.visited = true;
        
        // STEP 2
        while(this.areUnvisited) {
            // STEP 2 -> 1
            next = this.getRandomNeighbor(current.i, current.j);
        }
        
        // Setting the final cell on a random position
        let random = Math.floor(Math.random() * this.grid.length);
        this.grid[random].final = true;
    }
    
    areUnvisited(){
        grid.forEach(cell => {
            if(!cell.visited)
                return true;
        });
        return false;
    }
    
    getRandomNeighbor(i, j){
        let neighbors = [];
        
        let top = this.grid[this.getIndex(i, j-1)];
        let right = this.grid[this.getIndex(i+1, j)];
    }
    
    getIndex(i, j){
        // Edge cases
        if(i < 0 || j < 0 || i > this.rows - 1 || j > this.cols - 1) return -1;
        
        return j + i * this.rows;
    }
}

module.exports = Maze;