import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';
import Card from './Card';
import { COLORS, BREAKPOINTS, SPACING, SHADOWS } from '../../utils/constants';

// Iconos SVG inline para reemplazar lucide-react
const PlusCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 8v8"></path>
    <path d="M8 12h8"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  </svg>
);

// Componentes estilizados
const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.lg};
  position: relative;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const CenterSection = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${COLORS.text};
  margin: 0;
`;

const InfoButton = styled.button`
  color: ${COLORS.textMuted};
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${COLORS.primary};
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: -48px;
  top: 32px;
  width: 256px;
  padding: 12px;
  background-color: ${COLORS.backgroundDark};
  color: white;
  font-size: 0.875rem;
  border-radius: 8px;
  box-shadow: ${SHADOWS.medium};
  z-index: 10;
  transform: translateX(-50%);
  
  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid ${COLORS.backgroundDark};
  }
`;

const TooltipTitle = styled.div`
  margin-bottom: 8px;
  font-weight: 500;
`;

const TooltipText = styled.div`
  font-size: 0.75rem;
  color: #d1d5db;
  line-height: 1.5;
`;

const EditButton = styled(Button)`
  height: 40px;
  border: 2px dashed ${COLORS.border};
  background: white;
  color: ${COLORS.text};
  box-shadow: none;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: ${COLORS.primary};
    background: ${COLORS.backgroundLight};
    box-shadow: none;
  }
`;

const SelectAllButton = styled.button`
  display: flex;
  align-items: center;
  margin: 0 auto ${SPACING.lg};
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  
  ${props => props.allSelected ? css`
    border-color: ${COLORS.primary};
    background-color: rgba(52, 152, 219, 0.1);
    color: ${COLORS.primary};
    box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
  ` : css`
    border-color: ${COLORS.border};
    color: ${COLORS.text};
    
    &:hover {
      border-color: ${COLORS.borderDark};
      background-color: ${COLORS.backgroundLight};
    }
  `}
`;

const SourceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SourceRow = styled.div`
  display: flex;
  gap: 12px;
  
  ${props => props.centered && css`
    justify-content: center;
  `}
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    flex-direction: column;
    gap: 8px;
  }
`;

const SourceButton = styled.button`
  height: 48px;
  flex: 1;
  max-width: calc(25% - 9px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 2px solid;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.selected ? css`
    border-color: ${COLORS.primary};
    background-color: rgba(52, 152, 219, 0.1);
    color: ${COLORS.primary};
    box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
  ` : css`
    border-color: ${COLORS.border};
    background-color: white;
    color: ${COLORS.text};
    
    &:hover {
      border-color: ${COLORS.borderDark};
      background-color: ${COLORS.backgroundLight};
    }
  `}
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    max-width: 100%;
  }
`;

// Modal components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(Card)`
  max-width: 1024px;
  max-height: 80vh;
  width: 90%;
  margin: 0;
`;

const ModalHeader = styled.div`
  margin-bottom: ${SPACING.lg};
  padding-bottom: ${SPACING.md};
  border-bottom: 1px solid ${COLORS.border};
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${COLORS.text};
  margin: 0;
`;

const ModalBody = styled.div`
  display: flex;
  gap: 24px;
  height: 500px;
`;

const LeftColumn = styled.div`
  width: 33.333%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.lg};
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.lg};
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.textLight};
  margin: 0 0 8px 0;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DeleteButton = styled.button`
  height: 24px;
  width: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: ${COLORS.danger};
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    color: #c0392b;
  }
`;

const CategoryButton = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  
  ${props => props.selected ? css`
    border-color: ${COLORS.primary};
    background-color: rgba(52, 152, 219, 0.1);
  ` : css`
    border-color: ${COLORS.border};
    background-color: ${COLORS.backgroundLight};
    
    &:hover {
      background-color: #e9ecef;
    }
  `}
`;

const CategoryName = styled.span`
  flex: 1;
  color: ${COLORS.text};
`;

const CategoryCount = styled.span`
  font-size: 0.75rem;
  color: ${COLORS.textMuted};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 12px;
  font-size: 0.875rem;
  border: 1px solid ${COLORS.border};
  border-radius: 6px;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const URLList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
`;

const URLItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid ${COLORS.border};
  border-radius: 6px;
  background: white;
`;

const URLText = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: ${COLORS.text};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${COLORS.textMuted};
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: ${COLORS.textMuted};
  font-style: italic;
  margin: 0;
`;

/**
 * Componente SeleccionFuentes
 * Permite seleccionar y editar fuentes de noticias organizadas por categorías
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.fuentesIniciales - Array inicial de fuentes
 * @param {Function} props.onSelectionChange - Callback cuando cambia la selección
 * @returns {React.ReactElement} - Elemento React
 */
const SeleccionFuentes = ({ 
  fuentesIniciales = [
    {
      id: "1",
      nombre: "Noticias",
      urls: ["https://cnn.com", "https://bbc.com", "https://reuters.com"],
    },
    {
      id: "2",
      nombre: "Tecnología",
      urls: ["https://techcrunch.com", "https://wired.com"],
    },
    {
      id: "3",
      nombre: "Finanzas",
      urls: ["https://bloomberg.com", "https://reuters.com/business"],
    },
    {
      id: "4",
      nombre: "Deportes",
      urls: ["https://espn.com", "https://sports.yahoo.com"],
    },
  ],
  onSelectionChange
}) => {
  const [fuentes, setFuentes] = useState(fuentesIniciales);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [contador, setContador] = useState(5);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombreNuevaFuente, setNombreNuevaFuente] = useState("");
  const [fuenteSeleccionada, setFuenteSeleccionada] = useState(null);
  const [nuevaUrl, setNuevaUrl] = useState("");
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const timeoutRef = useRef(null);

  const toggleSeleccion = (id) => {
    const nuevaSeleccion = seleccionadas.includes(id) 
      ? seleccionadas.filter((item) => item !== id) 
      : [...seleccionadas, id];
    
    setSeleccionadas(nuevaSeleccion);
    
    if (onSelectionChange) {
      onSelectionChange(nuevaSeleccion);
    }
  };

  const seleccionarTodo = () => {
    const nuevaSeleccion = seleccionadas.length === fuentes.length 
      ? [] 
      : fuentes.map((f) => f.id);
    
    setSeleccionadas(nuevaSeleccion);
    
    if (onSelectionChange) {
      onSelectionChange(nuevaSeleccion);
    }
  };

  const agregarNuevaFuente = () => {
    if (nombreNuevaFuente.trim()) {
      const nuevaFuente = {
        id: contador.toString(),
        nombre: nombreNuevaFuente.trim(),
        urls: [],
      };
      setFuentes([...fuentes, nuevaFuente]);
      setContador(contador + 1);
      setNombreNuevaFuente("");
    }
  };

  const agregarUrl = () => {
    if (nuevaUrl.trim() && fuenteSeleccionada) {
      setFuentes((prev) =>
        prev.map((fuente) =>
          fuente.id === fuenteSeleccionada 
            ? { ...fuente, urls: [...fuente.urls, nuevaUrl.trim()] } 
            : fuente,
        ),
      );
      setNuevaUrl("");
    }
  };

  const eliminarUrl = (urlIndex) => {
    if (fuenteSeleccionada) {
      setFuentes((prev) =>
        prev.map((fuente) =>
          fuente.id === fuenteSeleccionada
            ? { ...fuente, urls: fuente.urls.filter((_, index) => index !== urlIndex) }
            : fuente,
        ),
      );
    }
  };

  const eliminarCategoria = (categoriaId) => {
    setFuentes((prev) => prev.filter((fuente) => fuente.id !== categoriaId));
    
    if (fuenteSeleccionada === categoriaId) {
      setFuenteSeleccionada(null);
    }
    
    setSeleccionadas((prev) => prev.filter((id) => id !== categoriaId));
  };

  const manejarTeclaCategoria = (e) => {
    if (e.key === "Enter") {
      agregarNuevaFuente();
    }
  };

  const manejarTeclaUrl = (e) => {
    if (e.key === "Enter") {
      agregarUrl();
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMostrarTooltip(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setMostrarTooltip(false);
    }, 150);
  };

  const handleTooltipMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleTooltipMouseLeave = () => {
    setMostrarTooltip(false);
  };

  const fuenteActual = fuentes.find((f) => f.id === fuenteSeleccionada);

  // Dividir las fuentes en filas de 4 elementos
  const dividirEnFilas = (items, itemsPorFila = 4) => {
    const filas = [];
    for (let i = 0; i < items.length; i += itemsPorFila) {
      filas.push(items.slice(i, i + itemsPorFila));
    }
    return filas;
  };

  const filasDeFuentes = dividirEnFilas(fuentes, 4);

  return (
    <Container>
      <Header>
        <LeftSection>
          <div style={{ position: 'relative' }}>
            <InfoButton
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <InfoIcon />
            </InfoButton>

            {mostrarTooltip && (
              <Tooltip
                onMouseEnter={handleTooltipMouseEnter}
                onMouseLeave={handleTooltipMouseLeave}
              >
                <TooltipTitle>Selección de Fuentes</TooltipTitle>
                <TooltipText>
                  Selecciona las categorías de fuentes que deseas incluir en tu análisis. 
                  Cada categoría contiene múltiples URLs de sitios web relacionados. 
                  Puedes editar las categorías y sus URLs usando el botón "Editar Fuentes".
                </TooltipText>
              </Tooltip>
            )}
          </div>
        </LeftSection>

        <CenterSection>
          <Title>Selección de Fuentes</Title>
        </CenterSection>

        <RightSection>
          <EditButton
            variant="secondary"
            size="medium"
            onClick={() => setModalAbierto(true)}
          >
            <EditIcon />
            Editar Fuentes
          </EditButton>
        </RightSection>
      </Header>

      <SelectAllButton
        allSelected={seleccionadas.length === fuentes.length}
        onClick={seleccionarTodo}
      >
        {seleccionadas.length === fuentes.length ? (
          <>
            <CheckIcon style={{ marginRight: '8px' }} /> 
            Deseleccionar Todo
          </>
        ) : (
          "Seleccionar Todo"
        )}
      </SelectAllButton>

      <SourceGrid>
        {filasDeFuentes.map((fila, filaIndex) => {
          const esUltimaFila = filaIndex === filasDeFuentes.length - 1;
          const filaCompleta = fila.length === 4;

          return (
            <SourceRow
              key={filaIndex}
              centered={esUltimaFila && !filaCompleta}
            >
              {fila.map((fuente) => (
                <SourceButton
                  key={fuente.id}
                  selected={seleccionadas.includes(fuente.id)}
                  onClick={() => toggleSeleccion(fuente.id)}
                >
                  {fuente.nombre}
                </SourceButton>
              ))}
            </SourceRow>
          );
        })}
      </SourceGrid>

      {/* Modal */}
      {modalAbierto && (
        <ModalOverlay onClick={() => setModalAbierto(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Editar Fuentes</ModalTitle>
            </ModalHeader>

            <ModalBody>
              {/* Columna izquierda - Categorías */}
              <LeftColumn>
                <div>
                  <SectionTitle>Categorías:</SectionTitle>
                  <CategoryList>
                    {fuentes.map((fuente) => (
                      <CategoryItem key={fuente.id}>
                        <DeleteButton
                          onClick={() => eliminarCategoria(fuente.id)}
                          title="Eliminar categoría"
                        >
                          <TrashIcon />
                        </DeleteButton>
                        <CategoryButton
                          selected={fuenteSeleccionada === fuente.id}
                          onClick={() => setFuenteSeleccionada(fuente.id)}
                        >
                          <CategoryName>{fuente.nombre}</CategoryName>
                          <CategoryCount>({fuente.urls.length})</CategoryCount>
                        </CategoryButton>
                      </CategoryItem>
                    ))}
                  </CategoryList>
                </div>

                {/* Añadir nueva categoría */}
                <div>
                  <SectionTitle>Nueva categoría:</SectionTitle>
                  <InputGroup>
                    <Input
                      type="text"
                      value={nombreNuevaFuente}
                      onChange={(e) => setNombreNuevaFuente(e.target.value)}
                      onKeyDown={manejarTeclaCategoria}
                      placeholder="Nombre de la categoría"
                    />
                    <Button 
                      onClick={agregarNuevaFuente} 
                      disabled={!nombreNuevaFuente.trim()}
                      size="compact"
                    >
                      <PlusCircleIcon />
                    </Button>
                  </InputGroup>
                </div>
              </LeftColumn>

              {/* Columna derecha - URLs */}
              <RightColumn>
                {fuenteActual ? (
                  <>
                    <div>
                      <SectionTitle>URLs de "{fuenteActual.nombre}":</SectionTitle>
                      <URLList>
                        {fuenteActual.urls.length > 0 ? (
                          fuenteActual.urls.map((url, index) => (
                            <URLItem key={index}>
                              <URLText title={url}>{url}</URLText>
                              <DeleteButton
                                onClick={() => eliminarUrl(index)}
                                title="Eliminar URL"
                              >
                                <TrashIcon />
                              </DeleteButton>
                            </URLItem>
                          ))
                        ) : (
                          <EmptyText>No hay URLs añadidas</EmptyText>
                        )}
                      </URLList>
                    </div>

                    {/* Añadir nueva URL */}
                    <div>
                      <SectionTitle>Añadir URL:</SectionTitle>
                      <InputGroup>
                        <Input
                          type="url"
                          value={nuevaUrl}
                          onChange={(e) => setNuevaUrl(e.target.value)}
                          onKeyDown={manejarTeclaUrl}
                          placeholder="https://ejemplo.com"
                        />
                        <Button 
                          onClick={agregarUrl} 
                          disabled={!nuevaUrl.trim()}
                          size="compact"
                        >
                          <PlusCircleIcon />
                        </Button>
                      </InputGroup>
                    </div>
                  </>
                ) : (
                  <EmptyState>
                    <p>Selecciona una categoría para ver sus URLs</p>
                  </EmptyState>
                )}
              </RightColumn>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SeleccionFuentes;
