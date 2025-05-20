const express = require('express');
const router = express.Router();
const boletinesController = require('../controllers/boletinesController');
// const { authenticateToken } = require('../middleware/authMiddleware');

// Rutas públicas
// Obtener todos los boletines
router.get('/', boletinesController.getAllBoletines);

// Obtener el estado de los boletines
router.get('/estado', boletinesController.getEstadoBoletines);

// Obtener un boletín por ID
router.get('/:id', boletinesController.getBoletinById);

// Crear un nuevo boletín (temporalmente público para facilitar pruebas)
router.post('/', boletinesController.createBoletin);

// Actualizar un boletín (temporalmente público para facilitar pruebas)
router.put('/:id', boletinesController.updateBoletin);

// Eliminar un boletín (temporalmente público para facilitar pruebas)
router.delete('/:id', boletinesController.deleteBoletin);

// Nota: En un entorno de producción, las rutas de creación, actualización y eliminación
// deberían estar protegidas con autenticación, por ejemplo:
// router.post('/', authenticateToken, boletinesController.createBoletin);

module.exports = router;
