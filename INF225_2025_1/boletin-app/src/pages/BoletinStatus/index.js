import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

// Estilos para la página de estado de boletines
const StatusContainer = styled.div`
  width: 100%;
  max-width: 1000px;
`;

const Container = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background: white;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
  background-color: #34495e;
  color: white;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f9fc;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const Tag = styled.span`
  background-color: rgba(52, 152, 219, 0.1);
  color: #2980b9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 20px 0;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #e74c3c;
  padding: 20px 0;
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


const BoletinStatus = () => {
  const [estadoBoletines, setEstadoBoletines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Carga de datos desde el backend
    const fetchEstadoBoletines = async () => {
      try {
        const response = await axios.get('/api/boletines/estado');
        
        if (response.data && response.data.status === 'success') {
          setEstadoBoletines(response.data.data);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el estado de los boletines:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchEstadoBoletines();
  }, []);
  
  return (
    <StatusContainer>
      <Container>
        <Title>Estado de los Boletines</Title>
        
        {loading ? (
          <LoadingMessage>Cargando datos...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : estadoBoletines.length > 0 ? (
          <Table>
            <thead>
              <Tr>
                <Th>ID</Th>
                <Th>Título</Th>
                <Th>Temas de Interés</Th>
                <Th>Fecha de Registro</Th>
                <Th>Días Transcurridos</Th>
                <Th>Estado</Th>
              </Tr>
            </thead>
            <tbody>
              {estadoBoletines.map(boletin => (
                <Tr key={boletin.id}>
                  <Td>{boletin.id}</Td>
                  <Td>{boletin.titulo}</Td>
                  <Td>
                    <TagList>
                      {boletin.temas.map((tema, index) => (
                        <Tag key={index}>{tema}</Tag>
                      ))}
                    </TagList>
                  </Td>
                  <Td>{boletin.fecha_registro}</Td>
                  <Td>{boletin.dias_transcurridos} días</Td>
                  <Td>{boletin.estado}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyMessage>Ningún boletín creado todavía</EmptyMessage>
        )}
      </Container>
      
      <NavFooter>
        <ReturnButton to="/">
          Volver al Menú Principal
        </ReturnButton>
      </NavFooter>
    </StatusContainer>
  );
};

export default BoletinStatus;
