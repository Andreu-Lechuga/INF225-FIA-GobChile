import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

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

// Componente para las etiquetas
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

const TagInput = styled.input`
  border: none;
  outline: none;
  flex-grow: 1;
  min-width: 100px;
  padding: 5px;
  
  &:focus {
    outline: none;
  }
`;

// Esquema de validación con Yup
const validationSchema = Yup.object({
  titulo: Yup.string()
    .required('El título es obligatorio')
    .max(50, 'El título no debe exceder los 50 caracteres'),
  span: Yup.string()
    .required('Debe seleccionar un periodo de búsqueda'),
  indicaciones: Yup.string()
    .required('Las indicaciones son obligatorias')
    .max(200, 'Las indicaciones no deben exceder los 200 caracteres')
});

const BoletinForm = () => {
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (values, { setSubmitting }) => {
    if (tags.length === 0) {
      alert('Debe ingresar al menos un tema de interés');
      setSubmitting(false);
      return;
    }
    
    // Aquí se enviarían los datos al backend
    const formData = {
      ...values,
      temas: tags
    };
    
    console.log('Datos del formulario:', formData);
    
    // Simulación de envío exitoso
    setTimeout(() => {
      alert('Boletín registrado correctamente');
      navigate('/estado-boletines');
      setSubmitting(false);
    }, 1000);
  };
  
  return (
    <FormContainer>
      <Container>
        <Title>Nuevo Boletín</Title>
        
        <Formik
          initialValues={{
            titulo: '',
            span: '',
            indicaciones: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  type="text"
                  id="titulo"
                  name="titulo"
                  placeholder="Ingrese el título del boletín"
                />
                <ErrorMessage name="titulo" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="temas">Temas de Interés</Label>
                <TagsContainer>
                  {tags.map((tag, index) => (
                    <Tag key={index}>
                      {tag}
                      <TagClose onClick={() => removeTag(tag)}>×</TagClose>
                    </Tag>
                  ))}
                  <TagInput
                    type="text"
                    value={tagInput}
                    onChange={handleTagInputChange}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Escriba un tema y presione Enter"
                  />
                </TagsContainer>
                {tags.length === 0 && (
                  <ErrorText>Debe ingresar al menos un tema de interés</ErrorText>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="span">Periodo de Búsqueda</Label>
                <Select as="select" id="span" name="span">
                  <option value="">Ingrese tiempo</option>
                  <option value="1_mes">1 mes</option>
                  <option value="3_meses">3 meses</option>
                  <option value="6_meses">6 meses</option>
                  <option value="1_año">1 año</option>
                  <option value="2_años">2 años</option>
                  <option value="3_años">3 años</option>
                  <option value="4_años">4 años</option>
                  <option value="5_años">5 años</option>
                  <option value="10_años">10 años</option>
                </Select>
                <ErrorMessage name="span" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="indicaciones">Indicaciones Extra</Label>
                <TextArea
                  as="textarea"
                  id="indicaciones"
                  name="indicaciones"
                  placeholder="Ingrese cualquier indicación adicional para la búsqueda"
                  rows="4"
                />
                <ErrorMessage name="indicaciones" component={ErrorText} />
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
