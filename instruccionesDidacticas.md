# Instrucciones didacticas para formatear capitulos

Este documento explica como transformar un resumen crudo en un capitulo con componentes didacticos (ejercicios, flashcards, callouts, etc.) usando el sistema actual.

## 1. Reglas generales

- Escribe en Markdown y usa HTML solo para los bloques interactivos.
- Cada capitulo debe iniciar con un H1 (`#`) y luego usar H2 (`##`) para secciones.
- Usa lenguaje de codigo en bloques cercados para activar resaltado.
- Manten IDs unicos en todos los ejercicios.
- No dupliques titulos H2 iguales si quieres evitar IDs repetidos.

## 2. Estructura base recomendada

```md
# Titulo del capitulo — Capitulo N

## Introduccion

## Conceptos clave

## Explicacion detallada

## Ejemplos guiados

## Errores comunes

## Resumen

## Preguntas de practica

## Ejercicios
```

### 2.1 Clases automaticas por titulo H2

El renderer asigna clases visuales segun el texto del H2. Usa estas palabras para activar estilos:

- Contenga "preguntas" → `section-questions`
- Contenga "ejercicios" → `section-exercises`
- Contenga "concepto" → `section-concepts`
- Contenga "resumen" → `section-summary`
- Contenga "notas importantes" → `section-notes`
- Contenga "visualizacion" o "visualizacion" → `section-visual`

Ejemplo:

```md
## Preguntas de practica
## Ejercicios aplicados
## Concepto: normalizacion
## Resumen
## Notas importantes
## Visualizacion
```

## 3. Callouts (notas destacadas)

Los blockquotes se convierten en callouts con estilo. Usa los disparadores de texto:

- Contiene "⚠️" o "Regla de oro" → peligro
- Contiene "Nota Oracle" o "Nota:" → advertencia
- Contiene "💡" o "Conclusion" → tip
- Cualquier otro → info

Ejemplo:

```md
> 💡 Conclusion: la normalizacion reduce redundancia.

> Nota Oracle: en PL/SQL no se puede usar ROLLBACK en un trigger.

> ⚠️ Regla de oro: no mezclar funciones agregadas con columnas sin GROUP BY.
```

## 4. Bloques de codigo con resaltado

Usa fenced code blocks con lenguaje para activar resaltado:

```md
```sql
SELECT * FROM instructor;
```

```java
Connection cn = DriverManager.getConnection(url, user, pass);
```

```python
cursor.execute("SELECT * FROM dept")
```

```c
EXEC SQL SELECT salary INTO :host_var FROM instructor;
```
```

Lenguajes soportados: `sql`, `java`, `python`, `c`.

## 5. Tablas en Markdown

Las tablas se envuelven automaticamente con estilo:

```md
| Item | Descripcion |
|---|---|
| 1 | Normalizacion |
| 2 | Integridad |
```

## 6. Flashcards

Las flashcards se agregan con HTML dentro del Markdown.

Plantilla:

```html
<h4>🃏 Flashcards — Tema</h4>
<p class="flashcard-hint">Haz clic en cada tarjeta para ver la definicion</p>
<div class="flashcard-container">
  <div class="flashcard" onclick="this.classList.toggle('flipped')">
    <div class="flashcard-inner">
      <div class="flashcard-front"><div class="fc-label">Termino</div><div class="fc-term">DBMS</div></div>
      <div class="flashcard-back">Coleccion de datos + programas para accederlos.</div>
    </div>
  </div>
</div>
```

Reglas:
- Una tarjeta por concepto.
- Texto corto en el frente, definicion clara atras.

## 7. Ejercicios y quizzes (interactivos)

Todos los ejercicios usan `.quiz-card` y `data-quiz` unico. El feedback debe tener `id="fb-<id>"`.

### 7.1 Opcion multiple

```html
<div class="quiz-card" data-quiz="q5-1a">
  <div class="q-header"><span class="q-badge mc">Opcion multiple</span></div>
  <div class="q-text">Pregunta aqui...</div>
  <div class="quiz-options">
    <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Opcion A</span></div>
    <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Opcion B</span></div>
  </div>
  <div class="quiz-feedback" id="fb-q5-1a"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkQuiz('q5-1a','b','Correcto...','Incorrecto...')">Verificar</button>
  </div>
</div>
```

### 7.2 Verdadero / Falso

```html
<div class="quiz-card" data-quiz="q5-1b">
  <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
  <div class="q-text">Afirmacion aqui...</div>
  <div class="tf-options">
    <div class="tf-btn" onclick="selectTF(this,'q5-1b')" data-val="true">Verdadero</div>
    <div class="tf-btn" onclick="selectTF(this,'q5-1b')" data-val="false">Falso</div>
  </div>
  <div class="quiz-feedback" id="fb-q5-1b"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkTF('q5-1b','true','Correcto...','Incorrecto...')">Verificar</button>
  </div>
</div>
```

### 7.3 Completar (fill-in)

```html
<div class="quiz-card" data-quiz="q5-2a">
  <div class="q-header"><span class="q-badge fill">Completar</span></div>
  <div class="q-text">Completa la sentencia:</div>
  <div class="fill-ex">
    SELECT <input id="fill5-1" class="fill-input" data-answer="COUNT">(*) FROM instructor;
  </div>
  <div class="quiz-feedback" id="fb-q5-2a"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkFill('q5-2a',['fill5-1'])">Verificar</button>
  </div>
</div>
```

### 7.4 SQL libre (respuesta abierta)

```html
<div class="quiz-card" data-quiz="sql5-1">
  <div class="q-header"><span class="q-badge sql">SQL libre</span></div>
  <div class="q-text">Escribe la consulta...</div>
  <textarea id="sql5-1" class="code-editor" rows="6"></textarea>
  <div class="quiz-feedback" id="fb-sql5-1"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkSQL('sql5-1',['select','from','where|join'])">Verificar</button>
    <button class="btn btn-secondary" onclick="showAnswer('sql5-1','SELECT ...')">Ver respuesta</button>
  </div>
</div>
```

### 7.5 Emparejar

```html
<div class="quiz-card" data-quiz="match5-1">
  <div class="q-header"><span class="q-badge match">Emparejar</span></div>
  <div class="q-text">Relaciona conceptos con definiciones:</div>
  <div class="match-exercise" id="match5-1">
    <div class="match-cols">
      <div class="match-col">
        <h4>Concepto</h4>
        <div class="match-item" data-match="left" data-pair="1" onclick="selectMatch(this,'match5-1')">ROLLUP</div>
        <div class="match-item" data-match="left" data-pair="2" onclick="selectMatch(this,'match5-1')">CUBE</div>
      </div>
      <div class="match-col">
        <h4>Definicion</h4>
        <div class="match-item" data-match="right" data-pair="2" onclick="selectMatch(this,'match5-1')">Subtotales para todas las combinaciones</div>
        <div class="match-item" data-match="right" data-pair="1" onclick="selectMatch(this,'match5-1')">Subtotales jerarquicos</div>
      </div>
    </div>
  </div>
  <div class="quiz-feedback" id="fb-match5-1"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkMatch('match5-1')">Verificar</button>
    <button class="btn btn-secondary" onclick="resetMatch('match5-1')">Reiniciar</button>
  </div>
</div>
```

## 8. Convenciones de IDs

Para evitar colisiones entre capitulos:

- Usa prefijo por capitulo: `q5-1a`, `sql5-2`, `match5-3`.
- Para inputs de completar: `fill5-1`, `fill5-2`.
- Feedback siempre: `fb-<id-del-quiz>`.

## 9. Checklist rapido

- [ ] H1 inicial con titulo del capitulo.
- [ ] Secciones H2 claras y en orden.
- [ ] IDs unicos en quizzes y inputs.
- [ ] Feedback `fb-...` presente.
- [ ] Botones `Verificar` con la funcion correcta.
- [ ] Codigo con lenguaje especificado.
- [ ] Callouts con texto disparador correcto.

## 10. Plantilla minima completa

```md
# Titulo del capitulo — Capitulo N

## Introduccion
Texto inicial...

## Conceptos clave
- Punto 1
- Punto 2

> 💡 Conclusion: idea clave del capitulo.

## Ejemplos guiados
```sql
SELECT * FROM tabla;
```

## Preguntas de practica
<div class="quiz-card" data-quiz="qN-1a">
  <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
  <div class="q-text">SQL es declarativo.</div>
  <div class="tf-options">
    <div class="tf-btn" onclick="selectTF(this,'qN-1a')" data-val="true">Verdadero</div>
    <div class="tf-btn" onclick="selectTF(this,'qN-1a')" data-val="false">Falso</div>
  </div>
  <div class="quiz-feedback" id="fb-qN-1a"></div>
  <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('qN-1a','true','Correcto.','Incorrecto.')">Verificar</button></div>
</div>

## Ejercicios
<h4>🃏 Flashcards — Terminos</h4>
<p class="flashcard-hint">Haz clic en cada tarjeta para ver la definicion</p>
<div class="flashcard-container">
  <div class="flashcard" onclick="this.classList.toggle('flipped')">
    <div class="flashcard-inner">
      <div class="flashcard-front"><div class="fc-label">Termino</div><div class="fc-term">DDL</div></div>
      <div class="flashcard-back">Lenguaje de definicion de datos.</div>
    </div>
  </div>
</div>
```
