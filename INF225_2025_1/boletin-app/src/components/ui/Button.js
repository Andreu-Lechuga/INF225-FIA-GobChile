import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { COLORS } from '../../utils/constants';

// Estilos base para botones
const buttonStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: 600;
  color: white;
  background: linear-gradient(145deg, ${COLORS.secondary}, ${COLORS.primary});
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(52, 73, 94, 0.2);
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 10px rgba(52, 73, 94, 0.2);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(52, 73, 94, 0.2);
    }
    
    &:before {
      display: none;
    }
  }
  
  @media (max-width: 600px) {
    width: 100%;
    margin: 5px 0;
  }
`;

// Variantes de botones
const buttonVariants = {
  primary: css`
    background: linear-gradient(145deg, ${COLORS.secondary}, ${COLORS.primary});
  `,
  secondary: css`
    background: linear-gradient(145deg, #7f8c8d, #95a5a6);
  `,
  success: css`
    background: linear-gradient(145deg, #27ae60, ${COLORS.success});
  `,
  danger: css`
    background: linear-gradient(145deg, #c0392b, ${COLORS.danger});
  `,
  warning: css`
    background: linear-gradient(145deg, #f1c40f, ${COLORS.warning});
  `,
  info: css`
    background: linear-gradient(145deg, #2980b9, ${COLORS.accent});
  `,
};

// Tamaños de botones
const buttonSizes = {
  small: css`
    min-width: 120px;
    padding: 8px 15px;
    font-size: 0.9em;
  `,
  medium: css`
    min-width: 180px;
    padding: 12px 25px;
    font-size: 1em;
  `,
  large: css`
    min-width: 250px;
    padding: 15px 30px;
    font-size: 1.1em;
  `,
};

// Componente Button estilizado
const StyledButton = styled.button`
  ${buttonStyles}
  ${props => props.variant && buttonVariants[props.variant]}
  ${props => props.size && buttonSizes[props.size]}
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

// Componente LinkButton estilizado (para usar con React Router)
const StyledLinkButton = styled(Link)`
  ${buttonStyles}
  ${props => props.variant && buttonVariants[props.variant]}
  ${props => props.size && buttonSizes[props.size]}
  ${props => props.fullWidth && css`
    width: 100%;
  `}
`;

/**
 * Componente Button
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón (primary, secondary, success, danger, warning, info)
 * @param {string} props.size - Tamaño del botón (small, medium, large)
 * @param {boolean} props.fullWidth - Si el botón debe ocupar todo el ancho disponible
 * @param {string} props.to - Ruta a la que navegar (si se proporciona, se renderiza como Link)
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.type - Tipo de botón (button, submit, reset)
 * @returns {React.ReactElement} - Elemento React
 */
const Button = ({ 
  variant = 'primary', 
  size = 'large', 
  fullWidth = false, 
  to, 
  children, 
  ...props 
}) => {
  // Si se proporciona una ruta, renderizar como Link
  if (to) {
    return (
      <StyledLinkButton
        to={to}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        {...props}
      >
        {children}
      </StyledLinkButton>
    );
  }
  
  // Si no, renderizar como botón normal
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
