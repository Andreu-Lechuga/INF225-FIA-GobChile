const { pool } = require('../config/db');

// Modelo para la tabla boletines
const Boletin = {
  // Encontrar todos los boletines
  findAll: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM boletines ORDER BY fecha_registro DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  },
  
  // Encontrar un boletín por ID
  findByPk: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM boletines WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
  
  // Crear un nuevo boletín
  create: async (boletinData) => {
    try {
      const { titulo, temas, plazo, comentarios, estado = 'Registrado' } = boletinData;
      
      // Convertir temas a JSON si es un array
      const temasJSON = typeof temas === 'string' ? temas : JSON.stringify(temas);
      
      const [result] = await pool.query(
        'INSERT INTO boletines (titulo, temas, plazo, comentarios, estado) VALUES (?, ?, ?, ?, ?)',
        [titulo, temasJSON, plazo, comentarios, estado]
      );
      
      // Obtener el boletín recién creado
      const [rows] = await pool.query('SELECT * FROM boletines WHERE id = ?', [result.insertId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  
  // Actualizar un boletín
  update: async (id, boletinData) => {
    try {
      const { titulo, temas, plazo, comentarios, estado, resultados_api } = boletinData;
      
      // Construir la consulta dinámicamente
      let query = 'UPDATE boletines SET ';
      const values = [];
      const updateFields = [];
      
      if (titulo !== undefined) {
        updateFields.push('titulo = ?');
        values.push(titulo);
      }
      
      if (temas !== undefined) {
        updateFields.push('temas = ?');
        // Convertir temas a JSON si es un array
        const temasJSON = typeof temas === 'string' ? temas : JSON.stringify(temas);
        values.push(temasJSON);
      }
      
      if (plazo !== undefined) {
        updateFields.push('plazo = ?');
        values.push(plazo);
      }
      
      if (comentarios !== undefined) {
        updateFields.push('comentarios = ?');
        values.push(comentarios);
      }
      
      if (estado !== undefined) {
        updateFields.push('estado = ?');
        values.push(estado);
      }
      
      if (resultados_api !== undefined) {
        updateFields.push('resultados_api = ?');
        // Convertir resultados_api a JSON si no es una cadena
        const resultadosJSON = typeof resultados_api === 'string' ? resultados_api : JSON.stringify(resultados_api);
        values.push(resultadosJSON);
      }
      
      // Si no hay campos para actualizar, retornar el boletín sin cambios
      if (updateFields.length === 0) {
        const [rows] = await pool.query('SELECT * FROM boletines WHERE id = ?', [id]);
        return rows[0] || null;
      }
      
      query += updateFields.join(', ') + ' WHERE id = ?';
      values.push(id);
      
      await pool.query(query, values);
      
      // Obtener el boletín actualizado
      const [rows] = await pool.query('SELECT * FROM boletines WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar un boletín
  destroy: async (id) => {
    try {
      const [result] = await pool.query('DELETE FROM boletines WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },
  
  // Método para calcular días transcurridos (simulando el método de instancia)
  diasTranscurridos: (fechaRegistro) => {
    const fecha = new Date(fechaRegistro);
    const hoy = new Date();
    const diferencia = hoy - fecha;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }
};

module.exports = {
  Boletin
};
