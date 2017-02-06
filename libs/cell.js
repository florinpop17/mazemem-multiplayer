class Cell{
    constructor(i, j, size){
        this.i = i;
        this.j = j;
        this.size = size;
        this.x = i * size;
        this.y = j * size;
        this.walls = [true, true, true, true];
    }
}