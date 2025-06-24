import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
// import axios from 'axios'; // Comentado - ya no se usa para API externa
import { SeleccionFuentes, SeleccionTemas } from '../../components/ui';
// import { newsCatcherService } from '../../api/services/newsCatcherService'; // Comentado - API externa deshabilitada
import { supabaseUtils } from '../../api/supabase';

// Datos de Custom Tags organizados por categorías
const customTagsData = [
  {
    category: "Practicas Agricolas",
    tags: [
      "Labranza",
      "Siembra Directa",
      "Compostaje & Abonado Organico",
      "Rotacion de Cultivos",
      "Fertilizacion Quimica / Mineral",
      "Control de Maleza",
      "Poda"
    ]
  },
  {
    category: "Tipos de Cultivos",
    tags: [
      "Policultivos",
      "Monocultivos",
      "Cultivos anuales",
      "Cultivo Estacionales",
      "Cultivos perennes",
      "Cultivos de Cobertura",
      "Cultivos Hidroponicos",
      "Cultivos de Invernadero"
    ]
  },
  {
    category: "Manejo de Agua",
    tags: [
      "Riego por Gravedad",
      "Riego por Aspersion",
      "Riego por Goteo",
      "Riego Subterraneo",
      "Drenaje",
      "Captacion de Agua de Lluvia"
    ]
  },
  {
    category: "Clima",
    tags: [
      "Precipitacion",
      "Sequia",
      "Humedad",
      "Radiacion Solar",
      "Viento",
      "Heladas",
      "Microclimas"
    ]
  }
];

// Mapeo de conceptos a Custom Tags para búsqueda API
const conceptToCustomTags = {
  // Prácticas Agrícolas
  "Labranza": ["Tillage techniques", "Soil preparation", "Land cultivation"],
  "Siembra Directa": ["No-till farming", "Direct seeding", "Zero tillage"],
  "Compostaje & Abonado Orgánico": ["Composting methods", "Organic fertilization", "Biofertilizers"],
  "Rotación de Cultivos": ["Crop rotation systems", "Succession planting", "Field rotation"],
  "Fertilización Química / Mineral": ["Chemical fertilizers", "Mineral nutrients", "NPK fertilization"],
  "Control de Maleza": ["Weed management", "Herbicide application", "Weed control strategies"],
  "Poda": ["Pruning techniques", "Tree trimming", "Canopy management"],
  
  // Manejo de Agua
  "Riego por Gravedad": ["Gravity irrigation", "Surface irrigation", "Flood irrigation"],
  "Riego por Aspersión": ["Sprinkler systems", "Overhead irrigation", "Spray irrigation"],
  "Riego por Goteo": ["Drip irrigation", "Micro-irrigation", "Trickle systems"],
  "Riego Subterráneo": ["Subsurface irrigation", "Underground watering", "Root zone irrigation"],
  "Drenaje": ["Agricultural drainage", "Water removal systems", "Field drainage"],
  "Captación de Agua de Lluvia": ["Rainwater harvesting", "Water catchment", "Precipitation collection"],
  
  // Tipos de Cultivos
  "Policultivos": ["Polyculture systems", "Mixed cropping", "Companion planting"],
  "Monocultivos": ["Monoculture farming", "Single-crop cultivation", "Industrial agriculture"],
  "Cultivos anuales": ["Annual crops", "Seasonal farming", "Yearly harvest"],
  "Cultivos Estacionales": ["Winter crops", "Summer crops", "Seasonal planting", "Spring cultivation"],
  "Cultivos perennes": ["Perennial agriculture", "Long-term crops", "Multi-year plants"],
  "Cultivos de Cobertura": ["Cover crops", "Green manure", "Soil protection plants"],
  "Cultivos Hidropónicos": ["Hydroponic systems", "Soilless cultivation", "Water-based farming"],
  "Cultivos de Invernadero": ["Greenhouse production", "Protected cultivation", "Controlled environment agriculture"],
  
  // Clima
  "Precipitación": ["Rainfall patterns", "Precipitation data", "Rain distribution"],
  "Sequía": ["Drought conditions", "Water scarcity", "Dry farming"],
  "Humedad": ["Humidity levels", "Moisture management", "Air moisture"],
  "Radiación Solar": ["Solar radiation", "Sunlight exposure", "Light intensity"],
  "Viento": ["Wind patterns", "Air movement", "Wind protection"],
  "Heladas": ["Frost protection", "Freezing temperatures", "Cold damage prevention"],
  "Microclimas": ["Microclimate management", "Local climate conditions", "Environmental niches"]
};

// Datos para el componente SeleccionFuentes
const fuentesParaSeleccion = [
  {
    id: "1",
    nombre: "Académicas",
    urls: [
      "https://scholar.google.com",
      "https://jstor.org",
      "https://pubmed.ncbi.nlm.nih.gov",
      "https://scielo.org",
      "https://researchgate.net"
    ]
  },
  {
    id: "2", 
    nombre: "Científicas",
    urls: [
      "https://nature.com",
      "https://science.org",
      "https://cell.com",
      "https://plos.org",
      "https://springer.com"
    ]
  },
  {
    id: "3",
    nombre: "Gubernamentales", 
    urls: [
      "https://gob.cl",
      "https://minagri.gob.cl",
      "https://fia.cl",
      "https://odepa.gob.cl",
      "https://sag.gob.cl"
    ]
  },
  {
    id: "4",
    nombre: "Noticias",
    urls: [
      "https://emol.com",
      "https://latercera.com",
      "https://cooperativa.cl",
      "https://biobiochile.cl",
      "https://elmostrador.cl"
    ]
  }
];

// Estilos para la página del formulario
const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
`;

const Container = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 1.4em;
  text-align: center;
  margin-bottom: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const InlineFormGroup = styled(FormGroup)`
  display: flex;
  align-items: center;
  gap: 15px;
  
  label {
    min-width: 180px;
    margin: 0;
  }
  
  select {
    flex: 1;
  }
`;

const Label = styled.label`
  display: block;
  margin: 15px 0 8px;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 1em;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const TextArea = styled(Field)`
  width: 100%;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 1em;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const Select = styled(Field)`
  width: 100%;
  padding: 12px;
  margin-bottom: 5px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 1em;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(145deg, #34495e, #2c3e50);
  color: white;
  font-weight: 600;
  cursor: pointer;
  padding: 15px;
  margin-top: 20px;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 73, 94, 0.2);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(52, 73, 94, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ApiStatusContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #f8f9fa;
`;

const ApiStatusTitle = styled.h4`
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1em;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ApiErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 10px;
  padding: 10px;
  background: #fdf2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`;

const ApiSuccessMessage = styled.div`
  color: #16a085;
  font-size: 0.9em;
  margin-top: 10px;
  padding: 10px;
  background: #f0fdfa;
  border: 1px solid #a7f3d0;
  border-radius: 6px;
`;

const NavFooter = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ReturnButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.9em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Componentes estilizados para la interfaz de Custom Tags
const CheckboxContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 20px;
  width: 100%;
`;

// Componentes para MultiSelect (necesarios para Tipos de Fuentes)
const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 45px;
  margin-bottom: 5px;
`;

const Tag = styled.div`
  background-color: rgba(52, 152, 219, 0.2);
  border-radius: 16px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1em;
`;

const TagClose = styled.span`
  cursor: pointer;
  color: #2c3e50;
  font-weight: bold;
`;

const CategoryColumn = styled.div`
  width: 100%;
`;

const CategoryTitle = styled.h4`
  margin-top: 15px;
  margin-bottom: 12px;
  color: #2c3e50;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #eaeaea;
`;

const CheckboxGroup = styled.div`
  margin-bottom: 25px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const CheckboxLabel = styled.label`
  display: grid;
  grid-template-columns: 24px 1fr;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 0.95em;
  padding: 5px 0;
  
  &:hover {
    color: #3498db;
    background-color: #f0f7fc;
    border-radius: 4px;
    padding-left: 5px;
  }
`;

const Checkbox = styled.input`
  cursor: pointer;
  width: 16px;
  height: 16px;
  margin: 0;
  justify-self: center;
`;

// Componente para mostrar Custom Tags en dos columnas
const CustomTagsSelector = ({ selectedTags, onChange }) => {
  // Dividir las categorías en dos columnas
  const midpoint = Math.ceil(customTagsData.length / 2);
  const leftColumnCategories = customTagsData.slice(0, midpoint);
  const rightColumnCategories = customTagsData.slice(midpoint);
  
  const handleCheckboxChange = (tag) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };
  
  const renderCategoryColumn = (categories) => (
    <CategoryColumn>
      {categories.map((category, idx) => (
        <CheckboxGroup key={idx}>
          <CategoryTitle>{category.category}</CategoryTitle>
          {category.tags.map((tag, tagIdx) => (
            <CheckboxLabel key={tagIdx}>
              <Checkbox
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => handleCheckboxChange(tag)}
              />
              <span>{tag}</span>
            </CheckboxLabel>
          ))}
        </CheckboxGroup>
      ))}
    </CategoryColumn>
  );
  
  return (
    <CheckboxContainer>
      {renderCategoryColumn(leftColumnCategories)}
      {renderCategoryColumn(rightColumnCategories)}
    </CheckboxContainer>
  );
};

// Componente para selección múltiple
const MultiSelect = ({ label, options, value = [], onChange, error }) => {
  // Asegurarse de que value siempre sea un array
  const safeValue = Array.isArray(value) ? value : [];
  
  return (
    <div>
      <InlineFormGroup>
        <Label>{label}</Label>
        <TagsContainer>
          {safeValue.map((item, index) => (
            <Tag key={index}>
              {item}
              <TagClose onClick={() => onChange(safeValue.filter(val => val !== item))}>×</TagClose>
            </Tag>
          ))}
        </TagsContainer>
      </InlineFormGroup>
      <FormGroup>
        <Select 
          as="select" 
          onChange={(e) => {
            if (e.target.value && !safeValue.includes(e.target.value)) {
              onChange([...safeValue, e.target.value]);
              e.target.value = '';
            }
          }}
        >
          <option value="">Seleccione una opción</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </Select>
        {error && <ErrorText>{error}</ErrorText>}
      </FormGroup>
    </div>
  );
};

// Esquema de validación con Yup
const validationSchema = Yup.object({
  titulo: Yup.string()
    .required('El título es obligatorio')
    .max(50, 'El título no debe exceder los 50 caracteres'),
  span: Yup.string()
    .required('Debe seleccionar un periodo de búsqueda'),
  comentarios: Yup.string()
    .max(200, 'Los comentarios no deben exceder los 200 caracteres')
});

const BoletinForm = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  // Estado para el nuevo componente SeleccionFuentes (mantenido para futuro uso)
  const [fuentesSeleccionadas, setFuentesSeleccionadas] = useState([]);
  
  // Función para manejar el cambio de temas seleccionados
  const handleTemasChange = (temasSeleccionados) => {
    setSelectedTags(temasSeleccionados);
    console.log('Temas seleccionados:', temasSeleccionados);
  };
  
  // Función para validar que al menos un tag esté seleccionado
  const validateTags = () => {
    if (selectedTags.length === 0) {
      return "Debe seleccionar al menos un tema de interés";
    }
    return null;
  };
  
  const handleSubmit = async (values, { setSubmitting }) => {
    if (selectedTags.length === 0) {
      alert('Debe seleccionar al menos un tema de interés');
      setSubmitting(false);
      return;
    }
    
    try {
      console.log('=== INICIANDO CREACIÓN DE BOLETÍN ===');
      
      // Generar conceptos a partir de los temas seleccionados
      const conceptos = selectedTags.flatMap(tema => conceptToCustomTags[tema] || []);
      
      // Preparar datos para crear el boletín
      const boletinData = {
        titulo: values.titulo,
        temas: selectedTags,           // Array de temas seleccionados
        conceptos: conceptos,          // Array de conceptos generados automáticamente
        plazo: values.span,
        comentarios: values.comentarios || 'Sin comentarios adicionales',
        estado: 'En Revision'          // Nuevo estado por defecto
      };
      
      console.log('Datos del boletín a enviar:', boletinData);
      
      // Intentar crear boletín directamente en Supabase primero
      try {
        console.log('Intentando crear boletín directamente en Supabase...');
        const newBoletin = await supabaseUtils.createBoletin(boletinData);
        console.log('Boletín creado exitosamente en Supabase:', newBoletin);
        
        // Mostrar mensaje de éxito
        alert('Boletín creado correctamente y guardado en la base de datos');
        
        // Redirigir a la lista de boletines
        navigate('/boletines');
        
      } catch (supabaseError) {
        console.error('Error al crear boletín directamente en Supabase:', supabaseError);
        
        // Si falla Supabase directo, intentar a través del backend
        console.log('Intentando crear boletín a través del backend...');
        
        const response = await fetch('http://localhost:5000/api/boletines', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(boletinData)
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Error al crear el boletín');
        }
        
        console.log('Boletín creado exitosamente a través del backend:', result);
        
        // Mostrar mensaje de éxito
        alert('Boletín creado correctamente y guardado en la base de datos');
        
        // Redirigir a la lista de boletines
        navigate('/boletines');
      }
      
    } catch (error) {
      console.error('Error completo al crear el boletín:', error);
      alert(`Error al crear el boletín: ${error.message}. Por favor, revise la consola para más detalles.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Función auxiliar para calcular fechas relativas (misma que en newsCatcherService.js)
  const getDateXMonthsAgo = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  return (
    <FormContainer>
      <Container>
        <Title>Nuevo Boletín</Title>
        
        <Formik
          initialValues={{
            titulo: '',
            span: '3_meses',
            comentarios: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ingrese el título del boletín"
                />
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  (Este campo no se utiliza en la búsqueda API)
                </small>
                <ErrorMessage name="titulo" component={ErrorText} />
              </FormGroup>
              
              {/* Selección de Fuentes */}
              <FormGroup style={{ marginTop: '30px', marginBottom: '30px' }}>
                <SeleccionFuentes 
                  fuentesIniciales={fuentesParaSeleccion}
                  onSelectionChange={(seleccionadas) => {
                    setFuentesSeleccionadas(seleccionadas);
                    console.log('Fuentes seleccionadas:', seleccionadas);
                  }}
                />
                {fuentesSeleccionadas.length > 0 && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: '8px', 
                    fontSize: '0.9em' 
                  }}>
                    <strong>Seleccionadas:</strong> {fuentesSeleccionadas.join(', ')}
                  </div>
                )}
              </FormGroup>
              
              {/* Selección de Temas */}
              <FormGroup style={{ marginTop: '30px', marginBottom: '30px' }}>
                <SeleccionTemas 
                  onSelectionChange={handleTemasChange}
                />
                {validateTags() && (
                  <ErrorText>{validateTags()}</ErrorText>
                )}
                {selectedTags.length > 0 && (
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '10px', 
                    backgroundColor: '#e8f5e8', 
                    borderRadius: '8px', 
                    fontSize: '0.9em' 
                  }}>
                    <strong>Temas seleccionados:</strong> {selectedTags.join(', ')}
                  </div>
                )}
              </FormGroup>
              
              <InlineFormGroup>
                <Label htmlFor="span">Periodo de Búsqueda</Label>
                <Select as="select" id="span" name="span">
                  <option value="3_meses">3 meses</option>
                  <option value="6_meses">6 meses</option>
                  <option value="1_año">1 año</option>
                  <option value="3_años">3 años</option>
                  <option value="5_años">5 años</option>
                </Select>
                <ErrorMessage name="span" component={ErrorText} />
              </InlineFormGroup>
              
              <FormGroup>
                <Label htmlFor="comentarios">Comentarios Adicionales</Label>
                <TextArea
                  as="textarea"
                  id="comentarios"
                  name="comentarios"
                  placeholder="Este campo no se utiliza en la búsqueda API"
                  rows="4"
                />
                <ErrorMessage name="comentarios" component={ErrorText} />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando Boletín...' : 'Generar Boletín'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
      </Container>
      
      <NavFooter>
        <ReturnButton to="/">
          Volver al Menú Principal
        </ReturnButton>
      </NavFooter>
    </FormContainer>
  );
};

export default BoletinForm;
