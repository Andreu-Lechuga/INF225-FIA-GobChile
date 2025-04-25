import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// Estilos para la página de lista de boletines
const ListContainer = styled.div`
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

const Title = styled.h2`
  color: #2c3e50;
  font-size: 1.4em;
  text-align: center;
  margin-bottom: 30px;
`;

const BoletinItem = styled.div`
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const BoletinTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const BoletinMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #7f8c8d;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
`;

const Tag = styled.span`
  background-color: rgba(52, 152, 219, 0.1);
  color: #2980b9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  font-style: italic;
  padding: 20px 0;
`;

const NavFooter = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ReturnButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.9em;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Datos de ejemplo para mostrar
const boletinesEjemplo = [
  {
    id: 1,
    titulo: 'Mejores prácticas para el cultivo en condiciones de sequía',
    temas: ['sequía', 'cultivo', 'agricultura sostenible'],
    fecha: '15/04/2025',
    estado: 'Completado'
  },
  {
    id: 2,
    titulo: 'Control de plagas en campos de trigo',
    temas: ['plagas', 'trigo', 'control biológico'],
    fecha: '10/04/2025',
    estado: 'Completado'
  },
  {
    id: 3,
    titulo: 'Estrategias de riego en tiempos de escasez hídrica',
    temas: ['riego', 'escasez hídrica', 'optimización'],
    fecha: '05/04/2025',
    estado: 'Completado'
  },
  {
    id: 4,
    titulo: 'Innovaciones en el manejo de cultivos resistentes a plagas',
    temas: ['innovación', 'resistencia', 'cultivos'],
    fecha: '01/04/2025',
    estado: 'Completado'
  },
  {
    id: 5,
    titulo: 'Impacto del cambio climático en la agricultura a largo plazo',
    temas: ['cambio climático', 'agricultura', 'proyección'],
    fecha: '25/03/2025',
    estado: 'Completado'
  }
];

const BoletinList = () => {
  const [boletines, setBoletines] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulación de carga de datos desde el backend
    const fetchBoletines = async () => {
      try {
        // Aquí se haría la petición al backend
        // const response = await fetch('/api/boletines');
        // const data = await response.json();
        
        // Usando datos de ejemplo por ahora
        setTimeout(() => {
          setBoletines(boletinesEjemplo);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar los boletines:', error);
        setLoading(false);
      }
    };
    
    fetchBoletines();
  }, []);
  
  return (
    <ListContainer>
      <Container>
        <Title>Boletines Generados</Title>
        
        {loading ? (
          <p>Cargando boletines...</p>
        ) : boletines.length > 0 ? (
          boletines.map(boletin => (
            <BoletinItem key={boletin.id}>
              <BoletinTitle>{boletin.titulo}</BoletinTitle>
              <TagList>
                {boletin.temas.map((tema, index) => (
                  <Tag key={index}>{tema}</Tag>
                ))}
              </TagList>
              <BoletinMeta>
                <span>Fecha: {boletin.fecha}</span>
                <span>Estado: {boletin.estado}</span>
              </BoletinMeta>
            </BoletinItem>
          ))
        ) : (
          <EmptyMessage>No hay boletines generados aún.</EmptyMessage>
        )}
      </Container>
      
      <NavFooter>
        <ReturnButton to="/">
          Volver al Menú Principal
        </ReturnButton>
      </NavFooter>
    </ListContainer>
  );
};

export default BoletinList;
