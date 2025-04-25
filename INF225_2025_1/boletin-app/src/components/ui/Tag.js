import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from '../../utils/constants';

// Estilos base para las etiquetas
const tagStyles = css`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: 500;
  background-color: rgba(52, 152, 219, 0.1);
  color: ${COLORS.accent};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
  }
`;

// Variantes de etiquetas
const tagVariants = {
  default: css`
    background-color: rgba(52, 152, 219, 0.1);
    color: ${COLORS.accent};
  `,
  primary: css`
    background-color: rgba(44, 62, 80, 0.1);
    color: ${COLORS.primary};
  `,
  success: css`
    background-color: rgba(46, 204, 113, 0.1);
    color: ${COLORS.success};
  `,
  warning: css`
    background-color: rgba(243, 156, 18, 0.1);
    color: ${COLORS.warning};
  `,
  danger: css`
    background-color: rgba(231, 76, 60, 0.1);
    color: ${COLORS.danger};
  `,
  info: css`
    background-color: rgba(52, 152, 219, 0.1);
    color: ${COLORS.accent};
  `,
};

// Tamaños de etiquetas
const tagSizes = {
  small: css`
    padding: 2px 6px;
    font-size: 0.8em;
  `,
  medium: css`
    padding: 4px 8px;
    font-size: 0.9em;
  `,
  large: css`
    padding: 6px 10px;
    font-size: 1em;
  `,
};

// Componente Tag estilizado
const StyledTag = styled.span`
  ${tagStyles}
  ${props => props.variant && tagVariants[props.variant]}
  ${props => props.size && tagSizes[props.size]}
  ${props => props.rounded && css`
    border-radius: 16px;
  `}
  ${props => props.outlined && css`
    background-color: transparent;
    border: 1px solid currentColor;
  `}
  ${props => props.clickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

// Componente para el botón de cierre
const CloseButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
  color: inherit;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

/**
 * Componente Tag
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante de la etiqueta (default, primary, success, warning, danger, info)
 * @param {string} props.size - Tamaño de la etiqueta (small, medium, large)
 * @param {boolean} props.rounded - Si la etiqueta debe tener bordes redondeados
 * @param {boolean} props.outlined - Si la etiqueta debe tener solo borde
 * @param {boolean} props.clickable - Si la etiqueta es clickeable
 * @param {boolean} props.closable - Si la etiqueta tiene botón de cierre
 * @param {Function} props.onClose - Función a ejecutar al hacer clic en el botón de cierre
 * @param {Function} props.onClick - Función a ejecutar al hacer clic en la etiqueta
 * @param {React.ReactNode} props.children - Contenido de la etiqueta
 * @returns {React.ReactElement} - Elemento React
 */
const Tag = ({ 
  variant = 'default', 
  size = 'medium', 
  rounded = false, 
  outlined = false, 
  clickable = false, 
  closable = false, 
  onClose, 
  onClick, 
  children, 
  ...props 
}) => {
  // Manejar clic en el botón de cierre
  const handleClose = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose(e);
    }
  };
  
  return (
    <StyledTag
      variant={variant}
      size={size}
      rounded={rounded}
      outlined={outlined}
      clickable={clickable || onClick}
      onClick={onClick}
      {...props}
    >
      {children}
      {closable && <CloseButton onClick={handleClose}>×</CloseButton>}
    </StyledTag>
  );
};

/**
 * Componente TagList para mostrar una lista de etiquetas
 */
const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  
  ${props => props.inline && css`
    display: inline-flex;
  `}
`;

// Exportar componentes
Tag.List = TagList;

export default Tag;
