class Cell{
    constructor(i, j, size){
        this.i = i;
        this.j = j;
        this.size = size;
        this.x = i * size;
        this.y = j * size;
        this.walls = [true, true, true, true];
        this.visited = false;
        this.hasPlayer = false;
        this.final = false;
    }
}

module.exports = Cell;