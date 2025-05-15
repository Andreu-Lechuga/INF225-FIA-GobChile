import { renderHook, act } from '@testing-library/react-hooks';
import { useApi } from '../../../api/hooks/useApi';

// Mock de una función de API
const mockApiFunction = jest.fn();

describe('useApi hook', () => {
  beforeEach(() => {
    // Reiniciar el mock antes de cada prueba
    mockApiFunction.mockReset();
  });

  test('debería iniciar con valores por defecto', () => {
    const { result } = renderHook(() => useApi(mockApiFunction));
    
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.execute).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  test('debería manejar una respuesta exitosa', async () => {
    // Configurar el mock para devolver datos exitosos
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useApi(mockApiFunction));

    // Ejecutar la función
    act(() => {
      result.current.execute();
    });

    // Verificar estado de carga
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    // Esperar a que se complete la operación
    await waitForNextUpdate();

    // Verificar resultado exitoso
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  test('debería manejar un error', async () => {
    // Configurar el mock para lanzar un error
    const mockError = new Error('API Error');
    mockApiFunction.mockRejectedValueOnce(mockError);

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useApi(mockApiFunction));

    // Ejecutar la función
    act(() => {
      result.current.execute();
    });

    // Verificar estado de carga
    expect(result.current.loading).toBe(true);

    // Esperar a que se complete la operación
    await waitForNextUpdate();

    // Verificar manejo de error
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('API Error');
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
  });

  test('debería pasar parámetros a la función de API', async () => {
    // Configurar el mock para devolver datos exitosos
    const mockData = { result: 'success' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useApi(mockApiFunction));

    // Parámetros para pasar a la función
    const param1 = 'test';
    const param2 = { id: 123 };

    // Ejecutar la función con parámetros
    act(() => {
      result.current.execute(param1, param2);
    });

    // Esperar a que se complete la operación
    await waitForNextUpdate();

    // Verificar que los parámetros se pasaron correctamente
    expect(mockApiFunction).toHaveBeenCalledWith(param1, param2);
    expect(result.current.data).toEqual(mockData);
  });

  test('debería ejecutarse automáticamente al montar si executeOnMount es true', async () => {
    // Configurar el mock para devolver datos exitosos
    const mockData = { id: 1, name: 'Auto Execute' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    // Renderizar el hook con executeOnMount en true
    const { result, waitForNextUpdate } = renderHook(() => 
      useApi(mockApiFunction, [], true, ['param1', 'param2'])
    );

    // Verificar estado de carga inicial
    expect(result.current.loading).toBe(true);

    // Esperar a que se complete la operación
    await waitForNextUpdate();

    // Verificar que se ejecutó automáticamente
    expect(mockApiFunction).toHaveBeenCalledTimes(1);
    expect(mockApiFunction).toHaveBeenCalledWith('param1', 'param2');
    expect(result.current.data).toEqual(mockData);
  });

  test('debería reiniciar el estado con la función reset', async () => {
    // Configurar el mock para devolver datos exitosos
    const mockData = { id: 1, name: 'Test' };
    mockApiFunction.mockResolvedValueOnce(mockData);

    // Renderizar el hook
    const { result, waitForNextUpdate } = renderHook(() => useApi(mockApiFunction));

    // Ejecutar la función
    act(() => {
      result.current.execute();
    });

    // Esperar a que se complete la operación
    await waitForNextUpdate();

    // Verificar que tenemos datos
    expect(result.current.data).toEqual(mockData);

    // Reiniciar el estado
    act(() => {
      result.current.reset();
    });

    // Verificar que el estado se ha reiniciado
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
