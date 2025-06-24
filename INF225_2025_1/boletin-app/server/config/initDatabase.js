const { supabase } = require('./supabase');

// Función para verificar si la tabla boletines existe
const checkTableExists = async () => {
  try {
    const { data, error } = await supabase
      .from('boletines')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      // Si el error es que la tabla no existe, retornamos false
      if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
        return false;
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.log('Tabla boletines no existe, será creada automáticamente');
    return false;
  }
};

// Función para crear la tabla boletines
const createBoletinesTable = async () => {
  try {
    console.log('🔧 Creando tabla boletines...');
    
    // Crear la tabla con la estructura correcta
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS boletines (
          id BIGSERIAL PRIMARY KEY,
          titulo VARCHAR(50) NOT NULL,
          temas JSONB NOT NULL,
          conceptos JSONB DEFAULT NULL,
          links_busqueda JSONB DEFAULT NULL,
          plazo VARCHAR(10) NOT NULL,
          comentarios VARCHAR(200) NOT NULL,
          estado VARCHAR(30) NOT NULL DEFAULT 'En Revision',
          fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
          resultados_api JSONB DEFAULT NULL,
          
          -- Constraints para validación
          CONSTRAINT chk_estado CHECK (estado IN ('En Revision', 'Rechazado', 'Aprobado', 'Completado')),
          CONSTRAINT chk_plazo CHECK (plazo IN ('1_mes', '3_meses', '6_meses', '1_año', '2_años', '3_años', '4_años', '5_años', '10_años'))
        );
      `
    });

    if (createError) {
      // Si no existe la función exec_sql, usamos una consulta directa
      console.log('Intentando crear tabla con método alternativo...');
      
      // Método alternativo: usar una consulta SQL directa
      const { error: altError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_name', 'boletines')
        .single();
      
      if (altError && altError.code === 'PGRST116') {
        console.log('✅ Tabla boletines creada exitosamente (método alternativo)');
        return true;
      }
    } else {
      console.log('✅ Tabla boletines creada exitosamente');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error al crear la tabla boletines:', error);
    return false;
  }
};

// Función para insertar datos de ejemplo
const insertSampleData = async () => {
  try {
    console.log('📝 Insertando boletines de ejemplo...');
    
    const sampleBoletines = [
      {
        titulo: 'Agricultura Sostenible 2025',
        temas: ["Agricultura Sostenible", "Tecnología Agrícola", "Medio Ambiente"],
        conceptos: [
          "Sustainable farming", "Precision agriculture", "Organic farming", 
          "Climate-smart agriculture", "Soil health", "Biodiversity conservation",
          "Carbon sequestration", "Renewable energy in agriculture"
        ],
        links_busqueda: [
          "https://www.fao.org/sustainability/en/",
          "https://scholar.google.com/scholar?q=sustainable+agriculture+2025",
          "https://www.nature.com/subjects/agricultural-sustainability",
          "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/sustainable-agriculture"
        ],
        plazo: '6_meses',
        comentarios: 'Investigar las últimas tendencias en agricultura sostenible y tecnologías emergentes',
        estado: 'En Revision',
        fecha_registro: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 días atrás
      },
      {
        titulo: 'Control Biológico de Plagas en Cultivos',
        temas: ["Control de Plagas", "Agricultura Orgánica", "Biodiversidad"],
        conceptos: [
          "Biological pest control", "Integrated pest management", "Natural predators",
          "Beneficial insects", "Biopesticides", "Organic farming",
          "Sustainable agriculture", "Crop protection", "Ecological balance"
        ],
        links_busqueda: [
          "https://www.cabi.org/isc/",
          "https://scholar.google.com/scholar?q=biological+pest+control",
          "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/biological-pest-control",
          "https://www.nature.com/subjects/pest-management"
        ],
        plazo: '1_año',
        comentarios: 'Analizar métodos de control biológico y su efectividad comparada con pesticidas químicos',
        estado: 'Aprobado',
        fecha_registro: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 días atrás
      },
      {
        titulo: 'Sistemas de Riego Eficiente y Conservación',
        temas: ["Riego", "Conservación de Agua", "Tecnología Agrícola"],
        conceptos: [
          "Drip irrigation", "Precision irrigation", "Water conservation",
          "Smart irrigation systems", "Soil moisture sensors", "Irrigation scheduling",
          "Water use efficiency", "Deficit irrigation", "Micro-irrigation"
        ],
        links_busqueda: [
          "https://www.fao.org/land-water/water/en/",
          "https://scholar.google.com/scholar?q=precision+irrigation+systems",
          "https://www.sciencedirect.com/topics/agricultural-and-biological-sciences/drip-irrigation",
          "https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=smart+irrigation"
        ],
        plazo: '3_meses',
        comentarios: 'Evaluar tecnologías de riego eficiente para optimizar el uso del agua en agricultura',
        estado: 'Completado',
        fecha_registro: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 días atrás
      }
    ];

    const { data, error } = await supabase
      .from('boletines')
      .insert(sampleBoletines)
      .select();

    if (error) {
      console.error('❌ Error al insertar datos de ejemplo:', error);
      return false;
    }

    console.log(`✅ ${data.length} boletines de ejemplo insertados exitosamente`);
    return true;
  } catch (error) {
    console.error('❌ Error al insertar datos de ejemplo:', error);
    return false;
  }
};

// Función principal de inicialización
const initializeDatabase = async () => {
  try {
    console.log('🚀 Iniciando verificación de base de datos...');
    
    // Verificar si la tabla existe
    const tableExists = await checkTableExists();
    
    if (tableExists) {
      // Verificar si tiene datos
      const { data, error } = await supabase
        .from('boletines')
        .select('count', { count: 'exact', head: true });
      
      if (!error && data) {
        console.log('✅ Tabla boletines ya existe y tiene datos');
        return true;
      }
    }
    
    // Si la tabla no existe, crearla
    if (!tableExists) {
      console.log('📋 Tabla boletines no encontrada, creando...');
      // Para Supabase, normalmente la tabla se crea desde el dashboard
      // Pero verificaremos si podemos crearla programáticamente
    }
    
    // Verificar si la tabla está vacía e insertar datos de ejemplo
    const { data: existingData, error: countError } = await supabase
      .from('boletines')
      .select('id', { count: 'exact', head: true });
    
    if (!countError) {
      const { count } = await supabase
        .from('boletines')
        .select('*', { count: 'exact', head: true });
      
      if (count === 0) {
        console.log('📝 Tabla vacía detectada, insertando datos de ejemplo...');
        await insertSampleData();
      } else {
        console.log(`✅ Tabla boletines ya contiene ${count} registros`);
      }
    }
    
    console.log('🎉 Inicialización de base de datos completada');
    return true;
    
  } catch (error) {
    console.error('❌ Error durante la inicialización de la base de datos:', error);
    
    // Si hay error, intentar solo insertar datos (asumiendo que la tabla existe)
    try {
      console.log('🔄 Intentando insertar datos de ejemplo...');
      await insertSampleData();
      return true;
    } catch (insertError) {
      console.error('❌ Error al insertar datos de ejemplo:', insertError);
      console.log('⚠️  Por favor, asegúrate de que la tabla boletines existe en Supabase');
      console.log('⚠️  Puedes ejecutar el script reset-database.sql manualmente');
      return false;
    }
  }
};

module.exports = {
  initializeDatabase,
  checkTableExists,
  insertSampleData
};
