INFORME DE CORRECCIÓN DE QUALITY ISSUE – VALIDACIÓN DE PROPS CON PROPTYPES

Descripción del error:
Durante una inspección realizada con SonarQube, se detectó un problema de validación de propiedades (props) en un componente de React. El mensaje fue:
"'backgroundColor' is missing in props validation".

Justificación del problema:
En JavaScript, los componentes de React pueden recibir props sin validación de tipo. Esto puede ocasionar errores difíciles de detectar y hace que el código sea menos claro. En este caso, el componente estaba usando la prop backgroundColor sin especificar su tipo en propTypes.

Severidad e impacto:

-Impacto bajo en la confiabilidad del software.

-Impacto medio en la mantenibilidad del software.

Riesgo: Puede generar confusión sobre qué props acepta el componente y qué tipo de valores se esperan.

Código original:
El componente Card recibía props como backgroundColor, variant, fullWidth, etc., pero no incluía ningún tipo de validación con PropTypes.

Solución aplicada:
Se agregó una declaración de propTypes para el componente Card, donde se especifica el tipo esperado para cada prop. Esto incluye backgroundColor como una cadena (PropTypes.string), entre otros.

Código corregido:
import PropTypes from 'prop-types';

Card.propTypes = {
variant: PropTypes.oneOf(['default', 'compact', 'borderless', 'elevated', 'outlined']),
fullWidth: PropTypes.bool,
maxWidth: PropTypes.string,
backgroundColor: PropTypes.string,
children: PropTypes.node,
};

Cómo esta solución corrige el problema:

-Establece claramente qué props acepta el componente.

-Garantiza que las props tengan el tipo esperado.

-Permite detectar errores de uso en tiempo de desarrollo.

-Mejora la documentación interna del componente.

-Elimina el issue detectado por SonarQube.

Resultado:
Luego de aplicar la corrección y ejecutar nuevamente la inspección con SonarQube, el issue fue eliminado y se redujo el número total de problemas de calidad en el software.

Ruta del error: \boletin-app\src\components\ui\Card