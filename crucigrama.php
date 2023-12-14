<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>EscritorioVirtual - Juegos</title>
    <meta name ="author" content ="Sara Fernández González" />
    <meta name ="description" content ="este es el juego del crucigrama matemático" />
    <meta name ="keywords" content ="juego, crucigrama, numeros" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="stylesheet" type="text/css" href="estilo/botonera.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="multimedia/imagenes/favicon.ico">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
     integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
     crossorigin="anonymous"></script>
    <script src="js/crucigrama.js"></script>
</head>

<body>
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
    <h2>Crucigrama</h2>
    <nav>
        <p>Juegos: </p>
        <a href="memoria.html" accesskey="i" tabindex="8">Memoria</a>
        <a href="sudoku.html" accesskey="k" tabindex="9">Sudoku</a>
        <a href="crucigrama.php" accesskey="c">Crucigrama</a>
    </nav>
    <script>
        const crucigrama = new Crucigrama();
    </script>
    
    <section>
        <h3>¿Como jugar?</h3>
        <ul>
            <li>Haz click en las casillas vacía y utiliza el teclado o la botonera para introducir números o signos</li>
            <li>Para seleccionar una casilla cuando tienes otra casilla seleccionada, asegúrate de haber clickado en la anterior para deseleccionar</li>
            <li>No se pueden escribir números de 2 cifras, seguro que encuentras otra solución</li>
            <li>Para borrar un dato que has puesto, selecciona la casilla y dale a retroceso o al botón &lt;- de la botonera</li>
            <li>Ten cuidado y no clickes demasiadas veces sobre la misma casilla, un click basta</li>
            <li data-type="ordenador">Si pulsas ENTER en el ordenador podrás pasar a la siguiente casilla vacía sin hacer click</li>
            <li>Para empezar a jugar selecciona el nivel</li>
            <li>Signos: + Suma, - resta, * multiplicación, \ división</li>
        </ul>
    </section>
    <section>
        <h3>Niveles de juego:</h3>
        <button onclick="crucigrama.cambiarModo('facil')">Fácil</button>
        <button onclick="crucigrama.cambiarModo('medio')">Medio</button>
        <button onclick="crucigrama.cambiarModo('dificil')">Difícil</button>
    </section>
    <main></main>
    <section data-type="botonera">
    <h2>Botonera</h2>
    <button onclick="crucigrama.introduceElementButton(1)">1</button>
    <button onclick="crucigrama.introduceElementButton(2)">2</button>
    <button onclick="crucigrama.introduceElementButton(3)">3</button>
    <button onclick="crucigrama.introduceElementButton(4)">4</button>
    <button onclick="crucigrama.introduceElementButton(5)">5</button>
    <button onclick="crucigrama.introduceElementButton(6)">6</button>
    <button onclick="crucigrama.introduceElementButton(7)">7</button>
    <button onclick="crucigrama.introduceElementButton(8)">8</button>
    <button onclick="crucigrama.introduceElementButton(9)">9</button>
    <button onclick="crucigrama.introduceElementButton('*')">*</button>
    <button onclick="crucigrama.introduceElementButton('+')">+</button>
    <button onclick="crucigrama.introduceElementButton('-')">-</button>
    <button onclick="crucigrama.introduceElementButton('/')">/</button>
    <button onclick="crucigrama.cleanElement()"> &lt;- </button>
    </section>
    <aside>
    </aside>
    <script>
    $(document).ready(function() {
        //crucigrama.paintMathword();
    });
    $(document).keydown(function(event) {
        const selected = $('main > p[data-state="clicked"]');

        if (selected.length > 0 && ((event.key >= '1' && event.key <= '9') || event.key == '+' || event.key == '-' || event.key == '*' || event.key == '/')) {
            selected.attr('data-state', ' ');
            crucigrama.introduceElement(selected, event.key);
        }else if(selected.length > 0 && (event.key == 'Backspace' || event.key == 'Delete')){
            crucigrama.cleanElement();
        }else if (event.key === 'Enter') {
            crucigrama.findNextSelected();
        }
    });
    $(document).on('submit', 'form[data-type="formRecord"]', function(e) {
        e.preventDefault();
        const formData = $(this).serialize();
        crucigrama.insertRecord(formData);
    });
    </script>
    <?php 
    class Record{
        public $server;
        public $user;
        public $pass;
        public $dbname;

        public function __construct(){
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "records";
        }

        public function insert_record($nombre,$apellido,$nivel,$tiempo){
            $conn = new mysqli($this->server,$this->user,$this->pass,$this->dbname);
            if($conn->connect_error){
                die("Conn error");
            }else{
                $sql = "INSERT INTO registro (nombre,apellidos,nivel,tiempo) VALUES ('$nombre','$apellido','$nivel','$tiempo')";

                if($conn->query($sql)){
                    echo "Se ha añadido el registro<br>";
                    $this->show_records($nivel);
                }else{
                    echo "Error";
                }
            }

            $conn->close();
        }

        public function show_records($nivel){
            $conn = new mysqli($this->server,$this->user,$this->pass,$this->dbname);
            if($conn->connect_error){
                die("Conn error");
            }else{
                $sql = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = '".$nivel."' ORDER BY tiempo ASC LIMIT 10 ";

                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    echo "<p>Nombre   Apellidos   Segundos</p>";
                    echo "<ol>";
                    while($row = $result->fetch_assoc()){
                        $tiempo = $row["tiempo"];
                        $horas = floor($tiempo / 3600);
                        $minutos = floor(($tiempo% 3600) / 60);
                        echo "<li>".$row["nombre"]." " .$row["apellidos"]." ".$row["tiempo"]."</li>";
                    }
                    echo "</ol>";

                } else {
                    echo "No hay records";
                }
            }

            $conn->close();
        }

        
    }  
    
    
    if (isset($_POST['nombre'], $_POST['apellido'], $_POST['nivel'], $_POST['tiempo'])) {
        $name = $_POST['nombre'];
        $apellido = $_POST['apellido'];
        $nivel = $_POST['nivel'];
        $tiempo = $_POST['tiempo'];
        $record = new Record();
        $record->insert_record($name,$apellido,$nivel,$tiempo);
    }
    
    ?>
</body>
</html>