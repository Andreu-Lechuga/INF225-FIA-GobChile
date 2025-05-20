import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import axios from 'axios';

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
  "Compostaje & Abonado Organico": ["Composting methods", "Organic fertilization", "Biofertilizers"],
  "Rotacion de Cultivos": ["Crop rotation systems", "Succession planting", "Field rotation"],
  "Fertilizacion Quimica / Mineral": ["Chemical fertilizers", "Mineral nutrients", "NPK fertilization"],
  "Control de Maleza": ["Weed management", "Herbicide application", "Weed control strategies"],
  "Poda": ["Pruning techniques", "Tree trimming", "Canopy management"],
  
  // Tipos de Cultivos
  "Policultivos": ["Polyculture systems", "Mixed cropping", "Companion planting"],
  "Monocultivos": ["Monoculture farming", "Single-crop cultivation", "Industrial agriculture"],
  "Cultivos anuales": ["Annual crops", "Seasonal farming", "Yearly harvest"],
  "Cultivo Estacionales": ["Winter crops", "Summer crops", "Seasonal planting", "Spring cultivation"],
  "Cultivos perennes": ["Perennial agriculture", "Long-term crops", "Multi-year plants"],
  "Cultivos de Cobertura": ["Cover crops", "Green manure", "Soil protection plants"],
  "Cultivos Hidroponicos": ["Hydroponic systems", "Soilless cultivation", "Water-based farming"],
  "Cultivos de Invernadero": ["Greenhouse production", "Protected cultivation", "Controlled environment agriculture"],
  
  // Manejo de Agua
  "Riego por Gravedad": ["Gravity irrigation", "Surface irrigation", "Flood irrigation"],
  "Riego por Aspersion": ["Sprinkler systems", "Overhead irrigation", "Spray irrigation"],
  "Riego por Goteo": ["Drip irrigation", "Micro-irrigation", "Trickle systems"],
  "Riego Subterraneo": ["Subsurface irrigation", "Underground watering", "Root zone irrigation"],
  "Drenaje": ["Agricultural drainage", "Water removal systems", "Field drainage"],
  "Captacion de Agua de Lluvia": ["Rainwater harvesting", "Water catchment", "Precipitation collection"],
  
  // Clima
  "Precipitacion": ["Rainfall patterns", "Precipitation data", "Rain distribution"],
  "Sequia": ["Drought conditions", "Water scarcity", "Dry farming"],
  "Humedad": ["Humidity levels", "Moisture management", "Air moisture"],
  "Radiacion Solar": ["Solar radiation", "Sunlight exposure", "Light intensity"],
  "Viento": ["Wind patterns", "Air movement", "Wind protection"],
  "Heladas": ["Frost protection", "Freezing temperatures", "Cold damage prevention"],
  "Microclimas": ["Microclimate management", "Local climate conditions", "Environmental niches"]
};

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
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(52, 73, 94, 0.2);
  }
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
  tiposFuentes: Yup.array()
    .min(1, 'Debe seleccionar al menos un tipo de fuente'),
  span: Yup.string()
    .required('Debe seleccionar un periodo de búsqueda'),
  comentarios: Yup.string()
    .max(200, 'Los comentarios no deben exceder los 200 caracteres')
});

const BoletinForm = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  
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
    
    // Procesar periodo de búsqueda
    let from, to;
    to = new Date().toISOString().split('T')[0];
    
    switch(values.span) {
      case '3_meses':
        from = getDateXMonthsAgo(3);
        break;
      case '6_meses':
        from = getDateXMonthsAgo(6);
        break;
      case '1_año':
        from = getDateXMonthsAgo(12);
        break;
      case '3_años':
        from = getDateXMonthsAgo(36);
        break;
      case '5_años':
        from = getDateXMonthsAgo(60);
        break;
      default:
        from = getDateXMonthsAgo(3); // Por defecto, 3 meses
    }
    
    // Convertir los conceptos seleccionados a Custom Tags para la búsqueda API
    const customTagsForSearch = selectedTags.flatMap(concept => conceptToCustomTags[concept] || []);
    
    // Construir consulta basada en los Custom Tags
    const query = customTagsForSearch.join(' OR ');
    
    // Configurar parámetros de búsqueda
    let searchParams = {
      from,
      to,
      search_in: 'title,summary,content',
      tiposFuentes: values.tiposFuentes
    };
    
    // Preparar datos para enviar al backend
    const formData = {
      titulo: values.titulo,
      temas: selectedTags,
      plazo: values.span,
      comentarios: values.comentarios || 'Sin comentarios adicionales',
      estado: 'Registrado'
    };
    
    try {
      // Enviar datos al backend
      const response = await axios.post('/api/boletines', formData);
      
      // Realizar búsqueda con NewsCatcher API
      // import { newsCatcherService } from '../../api/services/newsCatcherService';
      // 
      // newsCatcherService.searchBySourceTypes(query, values.tiposFuentes, { from, to })
      //   .then(results => {
      //     console.log('Resultados de la búsqueda:', results);
      //     // Procesar resultados y actualizar boletín
      //   });
      
      console.log('Boletín creado:', response.data);
      alert('Boletín registrado correctamente');
      navigate('/estado-boletines');
    } catch (error) {
      console.error('Error al crear el boletín:', error);
      alert('Error al registrar el boletín. Por favor, intente nuevamente.');
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
            tiposFuentes: [],
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
              
              <Field name="tiposFuentes">
                {({ field, form }) => (
                  <MultiSelect
                    label="Tipos de Fuentes"
                    options={[
                      "Académicas",
                      "Científicas",
                      "Gubernamentales",
                      "Noticias",
                      "Todas las anteriores"
                    ]}
                    value={field.value}
                    onChange={value => form.setFieldValue('tiposFuentes', value)}
                    error={form.errors.tiposFuentes && form.touched.tiposFuentes ? form.errors.tiposFuentes : null}
                  />
                )}
              </Field>
              
              <FormGroup>
                <Label>Temas de Interés</Label>
                <CustomTagsSelector 
                  selectedTags={selectedTags} 
                  onChange={setSelectedTags} 
                />
                {validateTags() && (
                  <ErrorText>{validateTags()}</ErrorText>
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
                {isSubmitting ? 'Enviando...' : 'Generar Boletín'}
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
