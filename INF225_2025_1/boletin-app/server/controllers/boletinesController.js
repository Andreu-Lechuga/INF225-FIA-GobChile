// Importar el modelo de Boletin
const { Boletin } = require('../models/Boletin');

// Controladores
const boletinesController = {
  // Obtener todos los boletines
  getAllBoletines: async (req, res) => {
    try {
      const boletines = await Boletin.findAll();
      
      const formattedBoletines = boletines.map(boletin => ({
        id: boletin.id,
        titulo: boletin.titulo,
        temas: typeof boletin.temas === 'string' ? JSON.parse(boletin.temas) : boletin.temas,
        fecha: new Date(boletin.fecha_registro).toLocaleDateString('es-ES'),
        estado: boletin.estado
      }));
      
      res.json({
        status: 'success',
        data: formattedBoletines
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener los boletines',
        error: error.message
      });
    }
  },
  
  // Obtener el estado de los boletines
  getEstadoBoletines: async (req, res) => {
    try {
      const boletines = await Boletin.findAll();
      
      const estadoBoletines = boletines.map(boletin => ({
        id: boletin.id,
        titulo: boletin.titulo,
        temas: typeof boletin.temas === 'string' ? JSON.parse(boletin.temas) : boletin.temas,
        fecha_registro: new Date(boletin.fecha_registro).toLocaleDateString('es-ES'),
        dias_transcurridos: Boletin.diasTranscurridos(boletin.fecha_registro),
        estado: boletin.estado
      }));
      
      res.json({
        status: 'success',
        data: estadoBoletines
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el estado de los boletines',
        error: error.message
      });
    }
  },
  
  // Obtener un boletín por ID
  getBoletinById: async (req, res) => {
    try {
      const { id } = req.params;
      const boletin = await Boletin.findByPk(id);
      
      if (!boletin) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró un boletín con el ID ${id}`
        });
      }
      
      // Parsear el campo temas si es una cadena JSON
      if (boletin.temas && typeof boletin.temas === 'string') {
        boletin.temas = JSON.parse(boletin.temas);
      }
      
      // Parsear el campo resultados_api si es una cadena JSON
      if (boletin.resultados_api && typeof boletin.resultados_api === 'string') {
        boletin.resultados_api = JSON.parse(boletin.resultados_api);
      }
      
      res.json({
        status: 'success',
        data: boletin
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al obtener el boletín',
        error: error.message
      });
    }
  },
  
  // Crear un nuevo boletín
  createBoletin: async (req, res) => {
    try {
      const { titulo, temas, plazo, comentarios } = req.body;
      
      // Validaciones
      if (!titulo || !temas || !plazo || !comentarios) {
        return res.status(400).json({
          status: 'error',
          message: 'Todos los campos son obligatorios'
        });
      }
      
      // Crear nuevo boletín
      const newBoletin = await Boletin.create({
        titulo,
        temas,
        plazo,
        comentarios,
        estado: 'Registrado'
      });
      
      res.status(201).json({
        status: 'success',
        message: 'Boletín creado correctamente',
        data: newBoletin
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al crear el boletín',
        error: error.message
      });
    }
  },
  
  // Actualizar un boletín
  updateBoletin: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, temas, plazo, comentarios, estado } = req.body;
      
      const boletin = await Boletin.findByPk(id);
      
      if (!boletin) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró un boletín con el ID ${id}`
        });
      }
      
      // Actualizar boletín
      const updatedBoletin = await Boletin.update(id, {
        titulo,
        temas,
        plazo,
        comentarios,
        estado
      });
      
      res.json({
        status: 'success',
        message: 'Boletín actualizado correctamente',
        data: updatedBoletin
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al actualizar el boletín',
        error: error.message
      });
    }
  },
  
  // Eliminar un boletín
  deleteBoletin: async (req, res) => {
    try {
      const { id } = req.params;
      const boletin = await Boletin.findByPk(id);
      
      if (!boletin) {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró un boletín con el ID ${id}`
        });
      }
      
      await Boletin.destroy(id);
      
      res.json({
        status: 'success',
        message: 'Boletín eliminado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al eliminar el boletín',
        error: error.message
      });
    }
  }
};

module.exports = boletinesController;
