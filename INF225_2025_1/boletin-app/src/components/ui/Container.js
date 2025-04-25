import React from 'react';
import styled, { css } from 'styled-components';

// Estilos base para los contenedores
const containerStyles = css`
  width: 100%;
  margin: 0 auto;
  padding: ${props => props.padding || '20px'};
`;

// Componente Container estilizado
const StyledContainer = styled.div`
  ${containerStyles}
  max-width: ${props => props.maxWidth || '1200px'};
  
  ${props => props.fluid && css`
    max-width: 100%;
  `}
  
  ${props => props.centered && css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `}
  
  ${props => props.fullHeight && css`
    min-height: ${props.fullHeight === true ? '100vh' : props.fullHeight};
  `}
  
  ${props => props.backgroundColor && css`
    background-color: ${props.backgroundColor};
  `}
`;

// Componente Row estilizado
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -15px;
  
  ${props => props.noGutters && css`
    margin: 0;
  `}
  
  ${props => props.alignItems && css`
    align-items: ${props.alignItems};
  `}
  
  ${props => props.justifyContent && css`
    justify-content: ${props.justifyContent};
  `}
  
  ${props => props.spacing && css`
    gap: ${props.spacing};
  `}
`;

// Componente Column estilizado
const Column = styled.div`
  flex: ${props => props.flex || '1'};
  padding: ${props => props.noGutters ? '0' : '0 15px'};
  
  ${props => props.width && css`
    flex: 0 0 ${props.width};
    max-width: ${props.width};
  `}
  
  ${props => props.xs && css`
    @media (min-width: 0) {
      flex: 0 0 ${props.xs * 100 / 12}%;
      max-width: ${props.xs * 100 / 12}%;
    }
  `}
  
  ${props => props.sm && css`
    @media (min-width: 576px) {
      flex: 0 0 ${props.sm * 100 / 12}%;
      max-width: ${props.sm * 100 / 12}%;
    }
  `}
  
  ${props => props.md && css`
    @media (min-width: 768px) {
      flex: 0 0 ${props.md * 100 / 12}%;
      max-width: ${props.md * 100 / 12}%;
    }
  `}
  
  ${props => props.lg && css`
    @media (min-width: 992px) {
      flex: 0 0 ${props.lg * 100 / 12}%;
      max-width: ${props.lg * 100 / 12}%;
    }
  `}
  
  ${props => props.xl && css`
    @media (min-width: 1200px) {
      flex: 0 0 ${props.xl * 100 / 12}%;
      max-width: ${props.xl * 100 / 12}%;
    }
  `}
  
  ${props => props.offset && css`
    margin-left: ${props.offset * 100 / 12}%;
  `}
`;

// Componente Section estilizado
const Section = styled.section`
  padding: ${props => props.padding || '60px 0'};
  
  ${props => props.backgroundColor && css`
    background-color: ${props.backgroundColor};
  `}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.centered && css`
    text-align: center;
  `}
`;

// Componente PageContainer estilizado
const PageContainer = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '800px'};
  margin: 0 auto;
  padding: 20px;
  
  ${props => props.centered && css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `}
`;

/**
 * Componente Container
 * @param {Object} props - Propiedades del componente
 * @param {string} props.maxWidth - Ancho máximo del contenedor
 * @param {boolean} props.fluid - Si el contenedor debe ocupar todo el ancho disponible
 * @param {boolean} props.centered - Si el contenedor debe centrar su contenido
 * @param {boolean|string} props.fullHeight - Si el contenedor debe ocupar toda la altura disponible
 * @param {string} props.backgroundColor - Color de fondo del contenedor
 * @param {string} props.padding - Padding del contenedor
 * @param {React.ReactNode} props.children - Contenido del contenedor
 * @returns {React.ReactElement} - Elemento React
 */
const Container = ({ 
  maxWidth, 
  fluid = false, 
  centered = false, 
  fullHeight = false, 
  backgroundColor, 
  padding, 
  children, 
  ...props 
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      fluid={fluid}
      centered={centered}
      fullHeight={fullHeight}
      backgroundColor={backgroundColor}
      padding={padding}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

// Exportar componentes
Container.Row = Row;
Container.Column = Column;
Container.Section = Section;
Container.Page = PageContainer;

export default Container;
