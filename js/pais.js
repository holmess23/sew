class Pais{
    constructor(nombre,capital,poblacion,gobierno,coordenadas,religion){
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.gobierno = gobierno;
        this.coordenadas = coordenadas;
        this.religion = religion;
    }

    /*constructor(nombre, capital, poblacion){
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.complete();
    }*/

    complete(){
        this.gobierno = "no-gobierno";
        this.coordenadas = "no-coordenadas";
        this.religion = "no-religion";
    }

    getNombre(){
        return this.nombre;
    }
    getCapital(){
        return this.capital;
    }
    getPoblacion(){
        return this.poblacion;
    }
    getGobierno(){
        return this.gobierno;
    }
    getCoordenadas(){
        return this.coordenadas;
    }
    getReligion(){
        return this.religion;
    }

    getSecondaryInfo(){
        document.write("<ul>"
        + "<li><p>Poblacion: " + this.poblacion + "</p></li>"
        + "<li><p>Gobierno: " + this.gobierno + "</p></li>"
        + "<li><p>Religion: " + this.religion + "</p></li>"
                    + "</ul>");
    }

    printCoordenadas(){
        document.write("<p>Coordenadas: " + this.coordenadas + "</p>");
    }

    getMeteo(){
        const apiKey = 'a4dab11e24706b494e13819ef705cc01';
        const coord = this.coordenadas.split(",");
        const lat = coord[0];
        const lon = coord[1];
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

        const response = $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: (response) => {
                const predictions = response.list;
                this.printData.bind(this,predictions)();
                
                console.log('Respuesta del servicio meteorológico:', predictions);
            }
        });

    }

    printData(predictions){
        let count = 0;
        predictions.forEach(prediction =>{
            if(count === 0){
                const date = prediction.dt_txt.split(" ")[0];
                const maxTemp = prediction.main.temp_max;
                const minTemp = prediction.main.temp_min;
                const humidity = prediction.main.humidity;
                const rain = prediction.rain["3h"];
                const icon = prediction.weather[0].icon;
                const iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
                const $section = $('<section></section>');
                const $h3 = $('<h3></h3>');
                $h3.text(date).appendTo($section);
                const $icon = $('<img/>').attr('src',iconurl).appendTo($section);
                const $max = $('<p></p>').text("Temperatura máxima: " + maxTemp).appendTo($section);
                const $min = $('<p></p>').text("Temperatura mínima: " + minTemp).appendTo($section);
                const $hum = $('<p></p>').text("Humedad: " + humidity).appendTo($section);
                const $rainP = $('<p></p>').text("Porcentaje de lluvia: " + rain).appendTo($section);
                $section.appendTo('main');
                console.log(date);
            }
            count++;
            if(count > 7){
                count = 0;
            }
            
        });
    }
}

