class Agenda{
    constructor(){
        this.url = "http://ergast.com/api/f1/current";
        this.last_api_call = null;
        this.last_api_result = null;
    }

    getSchedule(){
        const now = new Date();
        const minutesPassed = (now - this.last_api_call) / (1000 * 60);

        if (!this.last_api_call || minutesPassed >= 5) {
            const response = $.ajax({
                url: this.url,
                method: 'GET',
                dataType: 'xml'
            });

            this.last_api_call = new Date();

            response.done((data) => {
                this.last_api_result = data;
                this.printData();
                //console.log('Datos obtenidos:', this.last_api_result); 
            });
        } else {
            console.log('No ha pasado el tiempo suficiente desde la última llamada, utilizando el resultado anterior.');
        }
    }

    printData(){
        $(this.last_api_result).find('Race').each(function() {
            const raceName = $(this).find('RaceName').text();
            const circuit = $(this).find('Circuit')
            const circuitName = circuit.find('CircuitName').text();
            const coordinates = circuit.find('Location').attr("lat") + ' ' + circuit.find('Location').attr("long");
            const raceDateTime = $(this).children('Date').text() + ' ' + $(this).children('Time').text();

            const $article = $('<article></article>');
            const $h3 = $('<h3></h3>').text('Nombre de la Carrera: ' + raceName).appendTo($article);
            const $list = $('<ul></ul>');
            const $cName = $('<li></li>').text('Nombre del Circuito: ' + circuitName).appendTo($list);
            const $cCoord = $('<li></li>').text('Coordenadas del Circuito: ' + coordinates).appendTo($list);
            const $cDateTime = $('<li></li>').text('Fecha y hora de la Carrera: ' + raceDateTime).appendTo($list);
            $list.appendTo($article);
            $article.appendTo('main > section');
          });
    }
}