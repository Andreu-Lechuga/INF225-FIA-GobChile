const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

// Configuración de Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Las variables de entorno de Supabase no están configuradas correctamente');
}

// Cliente de Supabase para el servidor (con service role key)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Función para probar la conexión a Supabase
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('boletines')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error al conectar a Supabase:', error);
      return false;
    }
    
    console.log('Conexión a Supabase establecida correctamente');
    return true;
  } catch (error) {
    console.error('Error al probar conexión a Supabase:', error);
    return false;
  }
};

module.exports = {
  supabase,
  testConnection
};
