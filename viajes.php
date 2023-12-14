<?php 
class Carrusel{
    public $pais;
    public $capital;
    public $fotos;
    public $titulos;

    public function __construct($pais, $capital){
        $this->pais = $pais;
        $this->capital = $capital;
        $this->fotos = array();
    }
    
    public function getImgs(){
        $api_key = '0565634739c78dcdbf56368cb0991f0b';
        $tag = $this->capital;
        $perPage = 10;
        $url = 'http://api.flickr.com/services/feeds/photos_public.gne?';
        $url.= '&api_key='.$api_key;
        $url.= '&tags='.$tag;
        $url.= '&per_page='.$perPage;
        $url.= '&format=json';
        $url.= '&nojsoncallback=1';

        $respuesta = file_get_contents($url);
        $json = json_decode($respuesta);

        for($i=0;$i<$perPage;$i++) {

            $titulo = $json->items[$i]->title;
            $URLfoto = $json->items[$i]->media->m;       
            $this->fotos[] = $URLfoto;
            $this->titulos[] = $titulo;
        }
    }
}

class Moneda{
    public $local;
    public $cambio;

    public function __construct($local, $cambio){
        $this->local = $local;
        $this->cambio = $cambio;
    }

    function obtenerCambio() {
        $api_key = "ce9321d0b55940fd89de0ef7904a879b";
        $url = "https://open.er-api.com/v6/latest/".$this->cambio."?app_id=" . $api_key;
    
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($ch);
        curl_close($ch);
    
        $data = json_decode($response, true);
    
        if(isset($data['rates'])) {
            $cotizacion = $data['rates'][$this->local];
            echo "<p>1€ son: ".$cotizacion." Rupias Indonesias (IDR)</p>";
        } else {
            echo "No se pudo obtener el tipo de cambio.";
        }
    }
}
?>

<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>EscritorioVirtual - Viajes</title>
    <meta name ="author" content ="Sara Fernández González" />
    <meta name ="description" content ="aquí cada documento debe tener la
                                descripción del contenido concreto del mismo" />
    <meta name ="keywords" content ="aquí cada documento debe tener la lista
                                de las palabras clave del mismo separadas por comas" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="multimedia/imagenes/favicon.ico">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
     integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
     crossorigin="anonymous"></script>
     <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAAQI2UyKNZGSMUD9fnAsg_UdFfS-_l-V4" ></script>
    <script src="js/viajes.js"></script>
</head>

<body>
    <script>
        const viajes = new Viajes();
    </script>
    <header>
    <h1>EscritorioVirtual</h1>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <nav>
        <a href="index.html" accesskey="p" tabindex="1">Principal</a>
        <a href="agenda.html" accesskey="a" tabindex="2">Agenda</a>
        <a href="juegos.html" accesskey="j" tabindex="3">Juegos</a>
        <a href="meteorologia.html" accesskey="m" tabindex="4">Meteorologia</a>
        <a href="noticias.html" accesskey="n" tabindex="5">Noticias</a>
        <a href="sobremi.html" accesskey="s" tabindex="5">Sobre mi</a>
        <a href="viajes.php" accesskey="v" tabindex="7">Viajes</a>
    </nav>
    </header>
    <h2>Viajes</h2>
    <main>
        
    </main>
    
    <aside>
        <p>Introduce el XML</p>
        <input id = "xmlInput" type = "file" onchange="viajes.readXMLFile(document.getElementById('xmlInput'))"/>
        <p>Introduce los KML</p>
        <input id = "kmlInput" type = "file" onchange = "viajes.readKMLFile(document.getElementById('kmlInput'))" multiple/>
        <article>
            <?php
                $carrusel = new Carrusel("indonesia","yakarta");
                $carrusel->getImgs();
            ?>
            <script>
            const fotos = <?php echo json_encode($carrusel->fotos); ?>;
            const titulos = <?php echo json_encode($carrusel->titulos); ?>;
            const carousel = $("aside > article");
            fotos.forEach((foto, index) => {
                const img = $("<img>");
                img.attr("src", foto);
                img.attr("alt", titulos[index]);
                img.css("min-width", "100%");
                carousel.append(img);
            });
        </script>
            <h3>
            Carrusel de Imágenes
            </h3>
            <button data-action="next"> &gt; </button>
            <button data-action="prev"> &lt; </button>
            <script>
                const slides = document.querySelectorAll("img");
                const nextSlide = document.querySelector("button[data-action='next']");
                const prevSlide = document.querySelector("button[data-action='prev']");
                let curSlide = 3;
                let maxSlide = slides.length - 1;

                nextSlide.addEventListener("click", function () {
                    if (curSlide === maxSlide) {
                        curSlide = 0;
                    } else {
                        curSlide++;
                    }
                    slides.forEach((slide, indx) => {
                        var trans = 100 * (indx - curSlide);
                        $(slide).css('transform', 'translateX(' + trans + '%)')
                    });
                });

                prevSlide.addEventListener("click", function () {
                    if (curSlide === 0) {
                        curSlide = maxSlide;
                    } else {
                        curSlide--;
                    }

                    slides.forEach((slide, indx) => {
                        var trans = 100 * (indx - curSlide);
                        $(slide).css('transform', 'translateX(' + trans + '%)')
                    });
                });
            </script>
        </article>
        <section>
            <h3>Cambio de monedas IDR/EUR</h3>
            <?php
                $moneda = new Moneda("IDR","EUR");
                $moneda->obtenerCambio();
            ?>
        </section>
    </aside>
    <footer></footer>
    
    

</body>
</html>