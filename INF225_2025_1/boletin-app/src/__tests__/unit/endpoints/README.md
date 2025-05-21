# Pruebas Unitarias para Endpoints de Autenticación

Este directorio contiene pruebas unitarias para los endpoints de autenticación de la aplicación Boletín de Agricultura.

## Descripción

Las pruebas unitarias se han implementado utilizando el framework `unittest` de Python. Se han seleccionado dos endpoints para probar:

1. **Registro de usuarios** (`/api/auth/register`)
2. **Inicio de sesión** (`/api/auth/login`)

Para cada endpoint, se han diseñado casos de prueba específicos que verifican tanto el comportamiento exitoso como el manejo de errores, incluyendo casos frontera.

## Estructura de las pruebas

- `test_register_endpoint.py`: Pruebas para el endpoint de registro de usuarios
- `test_login_endpoint.py`: Pruebas para el endpoint de inicio de sesión

Cada archivo contiene una clase de prueba que implementa los métodos `setUpClass()` y `tearDownClass()` para configurar y limpiar el entorno de prueba, respectivamente.

## Casos de prueba

### Endpoint de registro (`/api/auth/register`)

| Caso de prueba | Método | Descripción |
|----------------|--------|-------------|
| Registro exitoso | `test_successful_registration` | Verifica que un usuario nuevo pueda registrarse correctamente con datos válidos |
| Registro con nombre de usuario inválido | `test_invalid_username_registration` | Verifica que el sistema rechace nombres de usuario con caracteres especiales no permitidos |
| Caso frontera de longitud de contraseña | `test_password_length_boundary` | Verifica que el sistema acepte contraseñas de 6 caracteres y rechace contraseñas de 5 caracteres |

### Endpoint de inicio de sesión (`/api/auth/login`)

| Caso de prueba | Método | Descripción |
|----------------|--------|-------------|
| Inicio de sesión exitoso | `test_successful_login` | Verifica que un usuario registrado pueda iniciar sesión correctamente con credenciales válidas |
| Inicio de sesión con usuario inválido | `test_invalid_user_login` | Verifica que el sistema rechace intentos de inicio de sesión con nombres de usuario que no existen |
| Inputs vacíos o con espacios | `test_empty_or_whitespace_inputs` | Verifica que el sistema rechace intentos de inicio de sesión con inputs vacíos o que solo contienen espacios |

## Ejecución de las pruebas

Para ejecutar las pruebas, asegúrese de que el servidor esté en ejecución en `localhost:5000` y luego ejecute los siguientes comandos:

```bash
# Ejecutar todas las pruebas
python -m unittest discover -s src/__tests__/unit/endpoints

# Ejecutar pruebas específicas
python -m unittest src/__tests__/unit/endpoints/test_register_endpoint.py
python -m unittest src/__tests__/unit/endpoints/test_login_endpoint.py

# Ejecutar un método de prueba específico
python -m unittest src/__tests__/unit/endpoints/test_register_endpoint.py:TestRegisterEndpoint.test_password_length_boundary
```

También puede utilizar el script `run_tests.py` para ejecutar todas las pruebas y generar un informe detallado:

```bash
python src/__tests__/unit/endpoints/run_tests.py
```

## Consideraciones

- Las pruebas asumen que el servidor está ejecutándose en `localhost:5000`.
- Se utilizan datos aleatorios para evitar conflictos con usuarios existentes.
- Los casos de prueba incluyen validaciones específicas para casos frontera y manejo de errores.
- Para más detalles sobre los casos de prueba, consulte el archivo `casos_de_prueba.md`.
