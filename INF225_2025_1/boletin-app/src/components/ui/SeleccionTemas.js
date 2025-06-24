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

const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

// Componentes estilizados
const Container = styled.div`
  width: 100%;
  max-width: 1024px;
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
  flex-direction: column;
  height: 500px;
`;

const NavigationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${SPACING.md};
  padding-bottom: 12px;
  border-bottom: 1px solid ${COLORS.border};
`;

const NavigationLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 8px;
  background: none;
  border: none;
  color: ${COLORS.textMuted};
  cursor: pointer;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:hover {
    color: ${COLORS.text};
    background: ${COLORS.backgroundLight};
  }
`;

const Breadcrumb = styled.div`
  font-size: 0.875rem;
  color: ${COLORS.textMuted};
  font-weight: 500;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  overflow: hidden;
`;

const LeftColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: ${SPACING.lg};
  overflow-y: auto;
`;

const RightColumn = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${COLORS.border};
  padding-left: 24px;
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.textLight};
  margin: 0 0 8px 0;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
`;

const ItemContainer = styled.div`
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
  border-radius: 4px;
  
  &:hover {
    color: #c0392b;
    background: rgba(231, 76, 60, 0.1);
  }
`;

const ItemButton = styled.div`
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

const ItemName = styled.span`
  flex: 1;
  color: ${COLORS.text};
  font-size: 0.875rem;
`;

const ItemCount = styled.span`
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

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${COLORS.textMuted};
  font-style: italic;
  font-size: 0.875rem;
`;

const PreviewContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${COLORS.backgroundLight};
  padding: 16px;
  border-radius: 8px;
`;

const PreviewCategory = styled.div`
  margin-bottom: 16px;
`;

const PreviewCategoryTitle = styled.h4`
  font-weight: 500;
  color: ${COLORS.text};
  margin: 0 0 4px 0;
`;

const PreviewList = styled.ul`
  margin: 4px 0 0 16px;
  padding: 0;
  list-style: none;
`;

const PreviewItem = styled.li`
  font-size: 0.875rem;
  color: ${COLORS.textLight};
  margin-bottom: 4px;
`;

const PreviewSubList = styled.ul`
  margin: 4px 0 0 16px;
  padding: 0;
  list-style: none;
`;

const PreviewSubItem = styled.li`
  font-size: 0.75rem;
  color: ${COLORS.textMuted};
  margin-bottom: 2px;
`;

const HelpContainer = styled.div`
  margin-top: 16px;
  background: rgba(52, 152, 219, 0.1);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(52, 152, 219, 0.2);
`;

const HelpTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.primary};
  margin: 0 0 4px 0;
`;

const HelpText = styled.p`
  font-size: 0.75rem;
  color: ${COLORS.primary};
  margin: 0;
  line-height: 1.4;
`;

// Layout de checkboxes
const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 32px;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const CategoryTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${COLORS.text};
  border-bottom: 1px solid ${COLORS.border};
  padding-bottom: 4px;
  margin: 0;
`;

const TemasContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TemaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 3px 0;
  min-height: 20px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
`;

const TemaLabel = styled.label`
  font-size: 0.875rem;
  color: ${COLORS.textLight};
  cursor: pointer;
  line-height: 1.15;
  flex: 1;
  
  &:hover {
    color: ${COLORS.text};
  }
`;

/**
 * Componente SeleccionTemas
 * Permite seleccionar temas organizados por categorías para generar tags de búsqueda
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSelectionChange - Callback cuando cambia la selección
 * @returns {React.ReactElement} - Elemento React
 */
const SeleccionTemas = ({ onSelectionChange }) => {
  const [categorias, setCategorias] = useState([
    {
      id: "1",
      nombre: "Prácticas Agrícolas",
      temas: [
        {
          id: "1-1",
          nombre: "Labranza",
          subconceptos: [
            { id: "1-1-1", nombre: "Labranza convencional" },
            { id: "1-1-2", nombre: "Labranza mínima" },
            { id: "1-1-3", nombre: "Labranza cero" },
          ],
        },
        {
          id: "1-2",
          nombre: "Siembra Directa",
          subconceptos: [
            { id: "1-2-1", nombre: "Siembra manual" },
            { id: "1-2-2", nombre: "Siembra mecanizada" },
          ],
        },
        {
          id: "1-3",
          nombre: "Compostaje & Abonado Orgánico",
          subconceptos: [
            { id: "1-3-1", nombre: "Compostaje aeróbico" },
            { id: "1-3-2", nombre: "Vermicompostaje" },
            { id: "1-3-3", nombre: "Bokashi" },
          ],
        },
        {
          id: "1-4",
          nombre: "Rotación de Cultivos",
          subconceptos: [],
        },
        {
          id: "1-5",
          nombre: "Fertilización Química / Mineral",
          subconceptos: [],
        },
        {
          id: "1-6",
          nombre: "Control de Maleza",
          subconceptos: [],
        },
        {
          id: "1-7",
          nombre: "Poda",
          subconceptos: [],
        },
      ],
    },
    {
      id: "2",
      nombre: "Manejo de Agua",
      temas: [
        {
          id: "2-1",
          nombre: "Riego por Gravedad",
          subconceptos: [
            { id: "2-1-1", nombre: "Riego por surcos" },
            { id: "2-1-2", nombre: "Riego por inundación" },
          ],
        },
        {
          id: "2-2",
          nombre: "Riego por Aspersión",
          subconceptos: [],
        },
        {
          id: "2-3",
          nombre: "Riego por Goteo",
          subconceptos: [],
        },
        {
          id: "2-4",
          nombre: "Riego Subterráneo",
          subconceptos: [],
        },
        {
          id: "2-5",
          nombre: "Drenaje",
          subconceptos: [],
        },
        {
          id: "2-6",
          nombre: "Captación de Agua de Lluvia",
          subconceptos: [],
        },
      ],
    },
    {
      id: "3",
      nombre: "Tipos de Cultivos",
      temas: [
        { id: "3-1", nombre: "Policultivos", subconceptos: [] },
        { id: "3-2", nombre: "Monocultivos", subconceptos: [] },
        { id: "3-3", nombre: "Cultivos anuales", subconceptos: [] },
        { id: "3-4", nombre: "Cultivos Estacionales", subconceptos: [] },
        { id: "3-5", nombre: "Cultivos perennes", subconceptos: [] },
        { id: "3-6", nombre: "Cultivos de Cobertura", subconceptos: [] },
        { id: "3-7", nombre: "Cultivos Hidropónicos", subconceptos: [] },
        { id: "3-8", nombre: "Cultivos de Invernadero", subconceptos: [] },
      ],
    },
    {
      id: "4",
      nombre: "Clima",
      temas: [
        { id: "4-1", nombre: "Precipitación", subconceptos: [] },
        { id: "4-2", nombre: "Sequía", subconceptos: [] },
        { id: "4-3", nombre: "Humedad", subconceptos: [] },
        { id: "4-4", nombre: "Radiación Solar", subconceptos: [] },
        { id: "4-5", nombre: "Viento", subconceptos: [] },
        { id: "4-6", nombre: "Heladas", subconceptos: [] },
        { id: "4-7", nombre: "Microclimas", subconceptos: [] },
      ],
    },
  ]);

  const [temasSeleccionados, setTemasSeleccionados] = useState([]);
  const [contador, setContador] = useState(5);
  const [contadorTemas, setContadorTemas] = useState(100);
  const [contadorSubconceptos, setContadorSubconceptos] = useState(1000);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nombreNuevaCategoria, setNombreNuevaCategoria] = useState("");
  const [nombreNuevoTema, setNombreNuevoTema] = useState("");
  const [nombreNuevoSubconcepto, setNombreNuevoSubconcepto] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [mostrarTooltip, setMostrarTooltip] = useState(false);
  const [vistaActual, setVistaActual] = useState("categorias");
  const timeoutRef = useRef(null);

  const toggleTema = (temaId) => {
    const nuevaSeleccion = temasSeleccionados.includes(temaId) 
      ? temasSeleccionados.filter((id) => id !== temaId) 
      : [...temasSeleccionados, temaId];
    
    setTemasSeleccionados(nuevaSeleccion);
    
    // Convertir IDs de temas a nombres para el callback
    if (onSelectionChange) {
      const nombresDeTemasSeleccionados = convertirTemasANombres(nuevaSeleccion);
      onSelectionChange(nombresDeTemasSeleccionados);
    }
  };

  const convertirTemasANombres = (temasIds) => {
    const nombres = [];
    categorias.forEach(categoria => {
      categoria.temas.forEach(tema => {
        if (temasIds.includes(tema.id)) {
          nombres.push(tema.nombre);
        }
      });
    });
    return nombres;
  };

  const agregarNuevaCategoria = () => {
    if (nombreNuevaCategoria.trim()) {
      const nuevaCategoria = {
        id: contador.toString(),
        nombre: nombreNuevaCategoria.trim(),
        temas: [],
      };
      setCategorias([...categorias, nuevaCategoria]);
      setContador(contador + 1);
      setNombreNuevaCategoria("");
    }
  };

  const agregarNuevoTema = () => {
    if (nombreNuevoTema.trim() && categoriaSeleccionada) {
      const nuevoTema = {
        id: `${categoriaSeleccionada}-${contadorTemas}`,
        nombre: nombreNuevoTema.trim(),
        subconceptos: [],
      };

      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === categoriaSeleccionada ? { ...categoria, temas: [...categoria.temas, nuevoTema] } : categoria,
        ),
      );
      setContadorTemas(contadorTemas + 1);
      setNombreNuevoTema("");
    }
  };

  const agregarNuevoSubconcepto = () => {
    if (nombreNuevoSubconcepto.trim() && categoriaSeleccionada && temaSeleccionado) {
      const nuevoSubconcepto = {
        id: `${temaSeleccionado}-${contadorSubconceptos}`,
        nombre: nombreNuevoSubconcepto.trim(),
      };

      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === categoriaSeleccionada
            ? {
                ...categoria,
                temas: categoria.temas.map((tema) =>
                  tema.id === temaSeleccionado
                    ? { ...tema, subconceptos: [...tema.subconceptos, nuevoSubconcepto] }
                    : tema,
                ),
              }
            : categoria,
        ),
      );
      setContadorSubconceptos(contadorSubconceptos + 1);
      setNombreNuevoSubconcepto("");
    }
  };

  const eliminarTema = (temaId) => {
    if (categoriaSeleccionada) {
      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === categoriaSeleccionada
            ? { ...categoria, temas: categoria.temas.filter((tema) => tema.id !== temaId) }
            : categoria,
        ),
      );
      setTemasSeleccionados((prev) => prev.filter((id) => id !== temaId));

      if (temaSeleccionado === temaId) {
        setTemaSeleccionado(null);
        setVistaActual("temas");
      }
    }
  };

  const eliminarSubconcepto = (subconceptoId) => {
    if (categoriaSeleccionada && temaSeleccionado) {
      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === categoriaSeleccionada
            ? {
                ...categoria,
                temas: categoria.temas.map((tema) =>
                  tema.id === temaSeleccionado
                    ? {
                        ...tema,
                        subconceptos: tema.subconceptos.filter((subconcepto) => subconcepto.id !== subconceptoId),
                      }
                    : tema,
                ),
              }
            : categoria,
        ),
      );
    }
  };

  const eliminarCategoria = (categoriaId) => {
    setCategorias((prev) => prev.filter((categoria) => categoria.id !== categoriaId));
    if (categoriaSeleccionada === categoriaId) {
      setCategoriaSeleccionada(null);
      setTemaSeleccionado(null);
      setVistaActual("categorias");
    }
    const categoria = categorias.find((c) => c.id === categoriaId);
    if (categoria) {
      const temasIds = categoria.temas.map((t) => t.id);
      setTemasSeleccionados((prev) => prev.filter((id) => !temasIds.includes(id)));
    }
  };

  const manejarTeclaCategoria = (e) => {
    if (e.key === "Enter") {
      agregarNuevaCategoria();
    }
  };

  const manejarTeclaTema = (e) => {
    if (e.key === "Enter") {
      agregarNuevoTema();
    }
  };

  const manejarTeclaSubconcepto = (e) => {
    if (e.key === "Enter") {
      agregarNuevoSubconcepto();
    }
  };

  const categoriaActual = categorias.find((c) => c.id === categoriaSeleccionada);
  const temaActual = categoriaActual?.temas.find((t) => t.id === temaSeleccionado);

  const seleccionarCategoria = (categoriaId) => {
    setCategoriaSeleccionada(categoriaId);
    setTemaSeleccionado(null);
    setVistaActual("temas");
  };

  const seleccionarTema = (temaId) => {
    setTemaSeleccionado(temaId);
    setVistaActual("subconceptos");
  };

  const volverACategorias = () => {
    setCategoriaSeleccionada(null);
    setTemaSeleccionado(null);
    setVistaActual("categorias");
  };

  const volverATemas = () => {
    setTemaSeleccionado(null);
    setVistaActual("temas");
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

  // Dividir categorías en dos columnas
  const dividirEnColumnas = (items) => {
    const mitad = Math.ceil(items.length / 2);
    return [items.slice(0, mitad), items.slice(mitad)];
  };

  const [columnaIzquierda, columnaDerecha] = dividirEnColumnas(categorias);

  // Función para obtener el breadcrumb
  const obtenerBreadcrumb = () => {
    if (vistaActual === "categorias") return "";
    if (vistaActual === "temas" && categoriaActual) return categoriaActual.nombre;
    if (vistaActual === "subconceptos" && categoriaActual && temaActual) {
      return `${categoriaActual.nombre} > ${temaActual.nombre}`;
    }
    return "";
  };

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
                <TooltipTitle>Temas de Interés</TooltipTitle>
                <TooltipText>
                  Selecciona los temas específicos que deseas incluir en tu análisis. 
                  Cada tema está organizado por categorías y puede contener subconceptos más específicos. 
                  Puedes editar las categorías, temas y subconceptos usando el botón "Editar Temas".
                </TooltipText>
              </Tooltip>
            )}
          </div>
        </LeftSection>

        <CenterSection>
          <Title>Temas de Interés</Title>
        </CenterSection>

        <RightSection>
          <EditButton
            variant="secondary"
            size="medium"
            onClick={() => setModalAbierto(true)}
          >
            <EditIcon />
            Editar Temas
          </EditButton>
        </RightSection>
      </Header>

      {/* Modal */}
      {modalAbierto && (
        <ModalOverlay onClick={() => setModalAbierto(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Editar Temas</ModalTitle>
            </ModalHeader>

            <ModalBody>
              <NavigationContainer>
                <NavigationLeft>
                  {vistaActual !== "categorias" && (
                    <BackButton
                      onClick={vistaActual === "subconceptos" ? volverATemas : volverACategorias}
                    >
                      <ChevronLeftIcon />
                      {vistaActual === "subconceptos" ? "Volver a Temas" : "Volver a Categorías"}
                    </BackButton>
                  )}
                  <Breadcrumb>{obtenerBreadcrumb()}</Breadcrumb>
                </NavigationLeft>
              </NavigationContainer>

              <ContentContainer>
                <LeftColumn>
                  {/* Vista de categorías */}
                  {vistaActual === "categorias" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <SectionTitle>Categorías:</SectionTitle>
                        <ItemList>
                          {categorias.map((categoria) => (
                            <ItemContainer key={categoria.id}>
                              <DeleteButton
                                onClick={() => eliminarCategoria(categoria.id)}
                                title="Eliminar categoría"
                              >
                                <TrashIcon />
                              </DeleteButton>
                              <ItemButton
                                selected={categoriaSeleccionada === categoria.id}
                                onClick={() => seleccionarCategoria(categoria.id)}
                              >
                                <ItemName>{categoria.nombre}</ItemName>
                                <ItemCount>({categoria.temas.length})</ItemCount>
                              </ItemButton>
                            </ItemContainer>
                          ))}
                        </ItemList>
                      </div>

                      <div>
                        <SectionTitle>Nueva categoría:</SectionTitle>
                        <InputGroup>
                          <Input
                            type="text"
                            value={nombreNuevaCategoria}
                            onChange={(e) => setNombreNuevaCategoria(e.target.value)}
                            onKeyDown={manejarTeclaCategoria}
                            placeholder="Nombre de la categoría"
                          />
                          <Button 
                            onClick={agregarNuevaCategoria} 
                            disabled={!nombreNuevaCategoria.trim()}
                            size="compact"
                          >
                            <PlusCircleIcon />
                          </Button>
                        </InputGroup>
                      </div>
                    </div>
                  )}

                  {/* Vista de temas */}
                  {vistaActual === "temas" && categoriaActual && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <SectionTitle>Temas de "{categoriaActual.nombre}":</SectionTitle>
                        <ItemList>
                          {categoriaActual.temas.length > 0 ? (
                            categoriaActual.temas.map((tema) => (
                              <ItemContainer key={tema.id}>
                                <DeleteButton
                                  onClick={() => eliminarTema(tema.id)}
                                  title="Eliminar tema"
                                >
                                  <TrashIcon />
                                </DeleteButton>
                                <ItemButton
                                  selected={temaSeleccionado === tema.id}
                                  onClick={() => seleccionarTema(tema.id)}
                                >
                                  <ItemName>{tema.nombre}</ItemName>
                                  <ItemCount>({tema.subconceptos.length})</ItemCount>
                                </ItemButton>
                              </ItemContainer>
                            ))
                          ) : (
                            <EmptyState>No hay temas añadidos</EmptyState>
                          )}
                        </ItemList>
                      </div>

                      <div>
                        <SectionTitle>Nuevo tema:</SectionTitle>
                        <InputGroup>
                          <Input
                            type="text"
                            value={nombreNuevoTema}
                            onChange={(e) => setNombreNuevoTema(e.target.value)}
                            onKeyDown={manejarTeclaTema}
                            placeholder="Nombre del tema"
                          />
                          <Button 
                            onClick={agregarNuevoTema} 
                            disabled={!nombreNuevoTema.trim()}
                            size="compact"
                          >
                            <PlusCircleIcon />
                          </Button>
                        </InputGroup>
                      </div>
                    </div>
                  )}

                  {/* Vista de subconceptos */}
                  {vistaActual === "subconceptos" && temaActual && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <SectionTitle>Subconceptos de "{temaActual.nombre}":</SectionTitle>
                        <ItemList>
                          {temaActual.subconceptos.length > 0 ? (
                            temaActual.subconceptos.map((subconcepto) => (
                              <ItemContainer key={subconcepto.id}>
                                <span style={{ flex: 1, fontSize: '0.875rem', color: COLORS.text }}>
                                  {subconcepto.nombre}
                                </span>
                                <DeleteButton
                                  onClick={() => eliminarSubconcepto(subconcepto.id)}
                                  title="Eliminar subconcepto"
                                >
                                  <TrashIcon />
                                </DeleteButton>
                              </ItemContainer>
                            ))
                          ) : (
                            <EmptyState>No hay subconceptos añadidos</EmptyState>
                          )}
                        </ItemList>
                      </div>

                      <div>
                        <SectionTitle>Nuevo subconcepto:</SectionTitle>
                        <InputGroup>
                          <Input
                            type="text"
                            value={nombreNuevoSubconcepto}
                            onChange={(e) => setNombreNuevoSubconcepto(e.target.value)}
                            onKeyDown={manejarTeclaSubconcepto}
                            placeholder="Nombre del subconcepto"
                          />
                          <Button 
                            onClick={agregarNuevoSubconcepto} 
                            disabled={!nombreNuevoSubconcepto.trim()}
                            size="compact"
                          >
                            <PlusCircleIcon />
                          </Button>
                        </InputGroup>
                      </div>
                    </div>
                  )}
                </LeftColumn>

                <RightColumn>
                  <SectionTitle>Vista previa de la estructura:</SectionTitle>
                  <PreviewContainer>
                    {categorias.map((categoria) => (
                      <PreviewCategory key={categoria.id}>
                        <PreviewCategoryTitle>{categoria.nombre}</PreviewCategoryTitle>
                        <PreviewList>
                          {categoria.temas.map((tema) => (
                            <PreviewItem key={tema.id}>
                              <span>{tema.nombre}</span>
                              {tema.subconceptos.length > 0 && (
                                <PreviewSubList>
                                  {tema.subconceptos.map((subconcepto) => (
                                    <PreviewSubItem key={subconcepto.id}>
                                      {subconcepto.nombre}
                                    </PreviewSubItem>
                                  ))}
                                </PreviewSubList>
                              )}
                            </PreviewItem>
                          ))}
                        </PreviewList>
                      </PreviewCategory>
                    ))}
                  </PreviewContainer>
                  
                  <HelpContainer>
                    <HelpTitle>Ayuda</HelpTitle>
                    <HelpText>
                      Navega entre categorías, temas y subconceptos usando el panel izquierdo. 
                      Los subconceptos son detalles adicionales que no aparecerán en la vista principal, 
                      pero te ayudarán a organizar mejor tu información.
                    </HelpText>
                  </HelpContainer>
                </RightColumn>
              </ContentContainer>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Layout de checkboxes en dos columnas */}
      <CheckboxGrid>
        {/* Columna izquierda */}
        <div>
          {columnaIzquierda.map((categoria) => (
            <CategorySection key={categoria.id}>
              <CategoryTitle>{categoria.nombre}</CategoryTitle>
              <TemasContainer>
                {categoria.temas.map((tema) => (
                  <TemaItem key={tema.id}>
                    <Checkbox
                      type="checkbox"
                      id={tema.id}
                      checked={temasSeleccionados.includes(tema.id)}
                      onChange={() => toggleTema(tema.id)}
                    />
                    <TemaLabel htmlFor={tema.id}>
                      {tema.nombre}
                    </TemaLabel>
                  </TemaItem>
                ))}
              </TemasContainer>
            </CategorySection>
          ))}
        </div>

        {/* Columna derecha */}
        <div>
          {columnaDerecha.map((categoria) => (
            <CategorySection key={categoria.id}>
              <CategoryTitle>{categoria.nombre}</CategoryTitle>
              <TemasContainer>
                {categoria.temas.map((tema) => (
                  <TemaItem key={tema.id}>
                    <Checkbox
                      type="checkbox"
                      id={tema.id}
                      checked={temasSeleccionados.includes(tema.id)}
                      onChange={() => toggleTema(tema.id)}
                    />
                    <TemaLabel htmlFor={tema.id}>
                      {tema.nombre}
                    </TemaLabel>
                  </TemaItem>
                ))}
              </TemasContainer>
            </CategorySection>
          ))}
        </div>
      </CheckboxGrid>
    </Container>
  );
};

export default SeleccionTemas;
