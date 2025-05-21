# Casos de Prueba para Endpoints de Autenticación

Este documento detalla los casos de prueba diseñados para los endpoints de autenticación de la aplicación Boletín de Agricultura, siguiendo los requisitos actualizados.

## Endpoint 1: Registro de Usuarios (`/api/auth/register`)

### Caso de Prueba 1: Registro Exitoso y Fallido (Nombre de Usuario Válido e Inválido)

#### Parte 1: Registro Exitoso con Datos Válidos

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

#### Parte 2: Registro Fallido con Nombre de Usuario Inválido

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | REG-002 |
| **Nombre** | Registro fallido con nombre de usuario inválido |
| **Descripción** | Verificar que el sistema rechace el registro de un usuario con un nombre de usuario que contiene caracteres especiales no permitidos |
| **Precondiciones** | El servidor está en ejecución y la base de datos está accesible |
| **Inputs** | - `username`: Nombre de usuario con caracteres especiales (ej. "invalid@user_123")<br>- `email`: Correo electrónico único (generado aleatoriamente)<br>- `password`: "Password123!"<br>- `role`: "usuario-publico" |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/register` con el nombre de usuario inválido<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 400 (Bad Request)<br>- Respuesta JSON con:<br>  * `success`: false<br>  * `message`: Mensaje indicando que el nombre de usuario es inválido |
| **Contexto de Ejecución** | Intentar registrar un usuario con un nombre de usuario que contiene caracteres no permitidos |
| **Clases de Equivalencia** | - Nombre de usuario inválido: Contiene caracteres especiales no permitidos |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_invalid_username_registration` en la clase `TestRegisterEndpoint` |

### Caso de Prueba 2: Contraseña de 6 Caracteres vs Contraseña de 5 Caracteres (Caso Frontera)

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | REG-003 |
| **Nombre** | Caso frontera para longitud de contraseña |
| **Descripción** | Verificar que el sistema acepte contraseñas de 6 caracteres (válidas) y rechace contraseñas de 5 caracteres (inválidas) |
| **Precondiciones** | El servidor está en ejecución y la base de datos está accesible |
| **Inputs** | - Caso válido: Contraseña de 6 caracteres ("123456")<br>- Caso inválido: Contraseña de 5 caracteres ("12345") |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/register` con contraseña de 6 caracteres<br>2. Verificar que el registro sea exitoso<br>3. Enviar otra solicitud POST a `/api/auth/register` con contraseña de 5 caracteres<br>4. Verificar que el registro sea rechazado |
| **Resultado Esperado** | - Para contraseña de 6 caracteres:<br>  * Código de estado HTTP: 201 (Created)<br>  * `success`: true<br>- Para contraseña de 5 caracteres:<br>  * Código de estado HTTP: 400 (Bad Request)<br>  * `success`: false<br>  * Mensaje indicando el requisito de longitud mínima |
| **Contexto de Ejecución** | Probar el límite exacto de la validación de longitud de contraseña |
| **Clases de Equivalencia** | - Contraseña válida: Longitud >= 6 caracteres<br>- Contraseña inválida: Longitud < 6 caracteres |
| **Valores Frontera** | - 6 caracteres: Valor mínimo aceptable<br>- 5 caracteres: Valor justo por debajo del mínimo aceptable |
| **Implementación** | Método `test_password_length_boundary` en la clase `TestRegisterEndpoint` |

## Endpoint 2: Inicio de Sesión (`/api/auth/login`)

### Caso de Prueba 1: Credenciales Válidas vs Credenciales Inválidas (Usuario Válido y Usuario Inválido)

#### Parte 1: Inicio de Sesión Exitoso con Credenciales Válidas

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

#### Parte 2: Inicio de Sesión Fallido con Usuario Inválido

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | LOG-002 |
| **Nombre** | Inicio de sesión fallido con usuario inválido |
| **Descripción** | Verificar que el sistema rechace el inicio de sesión cuando se proporciona un nombre de usuario que no existe en la base de datos |
| **Precondiciones** | - El servidor está en ejecución y la base de datos está accesible |
| **Inputs** | - `username`: Nombre de usuario que no existe en la base de datos<br>- `password`: Cualquier contraseña |
| **Pasos** | 1. Enviar una solicitud POST a `/api/auth/login` con un usuario inexistente<br>2. Recibir y analizar la respuesta |
| **Resultado Esperado** | - Código de estado HTTP: 401 (Unauthorized)<br>- Respuesta JSON con:<br>  * `success`: false<br>  * `message`: "Credenciales inválidas." |
| **Contexto de Ejecución** | Intentar iniciar sesión con un nombre de usuario que no existe en la base de datos |
| **Clases de Equivalencia** | - Usuario inválido: Nombre de usuario que no existe en la base de datos |
| **Valores Frontera** | No aplicables para este caso de prueba |
| **Implementación** | Método `test_invalid_user_login` en la clase `TestLoginEndpoint` |

### Caso de Prueba 2: Inputs Vacíos o con Espacios

| Aspecto | Descripción |
|---------|-------------|
| **Identificador** | LOG-003 |
| **Nombre** | Inicio de sesión fallido con inputs vacíos o con espacios |
| **Descripción** | Verificar que el sistema rechace el inicio de sesión cuando se proporcionan inputs vacíos o que solo contienen espacios |
| **Precondiciones** | - El servidor está en ejecución y la base de datos está accesible<br>- Existe un usuario registrado para las pruebas |
| **Inputs** | - Caso 1: Nombre de usuario vacío<br>- Caso 2: Contraseña vacía<br>- Caso 3: Nombre de usuario con solo espacios<br>- Caso 4: Contraseña con solo espacios |
| **Pasos** | 1. Enviar solicitudes POST a `/api/auth/login` con cada uno de los casos de inputs inválidos<br>2. Recibir y analizar las respuestas |
| **Resultado Esperado** | Para todos los casos:<br>- Código de estado HTTP: 400 (Bad Request)<br>- Respuesta JSON con:<br>  * `success`: false<br>  * Mensaje indicando el problema específico con el input |
| **Contexto de Ejecución** | Intentar iniciar sesión con inputs vacíos o que solo contienen espacios |
| **Clases de Equivalencia** | - Inputs vacíos: Cadena de longitud 0<br>- Inputs con espacios: Cadena que solo contiene caracteres de espacio |
| **Valores Frontera** | - Cadena vacía: ""<br>- Cadena con solo espacios: "   " |
| **Implementación** | Método `test_empty_or_whitespace_inputs` en la clase `TestLoginEndpoint` |

## Justificación de Diseño

Los casos de prueba han sido actualizados para cubrir escenarios más específicos y casos frontera:

1. **Casos de validación de nombre de usuario**: Verifican que el sistema valide correctamente los nombres de usuario, rechazando aquellos con caracteres especiales no permitidos.
2. **Casos frontera de longitud de contraseña**: Verifican específicamente el límite de 6 caracteres para las contraseñas, probando tanto el valor mínimo aceptable (6) como el valor justo por debajo (5).
3. **Casos de usuario inválido**: Verifican que el sistema rechace intentos de inicio de sesión con nombres de usuario que no existen en la base de datos.
4. **Casos de inputs vacíos o con espacios**: Verifican que el sistema valide adecuadamente los inputs, rechazando aquellos que están vacíos o solo contienen espacios.

Estos casos de prueba proporcionan una cobertura más completa de los escenarios de uso y validación de los endpoints de autenticación, incluyendo tanto casos exitosos como casos de error específicos.
