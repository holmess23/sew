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
        $('aside').html(`<pre>${adapted}</pre>`);
        
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