import React from 'react';
import styled, { css } from 'styled-components';
import { COLORS } from '../../utils/constants';

// Estilos base para las tablas
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

// Componente Table estilizado
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  
  ${props => props.striped && css`
    tr:nth-child(even) {
      background-color: rgba(0, 0, 0, 0.02);
    }
  `}
  
  ${props => props.hoverable && css`
    tbody tr:hover {
      background-color: rgba(52, 152, 219, 0.05);
    }
  `}
  
  ${props => props.bordered && css`
    border: 1px solid #e0e0e0;
    
    th, td {
      border: 1px solid #e0e0e0;
    }
  `}
  
  ${props => props.compact && css`
    th, td {
      padding: 8px 12px;
    }
  `}
`;

// Componente TableHead estilizado
const StyledThead = styled.thead`
  background-color: ${COLORS.primary};
  color: white;
  
  ${props => props.light && css`
    background-color: #f5f5f5;
    color: ${COLORS.primary};
  `}
`;

// Componente TableHeader estilizado
const StyledTh = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: 600;
  
  ${props => props.center && css`
    text-align: center;
  `}
  
  ${props => props.right && css`
    text-align: right;
  `}
  
  ${props => props.width && css`
    width: ${props.width};
  `}
`;

// Componente TableBody estilizado
const StyledTbody = styled.tbody``;

// Componente TableRow estilizado
const StyledTr = styled.tr`
  border-bottom: 1px solid #e0e0e0;
  
  ${props => props.active && css`
    background-color: rgba(52, 152, 219, 0.1) !important;
  `}
  
  ${props => props.clickable && css`
    cursor: pointer;
  `}
`;

// Componente TableCell estilizado
const StyledTd = styled.td`
  padding: 15px;
  
  ${props => props.center && css`
    text-align: center;
  `}
  
  ${props => props.right && css`
    text-align: right;
  `}
  
  ${props => props.nowrap && css`
    white-space: nowrap;
  `}
`;

// Componente para cuando no hay datos
const EmptyMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${COLORS.text};
  font-style: italic;
`;

/**
 * Componente Table
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.striped - Si la tabla debe tener filas alternadas
 * @param {boolean} props.hoverable - Si las filas deben cambiar al pasar el ratón
 * @param {boolean} props.bordered - Si la tabla debe tener bordes
 * @param {boolean} props.compact - Si la tabla debe ser compacta
 * @param {React.ReactNode} props.children - Contenido de la tabla
 * @returns {React.ReactElement} - Elemento React
 */
const Table = ({ 
  striped = false, 
  hoverable = true, 
  bordered = false, 
  compact = false, 
  children, 
  ...props 
}) => {
  return (
    <TableContainer>
      <StyledTable
        striped={striped}
        hoverable={hoverable}
        bordered={bordered}
        compact={compact}
        {...props}
      >
        {children}
      </StyledTable>
    </TableContainer>
  );
};

/**
 * Componente para renderizar una tabla con datos
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.columns - Array de objetos con las columnas
 * @param {Array} props.data - Array de objetos con los datos
 * @param {string} props.emptyMessage - Mensaje a mostrar cuando no hay datos
 * @param {Function} props.onRowClick - Función a ejecutar al hacer clic en una fila
 * @param {boolean} props.striped - Si la tabla debe tener filas alternadas
 * @param {boolean} props.hoverable - Si las filas deben cambiar al pasar el ratón
 * @param {boolean} props.bordered - Si la tabla debe tener bordes
 * @param {boolean} props.compact - Si la tabla debe ser compacta
 * @param {boolean} props.lightHeader - Si el encabezado debe ser claro
 * @returns {React.ReactElement} - Elemento React
 */
const DataTable = ({ 
  columns, 
  data, 
  emptyMessage = 'No hay datos disponibles', 
  onRowClick, 
  striped = false, 
  hoverable = true, 
  bordered = false, 
  compact = false, 
  lightHeader = false 
}) => {
  if (!data || data.length === 0) {
    return <EmptyMessage>{emptyMessage}</EmptyMessage>;
  }
  
  return (
    <TableContainer>
      <StyledTable
        striped={striped}
        hoverable={hoverable}
        bordered={bordered}
        compact={compact}
      >
        <StyledThead light={lightHeader}>
          <tr>
            {columns.map((column, index) => (
              <StyledTh
                key={index}
                center={column.center}
                right={column.right}
                width={column.width}
              >
                {column.header}
              </StyledTh>
            ))}
          </tr>
        </StyledThead>
        <StyledTbody>
          {data.map((row, rowIndex) => (
            <StyledTr
              key={rowIndex}
              clickable={!!onRowClick}
              onClick={() => onRowClick && onRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <StyledTd
                  key={colIndex}
                  center={column.center}
                  right={column.right}
                  nowrap={column.nowrap}
                >
                  {column.render ? column.render(row, rowIndex) : row[column.accessor]}
                </StyledTd>
              ))}
            </StyledTr>
          ))}
        </StyledTbody>
      </StyledTable>
    </TableContainer>
  );
};

// Exportar componentes
Table.Head = StyledThead;
Table.Header = StyledTh;
Table.Body = StyledTbody;
Table.Row = StyledTr;
Table.Cell = StyledTd;
Table.Data = DataTable;

export default Table;
