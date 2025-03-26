<?php
require_once '../includes/conexion.php';

function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Obtener conexión
        $db = Database::getInstance();
        $conn = $db->getConnection();

        // Sanitizar y validar datos
        $titulo = sanitizeInput($_POST['titulo']);
        $plazo = (int)$_POST['span']; // Convertir el span a número de meses
        $descripcion = sanitizeInput($_POST['indicaciones']);

        // Validar longitudes
        if (strlen($titulo) > MAX_TITULO_LENGTH) {
            throw new Exception("El título excede el límite de caracteres permitido");
        }
        if (strlen($descripcion) > MAX_DESC_LENGTH) {
            throw new Exception("La descripción excede el límite de caracteres permitido");
        }

        // Preparar la consulta
        $stmt = $conn->prepare("
            INSERT INTO boletines (titulo, plazo, estado, descripcion_extra) 
            VALUES (?, ?, ?, ?)
        ");

        $estado = ESTADO_INICIAL;
        $stmt->bind_param("siss", $titulo, $plazo, $estado, $descripcion);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            // Redirigir a la página de éxito
            header("Location: estado-boletines.php?status=success");
            exit();
        } else {
            throw new Exception("Error al guardar el boletín");
        }

    } catch (Exception $e) {
        // Manejar el error
        header("Location: formulario.php?error=" . urlencode($e->getMessage()));
        exit();
    }
} else {
    // Si no es POST, redirigir al formulario
    header("Location: formulario.php");
    exit();
}
?>