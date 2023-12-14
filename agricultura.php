<?php
class Agricultura{
    public $server;
    public $user;
    public $pass;
    public $dbname;

    public function __construct(){
        $this->server = "localhost";
        $this->user = "DBUSER2023";
        $this->pass = "DBPSWD2023";
        $this->dbname = "agricultura";
    }

    public function create_data_base(){
        try {
            $conn = new PDO("mysql:host=$this->server", $this->user, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sql_drop_db = "DROP DATABASE IF EXISTS $this->dbname";
            $conn->exec($sql_drop_db);
            $sql = "CREATE DATABASE $this->dbname";
            $conn->exec($sql);
        
            $conn->exec("USE $this->dbname");
        
            $sql_clientes = "CREATE TABLE Clientes (
                dni_cliente INT PRIMARY KEY,
                nombre_cliente VARCHAR(50),
                apellido_cliente VARCHAR(50),
                edad_cliente INT
            )";
            $conn->exec($sql_clientes);
            $sql_agricultores = "CREATE TABLE Agricultores (
                dni_agricultor INT PRIMARY KEY,
                nombre_agricultor VARCHAR(50),
                apellido_agricultor VARCHAR(50),
                edad_agricultor INT,
                n_campos INT
            )";
            $conn->exec($sql_agricultores);
            $sql_verduras = "CREATE TABLE Verduras (
                nombre_verdura VARCHAR(50) PRIMARY KEY,
                tipo VARCHAR(50),
                val_min DOUBLE,
                epoca VARCHAR(50),
                dias INT
            )";
            $conn->exec($sql_verduras);
            $sql_cultiva = "CREATE TABLE Cultiva (
                dni_agricultor INT,
                nombre_verdura VARCHAR(50),
                campo INT,
                fecha_inicio DATE,
                FOREIGN KEY (dni_agricultor) REFERENCES Agricultores(dni_agricultor),
                FOREIGN KEY (nombre_verdura) REFERENCES Verduras(nombre_verdura),
                PRIMARY KEY (dni_agricultor, nombre_verdura, campo, fecha_inicio)
            )";
            $conn->exec($sql_cultiva);
            $sql_compra = "CREATE TABLE Compra (
                dni_cliente INT,
                dni_agricultor INT,
                nombre_verdura VARCHAR(50),
                precio DOUBLE,
                cantidad DOUBLE,
                fecha DATE,
                FOREIGN KEY (dni_cliente) REFERENCES Clientes(dni_cliente),
                FOREIGN KEY (dni_agricultor) REFERENCES Agricultores(dni_agricultor),
                FOREIGN KEY (nombre_verdura) REFERENCES Verduras(nombre_verdura),
                PRIMARY KEY (dni_cliente, dni_agricultor, nombre_verdura, fecha)
            )";
            $conn->exec($sql_compra);
            echo "Base de datos creada correctamente.<br>";
        
        } catch(PDOException $e) {
            echo $e->getMessage();
        }
        
        $conn = null;
    }

    public function fill_initial_data(){
        $file = fopen("php/inicial.csv", "r");
        $this->insert_data($file);
        echo "Datos iniciales insertados.<br>";
    }

    public function insert_data($file){
    if ($file !== false) {
        $modo = '';
        $conn = new mysqli($this->server,$this->user,$this->pass,$this->dbname);
        while (($data = fgetcsv($file, 1000, ";")) !== false) {
            $data = array_filter($data, function($value) {
                return $value !== ''; 
            });
            if (count($data) == 1) {
                $modo = $data[0];
                continue;
            }
            if ($modo === 'Clientes') {
                $sql = "INSERT INTO Clientes (dni_cliente, nombre_cliente, apellido_cliente, edad_cliente) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$data[0], $data[1], $data[2], $data[3]]);
            } elseif ($modo === 'Agricultores') {
                $sql = "INSERT INTO Agricultores (dni_agricultor, nombre_agricultor, apellido_agricultor, edad_agricultor, n_campos) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$data[0], $data[1], $data[2], $data[3], $data[4]]);
            } elseif ($modo === 'Verduras') {
                $sql = "INSERT INTO Verduras (nombre_verdura, tipo, val_min, epoca, dias) VALUES (?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$data[0], $data[1], $data[2], $data[3], $data[4]]);
            } elseif ($modo === 'Cultiva') {
                $sql = "INSERT INTO Cultiva (dni_agricultor, nombre_verdura, campo, fecha_inicio) VALUES (?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$data[0], $data[1], $data[2], $data[3]]);
            } elseif ($modo === 'Compra') {
                $sql = "INSERT INTO Compra (dni_cliente, dni_agricultor, nombre_verdura, precio, cantidad, fecha) VALUES (?, ?, ?, ?, ?, ?)";
                $stmt = $conn->prepare($sql);
                $stmt->execute([$data[0], $data[1], $data[2], $data[3], $data[4], $data[5]]);
            } else {
                echo "Modo desconocido: $modo";
            }
        }
        $conn->close();
        fclose($file);
    } else {
        echo "Error al abrir el archivo CSV.";
    }
    }

    public function export_data(){
        $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        if ($conn->connect_error) {
            die("Conexión fallida: " . $conn->connect_error);
        }

        $tables = array();
        $sql = "SHOW TABLES";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_row()) {
                $tables[] = $row[0];
            }
        }

        $filename = "export_all_tables.csv";
        $file = fopen("php/$filename", 'w');

        foreach ($tables as $table) {
            $sql = "SELECT * FROM $table";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $header = array();
                while ($fieldinfo = $result->fetch_field()) {
                    $header[] = $fieldinfo->name;
                }
                fputcsv($file, [$table]); 
                fputcsv($file, $header);

                while ($row = $result->fetch_assoc()) {
                    fputcsv($file, $row);
                }
                fputcsv($file, []);
            }
        }

        fclose($file);
        echo "Datos de todas las tablas exportados a $filename exitosamente.";

        $conn->close();
    }
    
}

    
?>


<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>EscritorioVirtual - Juegos</title>
    <meta name ="author" content ="Sara Fernández González" />
    <meta name ="description" content ="esta es una pagina de dibujos con sonido" />
    <meta name ="keywords" content ="juego, dibujo, musica" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/api.css" />
    <link rel="icon" type="image/vnd.microsoft.icon" href="multimedia/imagenes/favicon.ico">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
     integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
     crossorigin="anonymous"></script>
    <script src="js/api.js"></script>
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
    <h2>Gestor Agricultura</h2>
    
    <main>
        <?php
            $agricultura = new Agricultura();
            if (isset($_POST['createdb'])) {
                $agricultura->create_data_base();
                $agricultura->fill_initial_data();
            }
            if (isset($_POST['sendfile'])) {
                if(isset($_FILES['insertcsv'])){
                    echo "Encuentra los files<br>";
                    $file_name = $_FILES['insertcsv']['name'];
                    $file_tmp = $_FILES['insertcsv']['tmp_name'];
                    $file_type = $_FILES['insertcsv']['type'];
                    if ($file_type == 'text/csv') {
                        echo "es csv<br>";
                        move_uploaded_file($file_tmp, "php/$file_name");
                        $file = fopen("php/$file_name", "r");
                        $agricultura->insert_data($file);
                        echo "Archivo cargado exitosamente.";
                    } else {
                        echo "Por favor, carga un archivo CSV.";
                    }
                }
            }
            if (isset($_POST['exportdb'])) {
                $agricultura->export_data();
            }
        ?>
        <form action = "agricultura.php" method = "POST" enctype="multipart/form-data">
            <input type = "submit" name = "createdb" value = "Crear Base de Datos"/>
            <input type = "file" name = "insertcsv"/>
            <input type = "submit" name = "sendfile" value = "Subir Archivo"/>
            <input type = "submit" name = "exportdb" value = "Exportar Base de Datos"/>
        </form>
    </main>

</body>
</html>