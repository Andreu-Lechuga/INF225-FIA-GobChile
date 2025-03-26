<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado de los Boletines</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 12px;
            text-align: center;
        }
        th {
            background-color: #4CAF50;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        a {
            color: #4CAF50;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Estado de los Boletines</h1>

    <table>
        <thead>
            <tr>
                <th>Temática</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
                <th>Días desde el Registro</th>
            </tr>
        </thead>
        <tbody>
            <?php
            // Incluir el archivo de conexión
            include("conexion.php");

            // Manejar errores de conexión
            if ($conexion->connect_error) {
                echo "<tr><td colspan='4'>Error de conexión a la base de datos: " . htmlspecialchars($conexion->connect_error) . "</td></tr>";
                exit;
            }

            // Consulta para obtener los boletines
            $query = "SELECT tema, otro_tema, estado, fecha_registro FROM boletines";
            $result = $conexion->query($query);

            // Verificar si hay resultados
            if ($result && $result->num_rows > 0) {
                // Iterar sobre los resultados
                while ($row = $result->fetch_assoc()) {
                    // Calcular los días desde el registro
                    $fechaRegistro = new DateTime($row['fecha_registro']);
                    $hoy = new DateTime();
                    $diferencia = $hoy->diff($fechaRegistro)->days;

                    // Mostrar tema o contenido de otro_tema si tema es "otro"
                    $tema = $row['tema'] === "otro" ? $row['otro_tema'] : $row['tema'];

                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($tema) . "</td>";
                    echo "<td>" . htmlspecialchars($row['estado']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['fecha_registro']) . "</td>";
                    echo "<td>" . $diferencia . " días</td>";
                    echo "</tr>";
                }
            } else {
                // Mostrar mensaje si no hay resultados
                echo "<tr><td colspan='4'>No hay boletines registrados</td></tr>";
            }

            // Cerrar la conexión
            $conexion->close();
            ?>
        </tbody>
    </table>
    
    <a href="index.html">Volver a la página principal</a>
</body>
</html>
