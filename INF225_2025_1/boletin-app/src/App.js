import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from './context';

// Importar páginas
import Home from './pages/Home';
import BoletinForm from './pages/BoletinForm';
import BoletinList from './pages/BoletinList';
import BoletinStatus from './pages/BoletinStatus';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';

// Importar componentes comunes
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Estilos globales
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  // Si está cargando, mostrar un indicador de carga
  if (loading) {
    return <div>Cargando...</div>;
  }
  
  // Si no hay usuario autenticado, redirigir a login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Si hay usuario autenticado, mostrar el contenido protegido
  return children;
};

function App() {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  return (
    <AppContainer>
      {/* No mostrar Header en páginas de autenticación */}
      {!location.pathname.includes('/login') && 
       !location.pathname.includes('/signup') && <Header />}
      
      <MainContent>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            currentUser ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            currentUser ? <Navigate to="/" /> : <SignUp />
          } />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/generar-boletin" element={
            <ProtectedRoute>
              <BoletinForm />
            </ProtectedRoute>
          } />
          <Route path="/boletines" element={
            <ProtectedRoute>
              <BoletinList />
            </ProtectedRoute>
          } />
          <Route path="/estado-boletines" element={
            <ProtectedRoute>
              <BoletinStatus />
            </ProtectedRoute>
          } />
        </Routes>
      </MainContent>
      
      {/* No mostrar Footer en páginas de autenticación */}
      {!location.pathname.includes('/login') && 
       !location.pathname.includes('/signup') && <Footer />}
    </AppContainer>
  );
}

export default App;
