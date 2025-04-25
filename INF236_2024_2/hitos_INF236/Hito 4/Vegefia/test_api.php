<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados</title>
</head>
<body>
    <h1>Resultados del Script Python</h1>
    <p>testeo</p>
    <?php
    // Ruta completa al script Python
    $pythonScript = 'C:\\Users\\pigna\\OneDrive\\Escritorio\\api local\\web_scraping.py';

    // Ejecutar el script Python
    $output = shell_exec('python "' . $pythonScript . '"');

    // Mostrar la salida del script
    echo "<pre>$output</pre>";
    ?>
    <a href="index.html">Volver</a>
</body>
</html>
