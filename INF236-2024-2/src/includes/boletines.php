<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boletines Subidos</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            background-color: white;
            margin: 10px auto;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            text-align: left;
        }
        input[type="text"] {
            width: 50%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
    <script>
        function filtrarBoletines() {
            const filtro = normalizarTexto(document.getElementById("barraBusqueda").value);
            const boletines = document.querySelectorAll(".boletin");

            boletines.forEach(boletin => {
                const tema = normalizarTexto(boletin.querySelector(".tema").textContent);
                if (tema.includes(filtro)) {
                    boletin.style.display = "block"; // Mostrar el boletín si coincide
                } else {
                    boletin.style.display = "none"; // Ocultar el boletín si no coincide
                }
            });
        }

        function normalizarTexto(texto) {
            return texto
                .toLowerCase() // Convertir a minúsculas
                .normalize("NFD") // Normalizar a su forma descompuesta
                .replace(/[\u0300-\u036f]/g, ""); // Eliminar diacríticos (tildes)
        }
    </script>
</head>
<body>
    <h1>Boletines Subidos</h1>

    <!-- Barra de búsqueda -->
    <input 
        type="text" 
        id="barraBusqueda" 
        placeholder="Buscar por tema..." 
        onkeyup="filtrarBoletines()">

    <ul id="listaBoletines">
        <?php
        // Incluir el archivo de conexión
        include("conexion.php");

        // Verificar si la conexión fue exitosa
        if ($conexion->connect_error) {
            echo "<li>Error al conectar con la base de datos: " . htmlspecialchars($conexion->connect_error) . "</li>";
            exit;
        }

        // Consulta para obtener los boletines con estado "Subido"
        $query = "SELECT tema, otro_tema, descripcion FROM boletines WHERE estado = 'Subido'";
        $result = $conexion->query($query);

        // Verificar si hay resultados
        if ($result && $result->num_rows > 0) {
            // Iterar sobre los resultados
            while ($row = $result->fetch_assoc()) {
                // Si el tema es "otro", usar el contenido de "otro_tema"
                $tema = $row['tema'] === "otro" ? $row['otro_tema'] : $row['tema'];

                echo "<li class='boletin'>";
                echo "<strong>Tema:</strong><span class='tema'>" . htmlspecialchars($tema) . "</span><br>";
                echo "<strong>Descripción:</strong> " . htmlspecialchars($row['descripcion']);
                echo "</li>";
            }
        } else {
            // Mostrar mensaje si no hay resultados
            echo "<li>No hay boletines con el estado 'Subido'.</li>";
        }

        // Cerrar la conexión
        $conexion->close();
        ?>
    </ul>

    <a href="index.html">Volver a la página principal</a>
</body>
</html>
