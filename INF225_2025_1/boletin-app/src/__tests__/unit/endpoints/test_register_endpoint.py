import unittest
import requests
import json
import random
import string

class TestRegisterEndpoint(unittest.TestCase):
    """
    Clase de prueba para el endpoint de registro de usuarios.
    
    Esta clase contiene pruebas unitarias para verificar el funcionamiento
    del endpoint de registro de usuarios (/api/auth/register).
    """
    
    @classmethod
    def setUpClass(cls):
        """
        Configuración inicial para todas las pruebas de registro.
        
        Este método se ejecuta una vez antes de todas las pruebas de la clase.
        Configura la URL base, genera datos de prueba únicos y registra un
        usuario para las pruebas de duplicación.
        """
        # Configuración inicial para todas las pruebas de registro
        cls.base_url = "http://localhost:5000/api/auth"
        cls.register_url = f"{cls.base_url}/register"
        
        # Generar datos de prueba únicos para cada usuario
        random_suffix1 = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        random_suffix2 = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        
        # Usuario para la prueba de registro exitoso
        cls.test_user = {
            "username": f"testuser_{random_suffix1}",
            "email": f"test_{random_suffix1}@example.com",
            "password": "Password123!",
            "role": "usuario-publico"
        }
        
        # Usuario para la primera parte de la prueba de duplicado
        cls.duplicate_user_original = {
            "username": f"dupuser_{random_suffix2}",
            "email": f"duplicate_{random_suffix2}@example.com",
            "password": "Password123!",
            "role": "usuario-publico"
        }
        
        # Usuario para intentar duplicar (mismo username, email diferente)
        cls.duplicate_user = {
            "username": f"dupuser_{random_suffix2}",  # Mismo username que duplicate_user_original
            "email": f"different_{random_suffix2}@example.com",
            "password": "Password123!",
            "role": "usuario-publico"
        }
        
        # Registrar el usuario original para la prueba de duplicado
        try:
            response = requests.post(cls.register_url, json=cls.duplicate_user_original)
            cls.duplicate_response = response.json()
            print(f"Usuario para prueba de duplicado creado: {cls.duplicate_user_original['username']}")
        except Exception as e:
            print(f"Error al crear usuario para prueba de duplicado: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza después de todas las pruebas.
        
        Este método se ejecuta una vez después de todas las pruebas de la clase.
        Aquí se podrían eliminar los usuarios de prueba si fuera necesario.
        """
        print("Finalizando pruebas de registro de usuarios")
        # En un entorno real, aquí eliminaríamos los usuarios de prueba

    def test_successful_registration(self):
        """
        Prueba de registro exitoso con datos válidos.
        
        Verifica que un usuario nuevo pueda registrarse correctamente
        y que la respuesta contenga los datos esperados.
        """
        # Realizar la solicitud de registro
        response = requests.post(self.register_url, json=self.test_user)
        
        # Verificar código de estado
        self.assertEqual(response.status_code, 201, 
                         f"Se esperaba código 201, se obtuvo {response.status_code}")
        
        # Verificar estructura y contenido de la respuesta
        data = response.json()
        self.assertTrue(data["success"], "El campo 'success' debería ser True")
        self.assertEqual(data["message"], "Usuario registrado correctamente.", 
                         "El mensaje de éxito no coincide")
        self.assertIn("user", data, "La respuesta debería incluir datos del usuario")
        self.assertIn("token", data, "La respuesta debería incluir un token")
        
        # Verificar datos del usuario
        user = data["user"]
        self.assertEqual(user["username"], self.test_user["username"], 
                         "El nombre de usuario no coincide")
        self.assertEqual(user["email"], self.test_user["email"], 
                         "El email no coincide")
        self.assertNotIn("password", user, 
                         "La contraseña no debería incluirse en la respuesta")

    def test_duplicate_registration(self):
        """
        Prueba de registro fallido con nombre de usuario duplicado.
        
        Verifica que no se pueda registrar un usuario con un nombre de usuario
        que ya existe en la base de datos.
        """
        # Realizar la solicitud de registro con datos duplicados
        response = requests.post(self.register_url, json=self.duplicate_user)
        
        # Verificar código de estado
        self.assertEqual(response.status_code, 400, 
                         f"Se esperaba código 400, se obtuvo {response.status_code}")
        
        # Verificar estructura y contenido de la respuesta
        data = response.json()
        self.assertFalse(data["success"], "El campo 'success' debería ser False")
        self.assertIn("ya está en uso", data["message"], 
                      "El mensaje debería indicar que el usuario o email ya está en uso")


if __name__ == "__main__":
    unittest.main()
