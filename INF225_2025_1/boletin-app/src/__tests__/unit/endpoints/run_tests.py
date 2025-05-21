import unittest
import sys
import os
from datetime import datetime

# Importar las clases de prueba
from test_register_endpoint import TestRegisterEndpoint
from test_login_endpoint import TestLoginEndpoint

def run_tests():
    """
    Ejecuta todas las pruebas unitarias para los endpoints de autenticación
    y genera un informe de resultados.
    """
    # Crear un directorio para capturas de pantalla si no existe
    screenshots_dir = os.path.join(os.path.dirname(__file__), 'screenshots')
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
    
    # Obtener la fecha y hora actual para el nombre del archivo
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    log_file = os.path.join(screenshots_dir, f'test_results_{timestamp}.txt')
    
    # Configurar la redirección de la salida estándar
    original_stdout = sys.stdout
    with open(log_file, 'w', encoding='utf-8') as f:
        sys.stdout = f
        
        print("=" * 70)
        print("RESULTADOS DE PRUEBAS UNITARIAS - ENDPOINTS DE AUTENTICACIÓN")
        print("=" * 70)
        print(f"Fecha y hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 70)
        
        # Crear un cargador de pruebas
        loader = unittest.TestLoader()
        
        # Crear una suite con todas las pruebas
        suite = unittest.TestSuite()
        
        # Agregar las pruebas a la suite
        suite.addTest(loader.loadTestsFromTestCase(TestRegisterEndpoint))
        suite.addTest(loader.loadTestsFromTestCase(TestLoginEndpoint))
        
        # Ejecutar las pruebas
        runner = unittest.TextTestRunner(verbosity=2)
        result = runner.run(suite)
        
        # Mostrar resumen
        print("\n" + "=" * 70)
        print("RESUMEN DE RESULTADOS")
        print("-" * 70)
        print(f"Total de pruebas ejecutadas: {result.testsRun}")
        print(f"Pruebas exitosas: {result.testsRun - len(result.failures) - len(result.errors)}")
        print(f"Pruebas fallidas: {len(result.failures)}")
        print(f"Pruebas con errores: {len(result.errors)}")
        
        if result.failures:
            print("\nDETALLE DE FALLOS:")
            for i, (test, error) in enumerate(result.failures, 1):
                print(f"\n{i}. {test}")
                print("-" * 50)
                print(error)
        
        if result.errors:
            print("\nDETALLE DE ERRORES:")
            for i, (test, error) in enumerate(result.errors, 1):
                print(f"\n{i}. {test}")
                print("-" * 50)
                print(error)
        
        print("\n" + "=" * 70)
        print(f"Archivo de resultados guardado en: {log_file}")
        print("=" * 70)
    
    # Restaurar la salida estándar
    sys.stdout = original_stdout
    
    print(f"Pruebas completadas. Resultados guardados en: {log_file}")
    
    # Devolver True si todas las pruebas pasaron, False en caso contrario
    return result.wasSuccessful()

if __name__ == "__main__":
    success = run_tests()
    # Salir con código 0 si todas las pruebas pasaron, 1 en caso contrario
    sys.exit(0 if success else 1)
