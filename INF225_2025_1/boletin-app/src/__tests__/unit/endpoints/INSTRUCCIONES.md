# Instrucciones para Ejecutar las Pruebas Unitarias

Este documento proporciona instrucciones detalladas para ejecutar las pruebas unitarias de los endpoints de autenticación de la aplicación Boletín de Agricultura.

## Requisitos Previos

Antes de ejecutar las pruebas, asegúrese de tener instalado:

1. Python 3.6 o superior
2. La biblioteca `requests` de Python (puede instalarla con `pip install requests`)
3. El servidor de la aplicación en ejecución en `localhost:5000`

## Pasos para Ejecutar las Pruebas

### 1. Iniciar el Servidor

Asegúrese de que el servidor de la aplicación esté en ejecución:

```bash
# Desde la carpeta raíz del proyecto
cd INF225_2025_1/boletin-app
npm run server
```

### 2. Ejecutar Todas las Pruebas

Puede ejecutar todas las pruebas utilizando el script `run_tests.py`:

```bash
# Desde la carpeta raíz del proyecto
cd INF225_2025_1/boletin-app
python src/__tests__/unit/endpoints/run_tests.py
```

Este script ejecutará todas las pruebas y generará un archivo de resultados en la carpeta `screenshots` con un nombre que incluye la fecha y hora de ejecución.

### 3. Ejecutar Pruebas Específicas

Si desea ejecutar pruebas específicas, puede utilizar los siguientes comandos:

```bash
# Ejecutar solo las pruebas de registro
python -m unittest src/__tests__/unit/endpoints/test_register_endpoint.py

# Ejecutar solo las pruebas de inicio de sesión
python -m unittest src/__tests__/unit/endpoints/test_login_endpoint.py

# Ejecutar un método de prueba específico
python -m unittest src/__tests__/unit/endpoints/test_register_endpoint.py:TestRegisterEndpoint.test_successful_registration
```

## Interpretación de los Resultados

Después de ejecutar las pruebas, verá un resumen de los resultados en la consola. Además, si utilizó el script `run_tests.py`, se generará un archivo de resultados detallado en la carpeta `screenshots`.

- **OK**: Todas las pruebas pasaron correctamente.
- **FAIL**: Una o más pruebas fallaron debido a aserciones que no se cumplieron.
- **ERROR**: Una o más pruebas generaron errores durante su ejecución.

## Solución de Problemas

Si encuentra problemas al ejecutar las pruebas, verifique lo siguiente:

1. **El servidor no está en ejecución**: Asegúrese de que el servidor esté en ejecución en `localhost:5000`.
2. **Error de conexión**: Verifique que la URL base en los archivos de prueba (`self.base_url`) coincida con la URL donde se está ejecutando el servidor.
3. **Errores de dependencias**: Asegúrese de tener instalada la biblioteca `requests` de Python.
4. **Errores en las pruebas**: Revise los mensajes de error para identificar el problema específico.

## Notas Adicionales

- Las pruebas utilizan datos aleatorios para evitar conflictos con usuarios existentes.
- En un entorno de producción, sería recomendable usar una base de datos de prueba separada.
- Si desea modificar las pruebas, consulte la documentación en el archivo `README.md` y los casos de prueba detallados en `casos_de_prueba.md`.
