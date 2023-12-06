class Crucigrama{
    facil = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
    medio = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
    dificil = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72"


    constructor(){
        this.nivel = 'facil';
        this.board = this.facil.split(",");
        if(this.nivel === 'medio'){
            this.board = this.medio.split(",");
        }else if(this.nivel === 'dificil'){
            this.board = this.dificil.split(",");
        }
        this.columns = 9;
        this.rows = 11;
        this.init_time = 0;
        this.end_time = 0;
        this.tablero = [];
        this.seconds = 0;
        this.start();
    }

    cambiarModo(modo){
        this.nivel = modo;
        this.board = this.facil.split(",");
        if(this.nivel === 'medio'){
            this.board = this.medio.split(",");
        }else if(this.nivel === 'dificil'){
            this.board = this.dificil.split(",");
        }
        $("main").empty();
        this.start();
        this.paintMathword();
    }

    start(){
        for(let i = 0; i < this.rows; i++){
            this.tablero[i] = [];
            for(let j = 0; j < this.columns; j++){
                const index = this.columns * i + j;
                if(this.board[index] === "."){
                    this.tablero[i][j] = 0;
                }else if(this.board[index] === "#"){
                    this.tablero[i][j] = -1;
                }else{
                    this.tablero[i][j] = this.board[index];
                }
                
            }
        }
    }

    paintMathword(){
        const $main = $('main');
        for (let i = 0; i < this.rows; i++) {
            for(let j = 0; j < this.columns; j++){
            const $parrafo = $('<p></p>');
            $parrafo.attr('grid-row-start', i);
            $parrafo.attr('grid-column-start', j);
            if (this.tablero[i][j] === 0) {
                $parrafo.click(function() {
                    $(this).attr('data-state', 'clicked');
                });
            } else if (this.tablero[i][j] === -1) {
                $parrafo.attr('data-state', 'empty');
            } else{
                $parrafo.text(this.tablero[i][j]);
                $parrafo.attr('data-state', 'blocked');
            }

            $main.append($parrafo);
        }
    }
    this.init_time = new Date();
    }

    check_win_condition(){
        for(let i = 0; i < this.columns; i++){
            for(let j = 0; j < this.rows; j++){
                if(this.tablero[i][j] === 0){
                    return false;
                }
                
            }
        }
        return true;
    }

    calculate_date_difference() {
        this.end_time = new Date();
        
        const difference = this.end_time.getTime() - this.init_time.getTime();

        
        this.seconds = (difference / 1000);

        
        const formatted_time = new Date(difference).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return formatted_time;
    }

    introduceElement(selected, elem){
        const row = parseInt(selected.attr('grid-row-start'));
        const column = parseInt(selected.attr('grid-column-start'));
        this.tablero[row][column] = elem;
        const expression_row = this.checkRow(row, column);
        const expresion_col = this.checkColumn(row, column);
        if(expression_row && expresion_col){
            selected.text(elem);
            selected.attr('data-state', 'correct');
        }else{
            this.tablero[row][column] = 0;
        }

        if(this.check_win_condition()){
            alert("¡Enhorabuena! Tiempo: " + this.calculate_date_difference());
            this.createRecordForm();
        }
        
    }

    introduceElementButton(elem){
        const selected = $('main > p[data-state="clicked"]');

        if (selected.length > 0) {
            selected.attr('data-state', ' ');
            this.introduceElement(selected, elem);
        }else{
            //alert("No has seleccionado ninguna celda");
        }
    }

    checkRow(row, col){
        let equalIndex = -1;
        if(col + 1 < this.columns && this.tablero[row][col + 1] !== -1){
            equalIndex = col+1;
            while(this.tablero[row][equalIndex] !== '='){
                equalIndex++;
            }
            
        }else if(col > 0 && this.tablero[row][col - 1] !== -1){
            equalIndex = col - 1;
            while(this.tablero[row][equalIndex] !== '='){
                equalIndex--;
            }
        }
        
        if(equalIndex !== -1){
            let firstNumber = this.tablero[row][equalIndex - 3];
            let expresion = this.tablero[row][equalIndex - 2];
            let secondNumber = this.tablero[row][equalIndex - 1];
            let result = this.tablero[row][equalIndex + 1];
            if(firstNumber !== 0 && expresion !== 0 && secondNumber !== 0 && result !== 0){
                const operation = [firstNumber, expresion, secondNumber].join('');
                const evalResult = eval(operation);
                return evalResult == result;
            }else{
                return true;
            }
            
        }else{
           return true; 
        }
        
        
    }

    checkColumn(row, col){
        let equalIndex = -1;
        if(row + 1 < this.rows && this.tablero[row+1][col] !== -1){
            equalIndex = row+1;
            while(this.tablero[equalIndex][col] !== '='){
                equalIndex++;
            }
            
        }else if(row > 0 && this.tablero[row - 1][col] !== -1){
            equalIndex = row-1;
            while(this.tablero[equalIndex][col] !== '='){
                equalIndex--;
            }
        }
        
        if(equalIndex !== -1){
            let firstNumber = this.tablero[equalIndex - 3][col];
            let expresion = this.tablero[equalIndex - 2][col];
            let secondNumber = this.tablero[equalIndex - 1][col];
            let result = this.tablero[equalIndex + 1][col];
            if(firstNumber !== 0 && expresion !== 0 && secondNumber !== 0 && result !== 0){
                const operation = [firstNumber, expresion, secondNumber].join('');
                const evalResult = eval(operation);
                
                return evalResult == result;
            }else{
                return true;
            }
            
        }else{
           return true; 
        }
        
        
    }

    createRecordForm() {
        const form = $('<form></form>');
        const pNombre = $('<p>Nombre</p>').appendTo(form);
        const iNombre = $('<input></input>').attr("name", "nombre").attr("type", "text").appendTo(form);
        const pApellidos = $('<p>Apellidos</p>').appendTo(form);
        const iApellidos = $('<input></input>').attr("name", "apellidos").attr("type", "text").appendTo(form);
        const submit = $('<input></input>').attr("name", "submit").attr("type", "submit").attr("value","Enviar").appendTo(form);
        const pNivel = $('<p>Nivel</p>').appendTo(form);
        const iNivel  = $('<p></p>').attr("name", "nivel").text(this.nivel).appendTo(form);
        const pTiempo = $('<p>Segundos</p>').appendTo(form);
        const iTiempo  = $('<p></p>').attr("name", "tiempo").text(this.seconds).appendTo(form);

        $('aside').append(form);
    }

    
    
}
