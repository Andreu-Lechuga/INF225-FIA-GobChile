import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../../api/supabase';

// Estilos para la página de lista de boletines aprobados
const ListContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
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

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
`;

const BulletinCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  padding: 20px;
  cursor: pointer;
  border-bottom: ${props => props.expanded ? '1px solid #e0e0e0' : 'none'};
`;

const CardContent = styled.div`
  padding: 20px;
  border-top: 1px solid #e0e0e0;
`;

const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-left: 12px;
  
  ${props => {
    switch (props.status) {
      case 'Aprobado':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #059669;
          border: 1px solid rgba(34, 197, 94, 0.2);
        `;
      case 'Rechazado':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #dc2626;
          border: 1px solid rgba(239, 68, 68, 0.2);
        `;
      case 'En Revision':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
          border: 1px solid rgba(245, 158, 11, 0.2);
        `;
      case 'Completado':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
          border: 1px solid rgba(59, 130, 246, 0.2);
        `;
      default:
        return `
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          border: 1px solid rgba(107, 114, 128, 0.2);
        `;
    }
  }}
`;

const ExpandIcon = styled.div`
  color: #9ca3af;
  margin-left: 12px;
  transition: transform 0.2s ease;
  transform: ${props => props.expanded ? 'rotate(90deg)' : 'rotate(0deg)'};
  
  &::before {
    content: '▶';
    font-size: 0.8rem;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  padding: 6px 12px;
  background: rgba(6, 182, 212, 0.1);
  color: #0891b2;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 20px;
  font-size: 0.85rem;
`;

const ConceptTag = styled.span`
  padding: 4px 8px;
  background: rgba(6, 182, 212, 0.05);
  color: #0e7490;
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 12px;
  font-size: 0.75rem;
`;

const DetailSection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailTitle = styled.h4`
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const DetailText = styled.p`
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
`;

const LinkItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LinkIcon = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  flex-shrink: 0;
  
  &::before {
    content: '🔗';
  }
`;

const LinkText = styled.span`
  color: #2563eb;
  font-size: 0.85rem;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  &:hover {
    color: #1d4ed8;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 40px 0;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #e74c3c;
  padding: 40px 0;
  font-size: 1.1rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyTitle = styled.p`
  color: #6b7280;
  font-size: 1.2rem;
  margin-bottom: 8px;
`;

const EmptySubtitle = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
`;

const NavFooter = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ReturnButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.9rem;
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

const BoletinList = () => {
  const [boletinesAprobados, setBoletinesAprobados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBulletin, setExpandedBulletin] = useState(null);
  
  // Función auxiliar para calcular días transcurridos
  const calcularDiasTranscurridos = (fechaRegistro) => {
    const fecha = new Date(fechaRegistro);
    const hoy = new Date();
    const diferencia = hoy - fecha;
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  };

  // Función auxiliar para formatear período de búsqueda
  const formatearPeriodoBusqueda = (plazo, fechaRegistro) => {
    const fecha = new Date(fechaRegistro);
    const fechaInicio = new Date(fecha);
    const fechaFin = new Date(fecha);
    
    switch (plazo) {
      case '1_mes':
        fechaFin.setMonth(fechaFin.getMonth() + 1);
        break;
      case '3_meses':
        fechaFin.setMonth(fechaFin.getMonth() + 3);
        break;
      case '6_meses':
        fechaFin.setMonth(fechaFin.getMonth() + 6);
        break;
      case '1_año':
        fechaFin.setFullYear(fechaFin.getFullYear() + 1);
        break;
      case '2_años':
        fechaFin.setFullYear(fechaFin.getFullYear() + 2);
        break;
      default:
        return 'No especificado';
    }
    
    const formatearFecha = (fecha) => {
      return fecha.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long' 
      });
    };
    
    return `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
  };

  useEffect(() => {
    const fetchBoletinesAprobados = async () => {
      try {
        setLoading(true);
        
        // Obtener solo boletines aprobados de Supabase
        const { data: boletines, error } = await supabase
          .from('boletines')
          .select('*')
          .eq('estado', 'Aprobado')
          .order('fecha_registro', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        // Adaptar los datos para incluir campos adicionales y calcular días transcurridos
        const boletinesAprobados = boletines.map(boletin => {
          console.log('Datos del boletín aprobado desde Supabase:', boletin);
          console.log('Conceptos:', boletin.conceptos);
          console.log('Links de búsqueda:', boletin.links_busqueda);
          
          return {
            id: boletin.id,
            titulo: boletin.titulo,
            temas: Array.isArray(boletin.temas) ? boletin.temas : [],
            conceptos: Array.isArray(boletin.conceptos) ? boletin.conceptos : [],
            linksDebusqueda: Array.isArray(boletin.links_busqueda) ? boletin.links_busqueda : [],
            periodoDeBusqueda: formatearPeriodoBusqueda(boletin.plazo, boletin.fecha_registro),
            fecha_registro: new Date(boletin.fecha_registro).toLocaleDateString('es-ES'),
            dias_transcurridos: calcularDiasTranscurridos(boletin.fecha_registro),
            estado: boletin.estado || 'Aprobado',
            comentarios: boletin.comentarios
          };
        });
        
        console.log('Boletines aprobados procesados:', boletinesAprobados);
        setBoletinesAprobados(boletinesAprobados);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los boletines aprobados:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        setLoading(false);
      }
    };
    
    fetchBoletinesAprobados();
  }, []);

  const toggleExpanded = (bulletinId) => {
    setExpandedBulletin(expandedBulletin === bulletinId ? null : bulletinId);
  };

  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  
  return (
    <ListContainer>
      <Container>
        <Title>Boletines Aprobados</Title>
        <Subtitle>Lista de boletines aprobados y listos para publicación</Subtitle>
        
        {loading ? (
          <LoadingMessage>Cargando datos...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : boletinesAprobados.length > 0 ? (
          <div>
            {boletinesAprobados.map(boletin => (
              <BulletinCard key={boletin.id}>
                <CardHeader 
                  expanded={expandedBulletin === boletin.id}
                  onClick={() => toggleExpanded(boletin.id)}
                >
                  <CardTitleRow>
                    <CardTitle>{boletin.titulo}</CardTitle>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <StatusBadge status={boletin.estado}>
                        {boletin.estado}
                      </StatusBadge>
                      <ExpandIcon expanded={expandedBulletin === boletin.id} />
                    </div>
                  </CardTitleRow>
                  
                  <TagList>
                    {boletin.temas && boletin.temas.map((tema, index) => (
                      <Tag key={index}>{tema}</Tag>
                    ))}
                  </TagList>
                </CardHeader>

                {expandedBulletin === boletin.id && (
                  <CardContent>
                    {/* Información básica */}
                    <DetailSection>
                      <DetailTitle>Fecha de Registro</DetailTitle>
                      <DetailText>{boletin.fecha_registro}</DetailText>
                    </DetailSection>

                    <DetailSection>
                      <DetailTitle>Días Transcurridos</DetailTitle>
                      <DetailText>{boletin.dias_transcurridos} días</DetailText>
                    </DetailSection>

                    {/* Período de búsqueda */}
                    {boletin.periodoDeBusqueda && (
                      <DetailSection>
                        <DetailTitle>Período de Búsqueda</DetailTitle>
                        <DetailText>{boletin.periodoDeBusqueda}</DetailText>
                      </DetailSection>
                    )}

                    {/* Conceptos */}
                    {boletin.conceptos && boletin.conceptos.length > 0 && (
                      <DetailSection>
                        <DetailTitle>Conceptos</DetailTitle>
                        <TagList>
                          {boletin.conceptos.map((concepto, index) => (
                            <ConceptTag key={index}>{concepto}</ConceptTag>
                          ))}
                        </TagList>
                      </DetailSection>
                    )}

                    {/* Links de búsqueda */}
                    {boletin.linksDebusqueda && boletin.linksDebusqueda.length > 0 && (
                      <DetailSection>
                        <DetailTitle>Links de Búsqueda</DetailTitle>
                        <div>
                          {boletin.linksDebusqueda.map((link, index) => (
                            <LinkItem
                              key={index}
                              onClick={() => openLink(link)}
                            >
                              <LinkIcon />
                              <LinkText>{link}</LinkText>
                            </LinkItem>
                          ))}
                        </div>
                      </DetailSection>
                    )}

                    {/* Comentarios */}
                    {boletin.comentarios && (
                      <DetailSection>
                        <DetailTitle>Comentarios</DetailTitle>
                        <DetailText>{boletin.comentarios}</DetailText>
                      </DetailSection>
                    )}
                  </CardContent>
                )}
              </BulletinCard>
            ))}
          </div>
        ) : (
          <EmptyMessage>
            <EmptyTitle>No hay boletines aprobados aún</EmptyTitle>
            <EmptySubtitle>Los boletines aprobados aparecerán aquí cuando sean aprobados por el administrador</EmptySubtitle>
          </EmptyMessage>
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
