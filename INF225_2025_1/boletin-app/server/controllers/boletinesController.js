// Importar el modelo de Boletin
const { supabase } = require('../config/supabase');

// Función auxiliar para calcular días transcurridos
const calcularDiasTranscurridos = (fechaRegistro) => {
  const fecha = new Date(fechaRegistro);
  const hoy = new Date();
  const diferencia = hoy - fecha;
  return Math.floor(diferencia / (1000 * 60 * 60 * 24));
};

// Controladores
const boletinesController = {
  // Obtener todos los boletines
  getAllBoletines: async (req, res) => {
    try {
      const { data: boletines, error } = await supabase
        .from('boletines')
        .select('*')
        .order('fecha_registro', { ascending: false });
      
      if (error) throw error;
      
      const formattedBoletines = boletines.map(boletin => ({
        id: boletin.id,
        titulo: boletin.titulo,
        temas: boletin.temas,
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
      const { data: boletines, error } = await supabase
        .from('boletines')
        .select('*')
        .order('fecha_registro', { ascending: false });
      
      if (error) throw error;
      
      const estadoBoletines = boletines.map(boletin => ({
        id: boletin.id,
        titulo: boletin.titulo,
        temas: boletin.temas,
        fecha_registro: new Date(boletin.fecha_registro).toLocaleDateString('es-ES'),
        dias_transcurridos: calcularDiasTranscurridos(boletin.fecha_registro),
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
      
      const { data: boletin, error } = await supabase
        .from('boletines')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({
            status: 'error',
            message: `No se encontró un boletín con el ID ${id}`
          });
        }
        throw error;
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
      console.log('=== CREANDO NUEVO BOLETÍN ===');
      console.log('Datos recibidos:', req.body);
      
      const { titulo, temas, conceptos, plazo, comentarios } = req.body;
      
      // Validaciones básicas
      if (!titulo || !temas || !plazo) {
        console.log('Error de validación: campos obligatorios faltantes');
        return res.status(400).json({
          status: 'error',
          message: 'Los campos título, temas y plazo son obligatorios',
          received: { titulo, temas, plazo, comentarios }
        });
      }
      
      // Preparar datos para insertar
      const boletinData = {
        titulo,
        temas: Array.isArray(temas) ? temas : [temas],
        conceptos: conceptos || null,
        plazo,
        comentarios: comentarios || 'Sin comentarios adicionales',
        estado: 'En Revision'
      };
      
      console.log('Datos preparados para insertar:', boletinData);
      
      // Crear nuevo boletín
      const { data: newBoletin, error } = await supabase
        .from('boletines')
        .insert([boletinData])
        .select()
        .single();
      
      if (error) {
        console.error('Error de Supabase:', error);
        throw error;
      }
      
      console.log('Boletín creado exitosamente:', newBoletin);
      
      res.status(201).json({
        status: 'success',
        message: 'Boletín creado correctamente',
        data: newBoletin
      });
    } catch (error) {
      console.error('Error completo al crear boletín:', error);
      res.status(500).json({
        status: 'error',
        message: 'Error al crear el boletín',
        error: error.message,
        details: error.details || null,
        hint: error.hint || null
      });
    }
  },
  
  // Actualizar un boletín
  updateBoletin: async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, temas, conceptos, plazo, comentarios, estado, resultados_api } = req.body;
      
      // Verificar si el boletín existe
      const { data: existingBoletin, error: checkError } = await supabase
        .from('boletines')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError && checkError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró un boletín con el ID ${id}`
        });
      }
      
      if (checkError) throw checkError;
      
      // Preparar datos para actualizar
      const updateData = {};
      if (titulo !== undefined) updateData.titulo = titulo;
      if (temas !== undefined) updateData.temas = temas;
      if (conceptos !== undefined) updateData.conceptos = conceptos;
      if (plazo !== undefined) updateData.plazo = plazo;
      if (comentarios !== undefined) updateData.comentarios = comentarios;
      if (estado !== undefined) updateData.estado = estado;
      if (resultados_api !== undefined) updateData.resultados_api = resultados_api;
      
      // Actualizar boletín
      const { data: updatedBoletin, error } = await supabase
        .from('boletines')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
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
      
      // Verificar si el boletín existe
      const { data: existingBoletin, error: checkError } = await supabase
        .from('boletines')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError && checkError.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: `No se encontró un boletín con el ID ${id}`
        });
      }
      
      if (checkError) throw checkError;
      
      // Eliminar boletín
      const { error } = await supabase
        .from('boletines')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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
