import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from '../../utils/constants';

// Estilos base para las tarjetas
const cardStyles = css`
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }
`;

// Variantes de tarjetas
const cardVariants = {
  default: css`
    padding: 40px;
    
    @media (max-width: 600px) {
      padding: 20px;
    }
  `,
  compact: css`
    padding: 20px;
    
    @media (max-width: 600px) {
      padding: 15px;
    }
  `,
  borderless: css`
    padding: 40px;
    border-radius: 0;
    box-shadow: none;
    
    @media (max-width: 600px) {
      padding: 20px;
    }
  `,
  elevated: css`
    padding: 40px;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
    
    @media (max-width: 600px) {
      padding: 20px;
    }
  `,
  outlined: css`
    padding: 40px;
    box-shadow: none;
    border: 1px solid #e0e0e0;
    
    @media (max-width: 600px) {
      padding: 20px;
    }
  `,
};

// Componente Card estilizado
const StyledCard = styled.div`
  ${cardStyles}
  ${props => props.variant && cardVariants[props.variant]}
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  ${props => props.maxWidth && css`
    max-width: ${props.maxWidth};
  `}
  ${props => props.backgroundColor && css`
    background-color: ${props.backgroundColor};
  `}
`;

// Componente para el encabezado de la tarjeta
const CardHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: ${props => props.divider ? '1px solid #e0e0e0' : 'none'};
`;

// Componente para el cuerpo de la tarjeta
const CardBody = styled.div`
  margin-bottom: ${props => props.noMargin ? '0' : '20px'};
`;

// Componente para el pie de la tarjeta
const CardFooter = styled.div`
  margin-top: 20px;
  padding-top: 15px;
  border-top: ${props => props.divider ? '1px solid #e0e0e0' : 'none'};
  display: flex;
  justify-content: ${props => props.align || 'flex-end'};
  gap: 10px;
`;

// Componente para el título de la tarjeta
const CardTitle = styled.h2`
  color: ${COLORS.primary};
  font-size: 1.4em;
  margin-bottom: 10px;
`;

// Componente para el subtítulo de la tarjeta
const CardSubtitle = styled.h3`
  color: ${COLORS.text};
  font-size: 1.1em;
  font-weight: 500;
  margin-bottom: 10px;
`;

/**
 * Componente Card
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante de la tarjeta (default, compact, borderless, elevated, outlined)
 * @param {boolean} props.fullWidth - Si la tarjeta debe ocupar todo el ancho disponible
 * @param {string} props.maxWidth - Ancho máximo de la tarjeta (ej: '800px')
 * @param {string} props.backgroundColor - Color de fondo de la tarjeta
 * @param {React.ReactNode} props.children - Contenido de la tarjeta
 * @returns {React.ReactElement} - Elemento React
 */
const Card = ({ 
  variant = 'default', 
  fullWidth = false, 
  maxWidth, 
  backgroundColor,
  children, 
  ...props 
}) => {
  return (
    <StyledCard
      variant={variant}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      backgroundColor={backgroundColor}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

// Exportar componentes
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;

export default Card;
