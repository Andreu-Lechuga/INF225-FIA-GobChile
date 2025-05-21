# Casos de Prueba para Endpoints de Autenticación

Este documento detalla los casos de prueba diseñados para los endpoints de autenticación de la aplicación Boletín de Agricultura, siguiendo los requisitos del Hito 3.

## Endpoint 1: Registro de Usuarios (`/api/auth/register`)

### Caso de Prueba 1: Registro Exitoso

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | REG-001 |
| **Nombre** | Registro exitoso con datos válidos |
| **Descripción** | Verificar que un usuario nuevo pueda registrarse correctamente proporcionando datos válidos |
| **Precondiciones** | El servidor está en ejecución y la base de datos está accesible |
| **Inputs** | - `username`: Nombre de usuario único (generado aleatoriamente)<br>- `email`: Correo electrónico único (generado aleatoriamente)<br>- `password`: "Password123!"<br>- `role`: "usuario-publico" |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/register` con los datos de entrada<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 201 (Created)<br>- Respuesta JSON con:<br>  * `success`: true<br>  * `message`: "Usuario registrado correctamente."<br>  * `user`: Objeto con datos del usuario (sin contraseña)<br>  * `token`: Token JWT válido |
| **Contexto de Ejecución** | Usuario nuevo que no existe previamente en la base de datos |
| **Clases de Equivalencia** | - Nombre de usuario: Alfanumérico, longitud entre 3 y 50 caracteres<br>- Email: Formato válido de correo electrónico<br>- Contraseña: Longitud mínima de 6 caracteres<br>- Rol: Uno de los roles válidos del sistema |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_successful_registration` en la clase `TestRegisterEndpoint` |

### Caso de Prueba 2: Registro Fallido por Duplicación

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | REG-002 |
| **Nombre** | Registro fallido con datos duplicados |
| **Descripción** | Verificar que el sistema rechace el registro de un usuario con nombre de usuario que ya existe |
| **Precondiciones** | - El servidor está en ejecución y la base de datos está accesible<br>- Ya existe un usuario con los datos que se intentarán registrar |
| **Inputs** | - `username`: Nombre de usuario que ya existe en la base de datos<br>- `email`: Correo electrónico único (diferente al existente)<br>- `password`: "Password123!"<br>- `role`: "usuario-publico" |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/register` con los datos duplicados<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 400 (Bad Request)<br>- Respuesta JSON con:<br>  * `success`: false<br>  * `message`: Mensaje indicando que el nombre de usuario o correo electrónico ya está en uso |
| **Contexto de Ejecución** | Intentar registrar un usuario con un nombre de usuario que ya existe en la base de datos |
| **Clases de Equivalencia** | - Datos duplicados: Nombre de usuario que ya existe |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_duplicate_registration` en la clase `TestRegisterEndpoint` |

## Endpoint 2: Inicio de Sesión (`/api/auth/login`)

### Caso de Prueba 3: Inicio de Sesión Exitoso

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | LOG-001 |
| **Nombre** | Inicio de sesión exitoso con credenciales válidas |
| **Descripción** | Verificar que un usuario registrado pueda iniciar sesión correctamente proporcionando credenciales válidas |
| **Precondiciones** | - El servidor está en ejecución y la base de datos está accesible<br>- Existe un usuario registrado con las credenciales de prueba |
| **Inputs** | - `username`: Nombre de usuario registrado<br>- `password`: Contraseña correcta |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/login` con las credenciales<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 200 (OK)<br>- Respuesta JSON con:<br>  * `success`: true<br>  * `message`: "Inicio de sesión exitoso."<br>  * `user`: Objeto con datos del usuario (sin contraseña)<br>  * `token`: Token JWT válido |
| **Contexto de Ejecución** | Usuario registrado previamente en el sistema |
| **Clases de Equivalencia** | - Credenciales válidas: Combinación correcta de nombre de usuario y contraseña |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_successful_login` en la clase `TestLoginEndpoint` |

### Caso de Prueba 4: Inicio de Sesión Fallido

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | LOG-002 |
| **Nombre** | Inicio de sesión fallido con credenciales inválidas |
| **Descripción** | Verificar que el sistema rechace el inicio de sesión cuando se proporciona una contraseña incorrecta |
| **Precondiciones** | - El servidor está en ejecución y la base de datos está accesible<br>- Existe un usuario registrado con el nombre de usuario de prueba |
| **Inputs** | - `username`: Nombre de usuario registrado<br>- `password`: Contraseña incorrecta |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/login` con las credenciales inválidas<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 401 (Unauthorized)<br>- Respuesta JSON con:<br>  * `success`: false<br>  * `message`: "Credenciales inválidas." |
| **Contexto de Ejecución** | Intentar iniciar sesión con una contraseña incorrecta para un usuario existente |
| **Clases de Equivalencia** | - Credenciales inválidas: Nombre de usuario correcto pero contraseña incorrecta |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_invalid_credentials` en la clase `TestLoginEndpoint` |

## Justificación de Diseño

Los casos de prueba han sido diseñados para cubrir los escenarios más importantes de los endpoints de autenticación:

1. **Casos exitosos**: Verifican que las operaciones normales funcionen correctamente cuando se proporcionan datos válidos.
2. **Casos de error**: Verifican que el sistema maneje adecuadamente situaciones de error comunes, como datos duplicados o credenciales inválidas.

Se han utilizado clases de equivalencia para agrupar los tipos de entradas (válidas e inválidas) y se han seleccionado casos representativos de cada clase. No se han incluido valores frontera específicos ya que los casos de prueba se centran en la funcionalidad general de los endpoints más que en los límites de los valores de entrada.
