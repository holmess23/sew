class Viajes{
    constructor() {
        if ("geolocation" in navigator) {
            const self = this;

            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                function(position) {
                  self.onSuccess(position);
                },
                function(error) {
                  self.onError(error);
                }
              );
            } else {
              console.log("Geolocalización no soportada en este navegador.");
            }
      }
      this.fileAPIsupported = window.File && window.FileReader && window.FileList && window.Blob;
      this.coordinates = [];
      this.imagenActual = 0;
    }
    
    onSuccess(position) {
    // Almacenar la posición geográfica en atributos de la clase
    this.latitud = position.coords.latitude;
    this.longitud = position.coords.longitude;

    console.log("Posición obtenida:", this.latitud, this.longitud);
    this.initMap(this.latitud, this.longitud);
    this.initDynamicMap(this.latitud, this.longitud);
    }

    onError(error) {
    console.error("Error al obtener la posición:", error.message);
    }

    initMap(latitud, longitud){
        const apiKey = "AIzaSyAAQI2UyKNZGSMUD9fnAsg_UdFfS-_l-V4";
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitud},${longitud}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7Clabel:Usuario%7C${latitud},${longitud}&key=${apiKey}`;
        $('footer').append(`<img src="${mapUrl}" alt="Mapa estático">`);
    }

    initDynamicMap(latitud, longitud){
    const $main = $('main').attr('id', 'mapa');;
    
    const userLocation = {
        lat: latitud,
        lng: longitud
      }; 
      
    const mapOptions = {
        center: userLocation,
        zoom: 10
    };
    const map = new google.maps.Map($main[0], mapOptions);
    console.log($main[0]);
    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: 'Ubicación del usuario'
    });
    
    }

    readXMLFile(fileInput) {
      if (!this.fileAPIsupported) {
        console.log('Tu navegador no soporta la API File.');
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = function(event) {
        const contents = event.target.result;
        const adapted = adapt(contents);
        //$('aside').html(`<pre>${adapted}</pre>`);
        $(contents).find('ruta').each(function() {
          const nombre = $(this).attr('nombre');
          const tipo = $(this).attr('tipo');
          const fecha = $(this).find('inicio').attr('fecha');
          const hora = $(this).find('inicio').attr('hora');
          const inicio = $(this).find('inicio').find('lugar').text();
          const agencia = $(this).find('agencia').text();
          const descripcion = $(this).find('descripcion').text();
          
          const section = $('<section></section>');
          const article = $('<article></article>');
          const $nombre = $('<h3></h3>').text('Nombre de la Ruta: ' + nombre).appendTo(article);
          const $tipo = $('<p></p>').text('Tipo de la Ruta: ' + tipo).appendTo(article);
          if(fecha != undefined){
            const $fecha = $('<p></p>').text('Fecha de inicio: ' + fecha + " Hora: " + hora).appendTo(article);
          }
          const $inicio = $('<p></p>').text('Lugar de inicio: ' + inicio).appendTo(article);
          const $agencia = $('<p></p>').text('Agencia: ' + agencia).appendTo(article);
          const $descripcion = $('<p></p>').text('Descripción: ' + descripcion).appendTo(article);
          const personas = $(this).find('personas_adecuadas');
          const $tPersona = $('<p></p>').text('Personas: ').appendTo(article);
          const $list = $('<ul></ul>');
          $(personas).find('persona').each(function(){
            const $persona = $('<li></li>').text($(this).text()).appendTo($list);
          });
          $list.appendTo(article);
          article.appendTo(section);
          const $hitos = $('<article></article>');
          const hitos = $(this).find('hitos');
          $(hitos).find('hito').each(function(){
            const nombreHito = $(this).attr('nombre');
            const dist = $(this).find('distancia').text();
            const rutaFoto = $(this).find('fotos').find('foto').attr('ref');
            const $hito = $('<article></article>');
            const $nombreHito = $('<h3></h3>').text("Hito: " + nombreHito).appendTo($hito);
            const $distancia = $('<p></p>').text("Distancia del inicio: " + dist).appendTo($hito);
            //const $icon = $('<img/>').attr('src',rutaFoto).appendTo($hito);
            $hito.appendTo($hitos);
          });
          $hitos.appendTo(section);
          section.appendTo('aside');
        });
      };

      function adapt(text) {
        const map = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
      };

      reader.readAsText(file);
    }

    readKMLFile(fileInput) {
      const self = this;
      if (!this.fileAPIsupported) {
        console.log('Tu navegador no soporta la API File.');
        return;
      }
      const files = fileInput.files;
      for(let i = 0; i < files.length; i++){
        const file = files[i];
        const section = $('<section>').attr('id','kmlMap' + i).appendTo('body > aside');
        if(file.name.toLowerCase().endsWith('.kml')){
          const reader = new FileReader();
          reader.onload = function(event) {
            const contents = event.target.result;
            const parser = new DOMParser();
            const kml = parser.parseFromString(contents, "text/xml");
            const placemarks = kml.getElementsByTagName("Placemark");
            for (let j = 0; j < placemarks.length; j++) {
              const placemark = placemarks[j];
              self.coordinates = placemark.getElementsByTagName("coordinates")[0].textContent.split("\n").slice(1,4);
              
            }
          };
          reader.readAsText(file);

          const coordenadas = [];
              
              for(let j = 0; j < self.coordinates.length; j++){
                const coord = self.coordinates[j].split(",");
                const coords = { lat: Number(coord[0]), lng: Number(coord[1])};
                coordenadas.push(coords);
              }
          const mapElement = document.getElementById('kmlMap' + i);
          console.log(mapElement);
          const map = new google.maps.Map(document.getElementById('kmlMap' + i), {
            center: coordenadas[0],
            zoom: 4
          });
          for (let k = 0; k < coordenadas.length; k++) {
            new google.maps.Marker({
              position: coordenadas[k],
              map: map
            });
          }
          const ruta = new google.maps.Polyline({
            path: coordenadas,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
          });
          ruta.setMap(map);
        }else{
          console.log("No es KML");
        }
        
      }
    }
}