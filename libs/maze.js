let Cell = require('./cell');

let next, current;
let stack = [];

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
        while(this.areUnvisitedCells()) {
            
            // STEP 2 -> 1
            // STEP 2 -> 1 -> 1
            next = this.getRandomNeighbor(current.i, current.j);
            if(next){
                
                // STEP 2 -> 1 -> 2
                stack.push(current);
                
                // STEP 2 -> 1 -> 3
                removeWalls(current, next);
                
                // STEP 2 -> 1 -> 4
                current = next;
                current.visited = true;
            
            // STEP 2 -> 2
            } else if(stack.length > 0) {
                
                // STEP 2 -> 2 -> 1 & 2
                current = stack.pop();
            }
        }
        
        // Setting the final cell on a random position
        let random = Math.floor(Math.random() * this.grid.length);
        this.grid[random].final = true;
    }
    
    areUnvisitedCells(){
        var unvisitedCells = this.grid.filter(cell => !cell.visited);
        
        if(unvisitedCells){
            return true;
        } else {
            return false;
        }
    }
    
    getRandomNeighbor(i, j){
        let neighbors = [];
        
        let top = this.grid[this.getIndex(i, j-1)];
        let right = this.grid[this.getIndex(i+1, j)];
        let bottom = this.grid[this.getIndex(i, j+1)];
        let left = this.grid[this.getIndex(i-1, j)];
        
        if(top && !top.visited)
            neighbors.push(top);

        if(right && !right.visited)
            neighbors.push(right);

        if(bottom && !bottom.visited)
            neighbors.push(bottom);

        if(left && !left.visited)
            neighbors.push(left);

        // If there are neighbors return a random one
        if(neighbors.length > 0){
            let r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        }

        // Else return undefined
        return undefined;
        }
    
    getIndex(i, j){
        // Edge cases
        if(i < 0 || j < 0 || i > this.rows - 1 || j > this.cols - 1) return -1;
        
        return j + i * this.rows;
    }
    
    removeWalls(a, b){
        let x = a.i - b.i;
        let y = a.j - b.j;
        
        if(x === 1){
            a.walls[3] = false;
            b.walls[1] = false;   
        } else if(x === -1) {
            a.walls[1] = false;
            b.walls[3] = false;
        }
        
        if(y === 1){
            a.walls[0] = false;
            b.walls[2] = false;   
        } else if(y === -1) {
            a.walls[2] = false;
            b.walls[0] = false;
        }
    }
}

module.exports = Maze;