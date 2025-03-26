<?php
// actualizar_boletin_api.php

class ActualizadorBoletin {
    private $conexion;

    public function __construct() {
        $this->conexion = new mysqli("localhost", "usuario", "contraseña", "boletines_db");
        
        if ($this->conexion->connect_error) {
            throw new Exception("Error de conexión: " . $this->conexion->connect_error);
        }
    }

    public function actualizarContenido($boletinId, $datos) {
        try {
            $this->conexion->begin_transaction();

            // Procesar noticias
            if (!empty($datos['noticias'])) {
                foreach ($datos['noticias'] as $noticia) {
                    $stmt = $this->conexion->prepare("CALL agregar_contenido(?, 'noticia', ?, ?, ?)");
                    $stmt->bind_param("isss", 
                        $boletinId,
                        $noticia['titulo'],
                        $noticia['descripcion'],
                        $noticia['url']
                    );
                    $stmt->execute();
                }
            }

            // Procesar eventos
            if (!empty($datos['eventos'])) {
                foreach ($datos['eventos'] as $evento) {
                    $stmt = $this->conexion->prepare("CALL agregar_contenido(?, 'evento', ?, ?, ?)");
                    $stmt->bind_param("isss", 
                        $boletinId,
                        $evento['titulo'],
                        $evento['descripcion'],
                        $evento['url']
                    );
                    $stmt->execute();
                }
            }

            // Procesar patentes
            if (!empty($datos['patentes'])) {
                foreach ($datos['patentes'] as $patente) {
                    $stmt = $this->conexion->prepare("CALL agregar_contenido(?, 'patente', ?, ?, ?)");
                    $stmt->bind_param("isss", 
                        $boletinId,
                        $patente['titulo'],
                        $patente['descripcion'],
                        $patente['url']
                    );
                    $stmt->execute();
                }
            }

            $this->conexion->commit();
            return true;

        } catch (Exception $e) {
            $this->conexion->rollback();
            throw new Exception("Error al actualizar el boletín: " . $e->getMessage());
        }
    }

    public function __destruct() {
        $this->conexion->close();
    }
}

// Ejemplo de uso con datos de la API
try {
    // Datos de ejemplo que vendrían de la API
    $datosAPI = [
        'noticias' => [
            [
                'titulo' => 'Nueva tecnología agrícola',
                'descripcion' => 'Descripción de la noticia...',
                'url' => 'http://ejemplo.com/noticia1'
            ],
            // ... más noticias
        ],
        'eventos' => [
            [
                'titulo' => 'Conferencia de Agricultura',
                'descripcion' => 'Descripción del evento...',
                'url' => 'http://ejemplo.com/evento1'
            ],
            // ... más eventos
        ],
        'patentes' => [
            [
                'titulo' => 'Nueva patente agrícola',
                'descripcion' => 'Descripción de la patente...',
                'url' => 'http://ejemplo.com/patente1'
            ],
            // ... más patentes
        ]
    ];

    $boletinId = 1; // ID del boletín a actualizar
    
    $actualizador = new ActualizadorBoletin();
    if ($actualizador->actualizarContenido($boletinId, $datosAPI)) {
        echo "Contenido actualizado exitosamente";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>