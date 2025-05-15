import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ResourceListPage from '../../../pages/ResourceList'; // Ajusta la ruta según tu estructura
import { API_CONFIG } from '../../../api/config/apiConfig';

// Crear un adaptador mock para axios
const mockAxios = new MockAdapter(axios);
const BASE_URL = API_CONFIG.API_SERVICE_1.BASE_URL;
const RESOURCE_ENDPOINT = API_CONFIG.API_SERVICE_1.ENDPOINTS.RESOURCE1;

// Datos de prueba
const mockResources = [
  { id: 1, name: 'Recurso 1', description: 'Descripción del recurso 1' },
  { id: 2, name: 'Recurso 2', description: 'Descripción del recurso 2' },
  { id: 3, name: 'Recurso 3', description: 'Descripción del recurso 3' }
];

describe('Flujo completo de recursos (E2E)', () => {
  beforeEach(() => {
    // Configurar respuestas mock para las APIs
    mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(200, mockResources);
    
    // Mock para obtener un recurso específico
    mockAxios.onGet(new RegExp(`${BASE_URL}${RESOURCE_ENDPOINT}/\\d+`)).reply(config => {
      const id = parseInt(config.url.split('/').pop());
      const resource = mockResources.find(r => r.id === id);
      return resource ? [200, resource] : [404, { message: 'Recurso no encontrado' }];
    });
    
    // Mock para crear un nuevo recurso
    mockAxios.onPost(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(config => {
      const newResource = JSON.parse(config.data);
      return [201, { id: 999, ...newResource }];
    });
    
    // Mock para actualizar un recurso
    mockAxios.onPut(new RegExp(`${BASE_URL}${RESOURCE_ENDPOINT}/\\d+`)).reply(config => {
      const id = parseInt(config.url.split('/').pop());
      const updateData = JSON.parse(config.data);
      return [200, { id, ...updateData }];
    });
    
    // Mock para eliminar un recurso
    mockAxios.onDelete(new RegExp(`${BASE_URL}${RESOURCE_ENDPOINT}/\\d+`)).reply(200, {
      success: true,
      message: 'Recurso eliminado correctamente'
    });
  });
  
  afterEach(() => {
    mockAxios.reset();
  });
  
  test('debería mostrar la lista de recursos y permitir ver detalles', async () => {
    // Renderizar el componente
    render(<ResourceListPage />);
    
    // Esperar a que se carguen los recursos
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
    
    // Verificar que se muestran los recursos
    for (const resource of mockResources) {
      expect(screen.getByText(resource.name)).toBeInTheDocument();
    }
    
    // Hacer clic en el primer recurso para ver detalles
    userEvent.click(screen.getByText('Recurso 1'));
    
    // Esperar a que se carguen los detalles
    await waitFor(() => {
      expect(screen.getByText('Detalles del recurso')).toBeInTheDocument();
      expect(screen.getByText('Descripción del recurso 1')).toBeInTheDocument();
    });
    
    // Volver a la lista
    userEvent.click(screen.getByText('Volver'));
    
    // Verificar que estamos de vuelta en la lista
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
  });
  
  test('debería permitir crear un nuevo recurso', async () => {
    // Renderizar el componente
    render(<ResourceListPage />);
    
    // Esperar a que se cargue la página
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
    
    // Hacer clic en el botón para crear un nuevo recurso
    userEvent.click(screen.getByText('Crear nuevo recurso'));
    
    // Esperar a que se muestre el formulario
    await waitFor(() => {
      expect(screen.getByText('Crear nuevo recurso')).toBeInTheDocument();
    });
    
    // Rellenar el formulario
    userEvent.type(screen.getByLabelText('Nombre'), 'Nuevo Recurso de Prueba');
    userEvent.type(screen.getByLabelText('Descripción'), 'Esta es una descripción de prueba');
    
    // Enviar el formulario
    userEvent.click(screen.getByText('Guardar'));
    
    // Esperar a que se procese y volvamos a la lista
    await waitFor(() => {
      expect(screen.getByText('Recurso creado correctamente')).toBeInTheDocument();
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
  });
  
  test('debería permitir editar un recurso existente', async () => {
    // Renderizar el componente
    render(<ResourceListPage />);
    
    // Esperar a que se cargue la página
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
    
    // Hacer clic en el botón de editar del primer recurso
    const editButtons = screen.getAllByText('Editar');
    userEvent.click(editButtons[0]);
    
    // Esperar a que se muestre el formulario de edición
    await waitFor(() => {
      expect(screen.getByText('Editar recurso')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Recurso 1')).toBeInTheDocument();
    });
    
    // Modificar el formulario
    const nameInput = screen.getByLabelText('Nombre');
    fireEvent.change(nameInput, { target: { value: 'Recurso 1 Modificado' } });
    
    // Guardar los cambios
    userEvent.click(screen.getByText('Guardar cambios'));
    
    // Esperar a que se procese y volvamos a la lista
    await waitFor(() => {
      expect(screen.getByText('Recurso actualizado correctamente')).toBeInTheDocument();
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
  });
  
  test('debería permitir eliminar un recurso', async () => {
    // Renderizar el componente
    render(<ResourceListPage />);
    
    // Esperar a que se cargue la página
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
    });
    
    // Hacer clic en el botón de eliminar del primer recurso
    const deleteButtons = screen.getAllByText('Eliminar');
    userEvent.click(deleteButtons[0]);
    
    // Confirmar la eliminación en el diálogo de confirmación
    await waitFor(() => {
      expect(screen.getByText('¿Estás seguro de que deseas eliminar este recurso?')).toBeInTheDocument();
    });
    
    userEvent.click(screen.getByText('Confirmar'));
    
    // Esperar a que se procese la eliminación
    await waitFor(() => {
      expect(screen.getByText('Recurso eliminado correctamente')).toBeInTheDocument();
    });
  });
  
  test('debería manejar errores de API correctamente', async () => {
    // Configurar un error para la carga de recursos
    mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(500, {
      message: 'Error interno del servidor'
    });
    
    // Renderizar el componente
    render(<ResourceListPage />);
    
    // Esperar a que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los recursos')).toBeInTheDocument();
    });
    
    // Verificar que se muestra un botón para reintentar
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
    
    // Configurar una respuesta exitosa para el reintento
    mockAxios.onGet(`${BASE_URL}${RESOURCE_ENDPOINT}`).reply(200, mockResources);
    
    // Hacer clic en reintentar
    userEvent.click(screen.getByText('Reintentar'));
    
    // Verificar que ahora se cargan los recursos correctamente
    await waitFor(() => {
      expect(screen.getByText('Recursos disponibles')).toBeInTheDocument();
      expect(screen.getByText('Recurso 1')).toBeInTheDocument();
    });
  });
});
