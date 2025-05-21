import unittest
import requests
import json
import random
import string

class TestLoginEndpoint(unittest.TestCase):
    """
    Clase de prueba para el endpoint de inicio de sesión.
    
    Esta clase contiene pruebas unitarias para verificar el funcionamiento
    del endpoint de inicio de sesión (/api/auth/login).
    """
    
    @classmethod
    def setUpClass(cls):
        """
        Configuración inicial para todas las pruebas de inicio de sesión.
        
        Este método se ejecuta una vez antes de todas las pruebas de la clase.
        Configura la URL base, genera datos de prueba únicos y registra un
        usuario para las pruebas de inicio de sesión.
        """
        # Configuración inicial para todas las pruebas de login
        cls.base_url = "http://localhost:5000/api/auth"
        cls.register_url = f"{cls.base_url}/register"
        cls.login_url = f"{cls.base_url}/login"
        
        # Crear un usuario para las pruebas de login
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
        cls.test_user = {
            "username": f"loginuser_{random_suffix}",
            "email": f"login_{random_suffix}@example.com",
            "password": "Password123!",
            "role": "usuario-publico"
        }
        
        # Registrar el usuario para las pruebas
        try:
            response = requests.post(cls.register_url, json=cls.test_user)
            cls.register_response = response.json()
            print(f"Usuario para pruebas de login creado: {cls.test_user['username']}")
        except Exception as e:
            print(f"Error al crear usuario para pruebas de login: {str(e)}")

    @classmethod
    def tearDownClass(cls):
        """
        Limpieza después de todas las pruebas.
        
        Este método se ejecuta una vez después de todas las pruebas de la clase.
        Aquí se podrían eliminar los usuarios de prueba si fuera necesario.
        """
        print("Finalizando pruebas de inicio de sesión")
        # En un entorno real, aquí eliminaríamos los usuarios de prueba

    def test_successful_login(self):
        """
        Prueba de inicio de sesión exitoso con credenciales válidas.
        
        Verifica que un usuario registrado pueda iniciar sesión correctamente
        y que la respuesta contenga los datos esperados.
        """
        # Datos para el inicio de sesión
        login_data = {
            "username": self.test_user["username"],
            "password": self.test_user["password"]
        }
        
        # Realizar la solicitud de inicio de sesión
        response = requests.post(self.login_url, json=login_data)
        
        # Verificar código de estado
        self.assertEqual(response.status_code, 200, 
                         f"Se esperaba código 200, se obtuvo {response.status_code}")
        
        # Verificar estructura y contenido de la respuesta
        data = response.json()
        self.assertTrue(data["success"], "El campo 'success' debería ser True")
        self.assertEqual(data["message"], "Inicio de sesión exitoso.", 
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

    def test_invalid_credentials(self):
        """
        Prueba de inicio de sesión fallido con credenciales inválidas.
        
        Verifica que no se pueda iniciar sesión con una contraseña incorrecta
        y que la respuesta contenga un mensaje de error apropiado.
        """
        # Datos para el inicio de sesión con contraseña incorrecta
        login_data = {
            "username": self.test_user["username"],
            "password": "ContraseñaIncorrecta123!"
        }
        
        # Realizar la solicitud de inicio de sesión
        response = requests.post(self.login_url, json=login_data)
        
        # Verificar código de estado
        self.assertEqual(response.status_code, 401, 
                         f"Se esperaba código 401, se obtuvo {response.status_code}")
        
        # Verificar estructura y contenido de la respuesta
        data = response.json()
        self.assertFalse(data["success"], "El campo 'success' debería ser False")
        self.assertEqual(data["message"], "Credenciales inválidas.", 
                         "El mensaje de error no coincide")


if __name__ == "__main__":
    unittest.main()
