import React from 'react';
import styled, { css } from 'styled-components';
import { Field, ErrorMessage } from 'formik';
import { COLORS } from '../../utils/constants';

// Estilos base para los campos de formulario
const fieldStyles = css`
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
    border-color: ${COLORS.primary};
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Componente FormGroup
const FormGroup = styled.div`
  margin-bottom: 20px;
`;

// Componente Label
const Label = styled.label`
  display: block;
  margin: 15px 0 8px;
  color: ${COLORS.primary};
  font-weight: 500;
`;

// Componente Input estilizado
const StyledInput = styled(Field)`
  ${fieldStyles}
`;

// Componente TextArea estilizado
const StyledTextArea = styled(Field)`
  ${fieldStyles}
  min-height: 120px;
  resize: vertical;
`;

// Componente Select estilizado
const StyledSelect = styled(Field)`
  ${fieldStyles}
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232c3e50' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
`;

// Componente para mostrar errores
const ErrorText = styled.div`
  color: ${COLORS.danger};
  font-size: 0.9em;
  margin-top: 5px;
`;

// Componente para mostrar texto de ayuda
const HelpText = styled.div`
  color: ${COLORS.text};
  font-size: 0.9em;
  margin-top: 5px;
`;

/**
 * Componente FormField
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {string} props.type - Tipo de campo (text, email, password, textarea, select)
 * @param {string} props.placeholder - Placeholder del campo
 * @param {string} props.helpText - Texto de ayuda
 * @param {boolean} props.required - Si el campo es requerido
 * @param {boolean} props.disabled - Si el campo está deshabilitado
 * @param {React.ReactNode} props.children - Contenido del campo (para select)
 * @returns {React.ReactElement} - Elemento React
 */
const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  helpText, 
  required = false, 
  disabled = false, 
  children, 
  ...props 
}) => {
  // Renderizar el campo según el tipo
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <StyledTextArea
            as="textarea"
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        );
      case 'select':
        return (
          <StyledSelect
            as="select"
            id={name}
            name={name}
            disabled={disabled}
            {...props}
          >
            {children}
          </StyledSelect>
        );
      default:
        return (
          <StyledInput
            type={type}
            id={name}
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        );
    }
  };
  
  return (
    <FormGroup>
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span style={{ color: COLORS.danger }}>*</span>}
        </Label>
      )}
      
      {renderField()}
      
      <ErrorMessage name={name} component={ErrorText} />
      
      {helpText && <HelpText>{helpText}</HelpText>}
    </FormGroup>
  );
};

/**
 * Componente TagsField para campos de etiquetas
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del campo
 * @param {string} props.name - Nombre del campo
 * @param {Array} props.tags - Array de etiquetas
 * @param {Function} props.setTags - Función para actualizar las etiquetas
 * @param {string} props.placeholder - Placeholder del campo
 * @param {string} props.helpText - Texto de ayuda
 * @param {boolean} props.required - Si el campo es requerido
 * @param {boolean} props.disabled - Si el campo está deshabilitado
 * @returns {React.ReactElement} - Elemento React
 */
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
  color: ${COLORS.primary};
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

const TagsField = ({ 
  label, 
  name, 
  tags, 
  setTags, 
  placeholder = 'Escriba un tema y presione Enter', 
  helpText, 
  required = false, 
  disabled = false 
}) => {
  const [tagInput, setTagInput] = React.useState('');
  
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
  
  return (
    <FormGroup>
      {label && (
        <Label htmlFor={name}>
          {label} {required && <span style={{ color: COLORS.danger }}>*</span>}
        </Label>
      )}
      
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
          placeholder={placeholder}
          disabled={disabled}
        />
      </TagsContainer>
      
      {tags.length === 0 && (
        <ErrorText>Debe ingresar al menos un tema de interés</ErrorText>
      )}
      
      {helpText && <HelpText>{helpText}</HelpText>}
    </FormGroup>
  );
};

// Exportar componentes
FormField.Tags = TagsField;

export default FormField;
