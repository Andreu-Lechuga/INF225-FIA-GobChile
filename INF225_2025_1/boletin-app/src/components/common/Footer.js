import React from 'react';
import styled from 'styled-components';

// Estilos para el Footer
const FooterContainer = styled.footer`
  width: 100%;
  padding: 20px;
  text-align: center;
`;

const VersionFooter = styled.div`
  text-align: center;
  color: #2c3e50;
  font-size: 0.9em;
  padding: 10px 0;
  
  span {
    color: #e74c3c;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <VersionFooter>
        V.1.0.1 <span>♥</span> Creado por Grupo 12 INF236
      </VersionFooter>
    </FooterContainer>
  );
};

export default Footer;
