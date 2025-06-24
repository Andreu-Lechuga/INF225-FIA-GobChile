# Migración y Compatibilización del Componente SeleccionFuentes

## Resumen

Este documento describe la migración del componente `SeleccionFuentes.js` desde una implementación externa (Next.js + Tailwind + Lucide React) hacia la arquitectura y dependencias del proyecto actual (React + styled-components).

## Cambios Realizados

### 1. Eliminación de Dependencias Incompatibles

#### Antes (Incompatible):
```javascript
"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle, Check, Edit, Trash2, Info } from "lucide-react"
```

#### Después (Compatible):
```javascript
import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';
import Card from './Card';
import { COLORS, BREAKPOINTS, SPACING, SHADOWS } from '../../utils/constants';
```

### 2. Reemplazo de Iconos

- **Eliminado**: `lucide-react` (no estaba en package.json)
- **Implementado**: Iconos SVG inline personalizados
- **Iconos incluidos**: PlusCircle, Check, Edit, Trash2, Info

### 3. Sistema de Estilos

#### Antes (Tailwind CSS):
```javascript
className="w-full max-w-3xl mx-auto relative"
className="flex items-center justify-center mb-4 relative"
```

#### Después (styled-components):
```javascript
const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${SPACING.lg};
  position: relative;
`;
```

### 4. Modal Personalizado

- **Eliminado**: Componente `Dialog` (no existía en el proyecto)
- **Implementado**: Modal personalizado con styled-components
- **Características**: Overlay, cierre por clic fuera, estructura responsive

### 5. Sistema de Colores y Constantes

- **Creado**: `src/utils/constants.js` con sistema de colores unificado
- **Integrado**: Colores consistentes con el resto del proyecto
- **Incluye**: Breakpoints, espaciado, sombras

## Archivos Creados/Modificados

### Nuevos Archivos:
1. `src/utils/constants.js` - Sistema de constantes del proyecto
2. `src/pages/EjemploSeleccionFuentes.js` - Página de ejemplo de uso
3. `docs/SELECCION-FUENTES-MIGRATION.md` - Esta documentación

### Archivos Modificados:
1. `src/components/ui/SeleccionFuentes.js` - Componente completamente refactorizado
2. `src/components/ui/index.js` - Exportación del nuevo componente

## Uso del Componente

### Importación:
```javascript
import { SeleccionFuentes } from '../components/ui';
```

### Uso Básico:
```javascript
const [fuentesSeleccionadas, setFuentesSeleccionadas] = useState([]);

const handleSelectionChange = (seleccionadas) => {
  setFuentesSeleccionadas(seleccionadas);
  console.log('Fuentes seleccionadas:', seleccionadas);
};

<SeleccionFuentes
  fuentesIniciales={misFuentes}
  onSelectionChange={handleSelectionChange}
/>
```

### Props del Componente:

| Prop | Tipo | Descripción | Requerido |
|------|------|-------------|-----------|
| `fuentesIniciales` | Array | Array de objetos con estructura `{id, nombre, urls}` | No (tiene valores por defecto) |
| `onSelectionChange` | Function | Callback que recibe array de IDs seleccionados | No |

### Estructura de Datos:
```javascript
const fuentesEjemplo = [
  {
    id: "1",
    nombre: "Agricultura",
    urls: [
      "https://www.minagri.gob.cl",
      "https://www.odepa.gob.cl"
    ]
  },
  // ... más fuentes
];
```

## Características del Componente

### Funcionalidades:
- ✅ Selección múltiple de categorías de fuentes
- ✅ Edición de categorías (agregar/eliminar)
- ✅ Gestión de URLs por categoría
- ✅ Modal de edición con interfaz intuitiva
- ✅ Tooltip informativo
- ✅ Responsive design
- ✅ Integración con sistema de colores del proyecto

### Responsive Design:
- **Desktop**: Grid de 4 columnas
- **Mobile**: Columna única (< 600px)
- **Modal**: Adaptable a diferentes tamaños de pantalla

### Accesibilidad:
- Tooltips informativos
- Títulos descriptivos en botones
- Navegación por teclado (Enter para agregar)
- Estados visuales claros (hover, focus, selected)

## Integración con el Proyecto

### Dependencias Utilizadas:
- ✅ `react` (18.2.0) - Framework principal
- ✅ `styled-components` (5.3.9) - Estilos CSS-in-JS
- ✅ Componentes UI existentes (`Button`, `Card`)
- ✅ Sistema de constantes unificado

### Patrones Seguidos:
- ✅ Exportación por defecto
- ✅ Documentación JSDoc
- ✅ Estructura de styled-components consistente
- ✅ Nomenclatura en español
- ✅ Responsive design con breakpoints del proyecto

## Testing

### Para probar el componente:

1. **Ejecutar el proyecto**:
   ```bash
   cd INF225_2025_1/boletin-app
   npm start
   ```

2. **Navegar a la página de ejemplo**:
   - Agregar ruta en el router hacia `/ejemplo-fuentes`
   - O importar directamente en una página existente

3. **Funcionalidades a probar**:
   - Selección/deselección de fuentes
   - Botón "Seleccionar Todo"
   - Modal de edición
   - Agregar/eliminar categorías
   - Agregar/eliminar URLs
   - Tooltip informativo
   - Responsive design

## Próximos Pasos

### Posibles Mejoras:
1. **Validación de URLs**: Agregar validación de formato de URLs
2. **Persistencia**: Integrar con localStorage o base de datos
3. **Drag & Drop**: Permitir reordenar categorías
4. **Búsqueda**: Filtro de búsqueda en categorías
5. **Importar/Exportar**: Funcionalidad para importar/exportar configuraciones

### Integración con Formularios:
```javascript
// Ejemplo con Formik
import { Formik, Form } from 'formik';

<Formik
  initialValues={{ fuentes: [] }}
  onSubmit={(values) => console.log(values)}
>
  {({ setFieldValue }) => (
    <Form>
      <SeleccionFuentes
        onSelectionChange={(seleccionadas) => 
          setFieldValue('fuentes', seleccionadas)
        }
      />
    </Form>
  )}
</Formik>
```

## Conclusión

La migración del componente `SeleccionFuentes` ha sido exitosa, manteniendo toda la funcionalidad original mientras se adapta completamente a la arquitectura del proyecto. El componente ahora es:

- ✅ **Compatible** con todas las dependencias del proyecto
- ✅ **Consistente** con los patrones de diseño establecidos
- ✅ **Reutilizable** y fácil de integrar
- ✅ **Documentado** y con ejemplos de uso
- ✅ **Responsive** y accesible

El componente está listo para ser utilizado en cualquier parte del proyecto sin conflictos de dependencias.
