<?php
// Conexión a la base de datos
include("conexion.php");

// Recibir datos del formulario
$tema = $_POST['tema'];
$otroTema = !empty($_POST['otroTema']) ? $_POST['otroTema'] : NULL;
$prioridad = $_POST['prioridad'];
$plazo = $_POST['plazo'];
$descripcion = !empty($_POST['descripcion']) ? trim($_POST['descripcion']) : NULL;

// Validar que la descripción no esté vacía
if (!$descripcion) {
    die("Error: La descripción es obligatoria.");
}

// Preparar la consulta SQL
$stmt = $conexion->prepare("INSERT INTO boletines (tema, otro_tema, prioridad, plazo, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)");
$estado = "Registrado"; // Estado predeterminado
$stmt->bind_param("ssssss", $tema, $otroTema, $prioridad, $plazo, $descripcion, $estado);

// Ejecutar la consulta
if ($stmt->execute()) {
    // Redirigir a Estado_Boletines.php tras éxito
    header("Location: Estado_Boletines.php");
    exit;
} else {
    // Mostrar mensaje de error si algo falla
    echo "Error al generar el boletín: " . $stmt->error;
}

// Cerrar la conexión
$stmt->close();
$conexion->close();
?>
