import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context';

// Estilos para la página Home
const HomeContainer = styled.div`
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

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const WelcomeMessage = styled.h2`
  color: #2c3e50;
  font-size: 1.6em;
  margin-bottom: 10px;
`;

const UserInfo = styled.p`
  color: #546e7a;
  font-size: 1.1em;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  color: #2c3e50;
  font-size: 1.4em;
  text-align: center;
  margin-bottom: 30px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Button = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 250px;
  padding: 15px 30px;
  font-size: 1.1em;
  font-weight: 600;
  color: white;
  background: linear-gradient(145deg, #34495e, #2c3e50);
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
  
  @media (max-width: 600px) {
    width: 100%;
    margin: 5px 0;
  }
`;

const Home = () => {
  const { userProfile } = useAuth();

  // Función para obtener el saludo según la hora del día
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    if (hora < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Función para formatear el rol del usuario
  const formatearRol = (role) => {
    const roles = {
      'administrador': 'Administrador',
      'usuario-privado': 'Usuario Privado',
      'usuario-publico': 'Usuario Público'
    };
    return roles[role] || role;
  };

  return (
    <HomeContainer>
      <Container>
        {/* <WelcomeSection>
          <WelcomeMessage>
            {getSaludo()}, {userProfile?.username || 'Usuario'}
          </WelcomeMessage>
          <UserInfo>
            Rol: {formatearRol(userProfile?.role) || 'Cargando...'}
          </UserInfo>
        </WelcomeSection> */}
        
        <Title>Menú Principal</Title>
        
        <ButtonsContainer>
          <Button to="/generar-boletin">
            Generar Boletín
          </Button>
          <Button to="/boletines">
            Inspeccionar Boletines
          </Button>
          <Button to="/estado-boletines">
            Ver Estado General
          </Button>
        </ButtonsContainer>
      </Container>
    </HomeContainer>
  );
};

export default Home;
