import React, { useState } from 'react';
import styled from 'styled-components';
import { SeleccionFuentes, Card, Button } from '../components/ui';
import { COLORS, SPACING } from '../utils/constants';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${SPACING.xl};
`;

const Title = styled.h1`
  color: ${COLORS.primary};
  text-align: center;
  margin-bottom: ${SPACING.xl};
`;

const ExampleCard = styled(Card)`
  margin-bottom: ${SPACING.xl};
`;

const ResultsSection = styled.div`
  margin-top: ${SPACING.xl};
  padding: ${SPACING.lg};
  background-color: ${COLORS.backgroundLight};
  border-radius: 8px;
`;

const ResultTitle = styled.h3`
  color: ${COLORS.text};
  margin-bottom: ${SPACING.md};
`;

const SelectedList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SelectedItem = styled.li`
  padding: ${SPACING.sm};
  margin-bottom: ${SPACING.xs};
  background: white;
  border-radius: 4px;
  border-left: 4px solid ${COLORS.primary};
`;

/**
 * Página de ejemplo para demostrar el uso del componente SeleccionFuentes
 */
const EjemploSeleccionFuentes = () => {
  const [fuentesSeleccionadas, setFuentesSeleccionadas] = useState([]);

  // Datos de ejemplo personalizados
  const fuentesPersonalizadas = [
    {
      id: "1",
      nombre: "Agricultura",
      urls: [
        "https://www.minagri.gob.cl",
        "https://www.odepa.gob.cl",
        "https://www.fia.cl"
      ],
    },
    {
      id: "2",
      nombre: "Economía",
      urls: [
        "https://www.elmercurio.com/economia",
        "https://www.df.cl",
        "https://www.pulso.cl"
      ],
    },
    {
      id: "3",
      nombre: "Tecnología Agrícola",
      urls: [
        "https://www.agronomia.uchile.cl",
        "https://www.redagricola.com",
        "https://www.portalfruticola.com"
      ],
    },
    {
      id: "4",
      nombre: "Mercados",
      urls: [
        "https://www.bolsadesantiago.com",
        "https://www.cme.com",
        "https://www.investing.com"
      ],
    },
    {
      id: "5",
      nombre: "Clima",
      urls: [
        "https://www.meteochile.gob.cl",
        "https://www.weather.com",
        "https://www.accuweather.com"
      ],
    },
    {
      id: "6",
      nombre: "Exportaciones",
      urls: [
        "https://www.prochile.gob.cl",
        "https://www.asoex.cl",
        "https://www.fedefruta.cl"
      ],
    },
  ];

  const handleSelectionChange = (seleccionadas) => {
    setFuentesSeleccionadas(seleccionadas);
    console.log('Fuentes seleccionadas:', seleccionadas);
  };

  const obtenerNombresFuentes = () => {
    return fuentesPersonalizadas
      .filter(fuente => fuentesSeleccionadas.includes(fuente.id))
      .map(fuente => fuente.nombre);
  };

  const handleGenerarBoletin = () => {
    const fuentesSeleccionadasData = fuentesPersonalizadas.filter(
      fuente => fuentesSeleccionadas.includes(fuente.id)
    );
    
    console.log('Generando boletín con fuentes:', fuentesSeleccionadasData);
    alert(`Generando boletín con ${fuentesSeleccionadas.length} fuentes seleccionadas`);
  };

  return (
    <PageContainer>
      <Title>Ejemplo: Componente Selección de Fuentes</Title>
      
      <ExampleCard>
        <Card.Header>
          <Card.Title>Configuración de Fuentes para Boletín</Card.Title>
          <Card.Subtitle>
            Selecciona las categorías de fuentes que deseas incluir en tu boletín de noticias
          </Card.Subtitle>
        </Card.Header>
        
        <Card.Body>
          <SeleccionFuentes
            fuentesIniciales={fuentesPersonalizadas}
            onSelectionChange={handleSelectionChange}
          />
        </Card.Body>
        
        <Card.Footer>
          <Button
            variant="primary"
            onClick={handleGenerarBoletin}
            disabled={fuentesSeleccionadas.length === 0}
          >
            Generar Boletín ({fuentesSeleccionadas.length} fuentes)
          </Button>
        </Card.Footer>
      </ExampleCard>

      {fuentesSeleccionadas.length > 0 && (
        <ResultsSection>
          <ResultTitle>Fuentes Seleccionadas:</ResultTitle>
          <SelectedList>
            {obtenerNombresFuentes().map((nombre, index) => (
              <SelectedItem key={index}>
                {nombre}
              </SelectedItem>
            ))}
          </SelectedList>
        </ResultsSection>
      )}
    </PageContainer>
  );
};

export default EjemploSeleccionFuentes;
