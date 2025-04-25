import React from 'react';
import styled from 'styled-components';

// Estilos para el AuthHeader
const HeaderContainer = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 20px;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #2c3e50;
`;

const MainTitle = styled.h1`
  font-size: 1.8em;
  font-weight: 600;
  margin: 0;
`;

const SubTitle = styled.h2`
  font-size: 1.2em;
  font-weight: 500;
  color: #546e7a;
  margin: 0;
`;

const LogoSpace = styled.div`
  width: 150px;
  height: 130px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 600px) {
    width: 100px;
    height: 90px;
  }
`;

const AuthHeader = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <LogoSpace>
          <img 
            src="/images/logo-min-agricultura.png" 
            alt="Logo Ministerio de Agricultura" 
          />
        </LogoSpace>
        <HeaderTitle>
          <MainTitle>Gobierno de Chile</MainTitle>
          <SubTitle>Ministerio de Agricultura</SubTitle>
        </HeaderTitle>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default AuthHeader;
