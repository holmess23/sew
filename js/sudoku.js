class Sudoku{
    constructor(){
        this.boardString = "";
        this.rows = 9;
        this.columns = 9;
        this.board = [];
        this.initializeBoard();
    }

    initializeBoard(){
        this.boardString = "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
        for(let i = 0; i < this.rows; i++){
            this.board[i] = [];
            for(let j = 0; j < this.columns; j++){
                if(this.boardString[9*i + j] === "."){
                    this.board[i][j] = 0;
                }else{
                    this.board[i][j] = this.boardString[9*i + j];
                }
                
            }
        }
    }

    createStructure() {
        const mainElement = document.querySelector('main');
    
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++) {
            const paragraph = document.createElement('p');
            paragraph.setAttribute('data-x', i);
            paragraph.setAttribute('data-y', j);
    
            if (this.board[i][j] === 0) {
              paragraph.addEventListener('click', () => {
                paragraph.setAttribute('data-state', 'clicked');
              });
            } else {
              paragraph.textContent = this.board[i][j];
              paragraph.setAttribute('data-state', 'blocked');
            }
    
            mainElement.appendChild(paragraph);
          }
        }
      }

    paintSudoku(){
        this.createStructure();
    }

    introduceNumber(selected, number){
        const row = selected.getAttribute('data-x');
        const column = selected.getAttribute('data-y');
        if(this.checkRow(number, row) && this.checkColumn(number, column) && this.checkBox(number,row,column)){
            selected.classList.remove('error');
            selected.textContent = number;
            this.board[row][column] = number;
            selected.setAttribute('data-state', 'correct');
            selected.removeEventListener('click', () => {
                selected.setAttribute('data-state', 'clicked');
              });
        }else{
            selected.classList.add('error');
        }
        this.checkFinished();
    }

    checkRow(number, row){
        for(let i = 0; i < this.columns; i++){
            if(this.board[row][i] === number){
                return false;
            }
        }
        return true;
    }

    checkColumn(number, column){
        for(let i = 0; i < this.columns; i++){
            if(this.board[i][column] === number){
                return false;
            }
        }
        return true;
    }

    checkBox(number, row, column){
        const sectorX = Math.floor(row / 3);
        const sectorY = Math.floor(column / 3);
        for(let i = sectorX*3; i < sectorX*3+3; i++){
            for(let j = sectorY*3; j < sectorY*3+3; j++){
                if(this.board[i][j] === number){
                    return false;
                }
            }
        }
        return true;
    }

    checkFinished(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if(this.board[i][j] == 0) return;
            }
        }

        const mainElement = document.querySelector('main');
        mainElement.classList.add('finished');
    }
}