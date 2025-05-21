# Pruebas Unitarias para Endpoints de Autenticación

Este directorio contiene pruebas unitarias para los endpoints de autenticación de la aplicación Boletín de Agricultura.

## Descripción

Las pruebas unitarias se han implementado siguiendo los requisitos del Hito 3, utilizando el framework `unittest` de Python. Se han seleccionado dos endpoints para probar:

1. **Registro de usuarios** (`/api/auth/register`)
2. **Inicio de sesión** (`/api/auth/login`)

Para cada endpoint, se han diseñado dos casos de prueba que verifican tanto el comportamiento exitoso como el manejo de errores.

## Estructura de las pruebas

- `test_register_endpoint.py`: Pruebas para el endpoint de registro de usuarios
- `test_login_endpoint.py`: Pruebas para el endpoint de inicio de sesión

Cada archivo contiene una clase de prueba que implementa los métodos `setUpClass()` y `tearDownClass()` para configurar y limpiar el entorno de prueba, respectivamente.

## Casos de prueba

### Endpoint de registro (`/api/auth/register`)

| Caso de prueba | Inputs | Salida esperada | Contexto de ejecución |
|----------------|--------|-----------------|------------------------|
| Registro exitoso | `username`, `email`, `password` y `role` válidos | Código 201, mensaje de éxito, datos del usuario creado y token JWT | Usuario nuevo que no existe en la base de datos |
| Registro fallido | `username` o `email` ya existente | Código 400, mensaje de error indicando que el usuario o email ya está en uso | Intentar registrar un usuario con datos que ya existen |

### Endpoint de inicio de sesión (`/api/auth/login`)

| Caso de prueba | Inputs | Salida esperada | Contexto de ejecución |
|----------------|--------|-----------------|------------------------|
| Inicio de sesión exitoso | `username` y `password` válidos | Código 200, mensaje de éxito, datos del usuario y token JWT | Usuario registrado previamente en el sistema |
| Inicio de sesión fallido | `username` válido pero `password` incorrecto | Código 401, mensaje de error indicando credenciales inválidas | Intentar iniciar sesión con contraseña incorrecta |

## Ejecución de las pruebas

Para ejecutar las pruebas, asegúrese de que el servidor esté en ejecución en `localhost:5000` y luego ejecute los siguientes comandos:

```bash
# Ejecutar todas las pruebas
python -m unittest discover -s src/__tests__/unit/endpoints

# Ejecutar pruebas específicas
python -m unittest src/__tests__/unit/endpoints/test_register_endpoint.py
python -m unittest src/__tests__/unit/endpoints/test_login_endpoint.py
```

## Consideraciones

- Las pruebas asumen que el servidor está ejecutándose en `localhost:5000`.
- Se utilizan datos aleatorios para evitar conflictos con usuarios existentes.
- En un entorno de producción, sería recomendable usar una base de datos de prueba separada.
