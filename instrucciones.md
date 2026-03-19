# Instrucciones Técnicas para Integrar un Nuevo Capítulo como Componente Web

## 1. Propósito de esta guía

Este documento define el procedimiento técnico para integrar un nuevo capítulo en la plataforma web del proyecto.

Objetivo: que un agente automático pueda agregar un capítulo nuevo y dejarlo operativo en:
- navegación lateral
- carga dinámica en la página
- tabla de contenidos (TOC)
- progreso y ejercicios interactivos

Esta guía no explica cómo redactar el capítulo desde cero, sino cómo conectarlo correctamente al sistema web existente.

## 2. Arquitectura actual (resumen operativo)

La plataforma usa capítulos modulares cargados dinámicamente.

Piezas clave:
- `content/chapters/*.md`: fuente de contenido por capítulo.
- `content/chapters.json`: registro maestro de capítulos (metadatos + ruta de archivo).
- `capitulo.html` e `index.html`: contenedores de render dinámico.
- `js/chapter-app.js`: carga JSON, renderiza capítulo, sidebar, TOC y navegación prev/next.
- `js/markdown-renderer.js`: transforma Markdown a HTML y construye TOC.
- `js/quiz-engine.js`: lógica de quizzes (`checkQuiz`, `checkTF`, `checkSQL`, etc.).

## 3. Contrato del componente capítulo

Para que un capítulo funcione como componente web, debe cumplir este contrato:

1. Existir como archivo `.md` dentro de `content/chapters/`.
2. Estar declarado en `content/chapters.json` con `type: "markdown"`.
3. Tener `id` único y estable.
4. Tener `number` correcto para el orden de navegación.
5. Incluir headings válidos para TOC (recomendado: `##` y `###`).
6. Si contiene ejercicios interactivos, respetar los `data-quiz` e IDs esperados por `quiz-engine.js`.

## 4. Proceso de integración (paso a paso)

### Paso 1: Crear el archivo del capítulo

Ubicación:
- `content/chapters/capitulo-N.md`

Convención recomendada:
- usar nombre slug consistente (`capitulo-6.md`, `capitulo-7.md`, etc.)
- no usar espacios en el nombre de archivo

### Paso 2: Estructurar el contenido para render dinámico

El capítulo debe iniciar con un heading principal `#` para que el renderer construya cabecera correctamente.

Plantilla mínima compatible:

```md
# Título del capítulo — Capítulo N

## Introducción

## Conceptos clave

## Explicación detallada

## Sintaxis y comandos SQL

## Ejemplos paso a paso

## Buenas prácticas

## Errores comunes

## Resumen

## Preguntas de práctica
```

Notas:
- `##` genera secciones navegables.
- `###` genera subniveles de TOC.
- evitar saltarse jerarquía de títulos.

### Paso 3: Registrar el capítulo en `chapters.json`

Agregar un nuevo objeto en `content/chapters.json` con este formato:

```json
{
    "id": "capitulo-N",
    "number": N,
    "title": "Título visible",
    "description": "Descripción breve",
    "file": "content/chapters/capitulo-N.md",
    "type": "markdown"
}
```

Reglas críticas:
- `id` no puede repetirse.
- `number` debe ser correlativo para prev/next.
- `file` debe apuntar a ruta real existente.
- no usar `type: "static"` para capítulos nuevos.

### Paso 4: Verificar carga en UI

Probar URL:
- `capitulo.html?id=capitulo-N`

Validar que:
- renderiza contenido sin error.
- aparece en sidebar.
- la navegación prev/next es correcta.
- el título superior se actualiza.
- TOC lateral detecta secciones.

### Paso 5: Integrar ejercicios interactivos (si aplica)

Si el capítulo incluye quizzes, usar estructura compatible con `quiz-engine.js`.

Requisitos mínimos:
- cada bloque: `<div class="quiz-card" data-quiz="id-unico">`
- feedback: `id="fb-id-unico"`
- IDs únicos por capítulo para evitar colisiones globales

Patrones soportados:
- Opción múltiple: `selectOpt`, `checkQuiz`
- Verdadero/Falso: `selectTF`, `checkTF`
- Completar: `checkFill`
- SQL libre: `checkSQL`, `showAnswer`
- Matching: `selectMatch`, `checkMatch`, `resetMatch`

Convención recomendada para IDs:
- prefijo por capítulo, ejemplo: `q6-1a`, `code6-2`, `match6-3`

### Paso 6: Validar estilos y componentes visuales

El contenido debe usar clases existentes de `css/styles.css` para mantener consistencia:
- `callout info|warning|danger|tip`
- `table-wrap`
- `quiz-card`
- `flashcard-container` y `flashcard` (si aplica)

No crear estilos inline innecesarios salvo casos puntuales.

## 5. Errores frecuentes de integración

- ID duplicado en `chapters.json`.
- `file` apuntando a una ruta incorrecta.
- `number` fuera de secuencia (rompe prev/next esperado).
- capítulo sin `#` inicial (cabecera inconsistente).
- títulos sin `##` (TOC vacío o pobre).
- `data-quiz` repetido entre capítulos (feedback cruzado).
- uso de funciones de quiz sin estructura HTML requerida.

## 6. Checklist técnico final

Antes de cerrar la integración, confirmar:

- [ ] Existe `content/chapters/capitulo-N.md` y abre sin errores.
- [ ] El capítulo está registrado en `content/chapters.json`.
- [ ] `id`, `number` y `file` son correctos y únicos.
- [ ] Se visualiza en `capitulo.html?id=capitulo-N`.
- [ ] Sidebar muestra el capítulo con el orden correcto.
- [ ] TOC lateral funciona (secciones y subsecciones).
- [ ] Navegación prev/next apunta a capítulos correctos.
- [ ] Si hay quizzes, todos responden y actualizan progreso.
- [ ] No hay colisión de IDs (`data-quiz`, `fb-*`, inputs, match IDs).
- [ ] No hay errores de consola por funciones inexistentes o selectores nulos.

## 7. Plantilla rápida de alta

Usar este bloque como guía rápida para un nuevo capítulo:

1. Crear archivo:
- `content/chapters/capitulo-N.md`

2. Escribir heading principal:
- `# Título — Capítulo N`

3. Añadir al JSON:
- `id: "capitulo-N"`
- `number: N`
- `file: "content/chapters/capitulo-N.md"`
- `type: "markdown"`

4. Probar:
- `capitulo.html?id=capitulo-N`

5. Validar checklist técnico.
