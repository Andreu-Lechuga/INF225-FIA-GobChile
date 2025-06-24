NFORME DE CORRECCIÓN DE QUALITY ISSUE – USO DE OPTIONAL CHAINING (?.)

Descripción del error:
Durante una inspección con SonarQube, se detectó un problema de mantenibilidad relacionado con el uso de una verificación manual al acceder a propiedades anidadas en un objeto. El mensaje reportado fue:
"Prefer using an optional chain expression instead, as it's more concise and easier to read."

Este mensaje sugiere que se evite el uso de expresiones como:
if (result && result.articles) { ... }

Este patrón puede funcionar, pero es menos claro y más propenso a errores cuando se trabaja con objetos que pueden ser undefined o null.

Severidad e impacto:

- Severidad: Media

-Categoría afectada: Mantenibilidad del software

-Justificación: Usar validaciones manuales aumenta la complejidad del código y puede dificultar su lectura y mantenimiento.

-Solución aplicada:
Se reemplazó la verificación manual por una expresión más moderna y segura utilizando el operador de encadenamiento opcional (optional chaining).

Código original:
if (result && result.articles) {
setNews(result.articles);
}

Código corregido:
if (result?.articles) {
setNews(result.articles);
}

Explicación:
El operador "?."

Verifica automáticamente si "result" es null o undefined antes de acceder a "articles".

Hace el código más conciso y menos propenso a errores.

Mejora la legibilidad y mantiene el comportamiento esperado.

Cumple con las buenas prácticas modernas recomendadas por herramientas como SonarQube y ESLint.

Resultado:
Después de aplicar la corrección, el issue desapareció de SonarQube y se redujo el número de problemas de mantenibilidad registrados.

Ruta del error: \boletin-app\src\api\hooks\useNewsCatcher