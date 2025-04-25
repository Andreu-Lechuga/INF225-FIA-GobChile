import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context';

// Estilos para el Header
const HeaderContainer = styled.header`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 0;
`;

// Contenedor para agrupar logo y títulos
const LeftSection = styled.div`
  display: flex;
  align-items: center;
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

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

// Icono de usuario genérico
const UserIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #757575;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #2c3e50;
`;

const UserRole = styled.span`
  font-size: 0.8em;
  color: #7f8c8d;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  font-weight: 600;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-top: 5px;
  
  &:hover {
    background-color: rgba(231, 76, 60, 0.1);
  }
`;

const LoginButton = styled(Link)`
  display: inline-block;
  padding: 8px 15px;
  background: linear-gradient(145deg, #34495e, #2c3e50);
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(52, 73, 94, 0.3);
  }
`;

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
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
        </LeftSection>
        
        {currentUser ? (
          <UserSection>
            <UserInfoContainer>
              <UserInfo>
                <UserName>{currentUser.username}</UserName>
                <UserRole>{currentUser.role}</UserRole>
              </UserInfo>
              <LogoutButton onClick={handleLogout}>
                Cerrar Sesión
              </LogoutButton>
            </UserInfoContainer>

            <UserIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
            </UserIcon>
          
          </UserSection>
        ) : (
          <LoginButton to="/login">
            Iniciar Sesión
          </LoginButton>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
