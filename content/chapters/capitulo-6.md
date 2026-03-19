# Diseno de Bases de Datos con el Modelo E-R — Capitulo 6

## Introduccion

En este capitulo aprenderas a pasar de una descripcion del negocio a un modelo entidad-relacion (E-R) claro, sin redundancia y facil de convertir a tablas.

> Conclusion: un buen diseno conceptual reduce errores costosos en implementacion.

## Conceptos clave

| Concepto | Idea central | Ejemplo rapido |
|---|---|---|
| Entidad | Objeto del dominio que se quiere almacenar | `student`, `course` |
| Atributo | Propiedad de una entidad o relacion | `student.name` |
| Relacion | Asociacion entre entidades | `advisor(student, instructor)` |
| Cardinalidad | Cuantos elementos se conectan | 1:1, 1:N, N:M |
| Entidad debil | Depende de otra para identificarse | `section` depende de `course` |

> Regla de oro: si modelas una relacion importante como texto libre, luego no podras validarla bien.

## Explicacion detallada

### Fase 1: levantar requisitos

Primero se identifica que datos existen, quienes los usan y que preguntas debe responder la base de datos.

### Fase 2: diseno conceptual con E-R

Se dibujan entidades, relaciones, claves y restricciones de participacion.

### Fase 3: paso a esquema relacional

Cada entidad fuerte se convierte en una tabla y cada relacion se transforma segun su cardinalidad.

### Fase 4: refinamiento

Se revisa redundancia, consistencia y claridad semantica.

> Nota: modelar bien en esta etapa evita migraciones complejas despues.

## Ejemplos guiados

### Ejemplo 1: entidad y relacion

```sql
CREATE TABLE student (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE instructor (
  id INT PRIMARY KEY,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE advisor (
  s_id INT PRIMARY KEY,
  i_id INT NOT NULL,
  FOREIGN KEY (s_id) REFERENCES student(id),
  FOREIGN KEY (i_id) REFERENCES instructor(id)
);
```

### Ejemplo 2: acceso desde Java

```java
String sql = "SELECT s.id, s.name, a.i_id FROM student s JOIN advisor a ON a.s_id = s.id";
PreparedStatement ps = cn.prepareStatement(sql);
ResultSet rs = ps.executeQuery();
```

### Ejemplo 3: validacion rapida en Python

```python
rows = cursor.execute("SELECT course_id, title FROM course").fetchall()
for r in rows:
    print(r)
```

### Ejemplo 4: host variables estilo C

```c
EXEC SQL SELECT salary INTO :salary_host
FROM instructor
WHERE id = :id_host;
```

## Errores comunes

- Convertir todo en una sola tabla gigante.
- Usar relaciones N:M sin tabla intermedia.
- No definir claves primarias ni foraneas.
- Duplicar datos descriptivos en varias tablas.
- No diferenciar entidad fuerte de entidad debil.

> Nota Oracle: define primero claves y restricciones antes de cargar datos masivos.

## Resumen

- El modelo E-R traduce reglas del negocio a estructura de datos.
- Las cardinalidades guian el diseno de claves.
- Un buen diseno minimiza redundancia y mejora mantenimiento.
- La conversion E-R a relacional debe ser sistematica.

## Preguntas de practica

<div class="quiz-card" data-quiz="q6-1a">
  <div class="q-header"><span class="q-badge mc">Opcion multiple</span></div>
  <div class="q-text">En una relacion 1:N, la clave foranea suele colocarse en:</div>
  <div class="quiz-options">
    <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>El lado 1</span></div>
    <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>El lado N</span></div>
    <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>En una tabla sin relacion</span></div>
  </div>
  <div class="quiz-feedback" id="fb-q6-1a"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkQuiz('q6-1a','b','Correcto: el lado N referencia al lado 1.','Incorrecto: revisa la regla de transformacion 1:N.')">Verificar</button>
  </div>
</div>

<div class="quiz-card" data-quiz="q6-1b">
  <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
  <div class="q-text">Una entidad debil puede identificarse sin la clave de su entidad fuerte.</div>
  <div class="tf-options">
    <div class="tf-btn" onclick="selectTF(this,'q6-1b')" data-val="true">Verdadero</div>
    <div class="tf-btn" onclick="selectTF(this,'q6-1b')" data-val="false">Falso</div>
  </div>
  <div class="quiz-feedback" id="fb-q6-1b"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkTF('q6-1b','false','Correcto: depende de la entidad identificadora.','Incorrecto: una entidad debil necesita clave de la fuerte + discriminador.')">Verificar</button>
  </div>
</div>

<div class="quiz-card" data-quiz="q6-2a">
  <div class="q-header"><span class="q-badge fill">Completar</span></div>
  <div class="q-text">Completa la consulta para contar estudiantes:</div>
  <div class="fill-ex">
    SELECT <input id="fill6-1" class="fill-input" data-answer="COUNT">(*) FROM student;
  </div>
  <div class="quiz-feedback" id="fb-q6-2a"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkFill('q6-2a',['fill6-1'])">Verificar</button>
  </div>
</div>

<div class="quiz-card" data-quiz="sql6-1">
  <div class="q-header"><span class="q-badge sql">SQL libre</span></div>
  <div class="q-text">Escribe una consulta que obtenga estudiantes con su asesor usando JOIN.</div>
  <textarea id="sql6-1" class="code-editor" rows="6" placeholder="Escribe tu SQL aqui..."></textarea>
  <div class="quiz-feedback" id="fb-sql6-1"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkSQL('sql6-1',['select','from','join'])">Verificar</button>
    <button class="btn btn-secondary" onclick="showAnswer('sql6-1','SELECT s.id, s.name, a.i_id FROM student s JOIN advisor a ON a.s_id = s.id;')">Ver respuesta</button>
  </div>
</div>

## Ejercicios

### Emparejar conceptos

<div class="quiz-card" data-quiz="match6-1">
  <div class="q-header"><span class="q-badge match">Emparejar</span></div>
  <div class="q-text">Relaciona cada concepto con su definicion:</div>
  <div class="match-exercise" id="match6-1">
    <div class="match-cols">
      <div class="match-col">
        <h4>Concepto</h4>
        <div class="match-item" data-match="left" data-pair="1" onclick="selectMatch(this,'match6-1')">Entidad debil</div>
        <div class="match-item" data-match="left" data-pair="2" onclick="selectMatch(this,'match6-1')">Cardinalidad</div>
        <div class="match-item" data-match="left" data-pair="3" onclick="selectMatch(this,'match6-1')">Relacion N:M</div>
      </div>
      <div class="match-col">
        <h4>Definicion</h4>
        <div class="match-item" data-match="right" data-pair="2" onclick="selectMatch(this,'match6-1')">Indica cuantos elementos se asocian entre si</div>
        <div class="match-item" data-match="right" data-pair="3" onclick="selectMatch(this,'match6-1')">Se implementa con tabla intermedia</div>
        <div class="match-item" data-match="right" data-pair="1" onclick="selectMatch(this,'match6-1')">Necesita entidad identificadora para su clave</div>
      </div>
    </div>
  </div>
  <div class="quiz-feedback" id="fb-match6-1"></div>
  <div class="quiz-actions">
    <button class="btn btn-primary" onclick="checkMatch('match6-1')">Verificar</button>
    <button class="btn btn-secondary" onclick="resetMatch('match6-1')">Reiniciar</button>
  </div>
</div>

### Flashcards de repaso

<h4>Flashcards — Modelo E-R</h4>
<p class="flashcard-hint">Haz clic en cada tarjeta para ver la definicion</p>
<div class="flashcard-container">
  <div class="flashcard" onclick="this.classList.toggle('flipped')">
    <div class="flashcard-inner">
      <div class="flashcard-front"><div class="fc-label">Termino</div><div class="fc-term">Entidad</div></div>
      <div class="flashcard-back">Objeto del dominio que se modela en la base de datos.</div>
    </div>
  </div>
  <div class="flashcard" onclick="this.classList.toggle('flipped')">
    <div class="flashcard-inner">
      <div class="flashcard-front"><div class="fc-label">Termino</div><div class="fc-term">Clave primaria</div></div>
      <div class="flashcard-back">Atributo o conjunto minimo que identifica de forma unica cada fila.</div>
    </div>
  </div>
  <div class="flashcard" onclick="this.classList.toggle('flipped')">
    <div class="flashcard-inner">
      <div class="flashcard-front"><div class="fc-label">Termino</div><div class="fc-term">Entidad debil</div></div>
      <div class="flashcard-back">Entidad que depende de otra para existir y para formar su identificador.</div>
    </div>
  </div>
</div>

## Notas importantes

- Define primero claves y cardinalidades, luego columnas secundarias.
- Si hay duda entre atributo y entidad, pregunta si requiere vida propia y relaciones.
- Valida siempre el modelo con casos reales del negocio.

## Visualizacion

| Paso | Entrada | Salida |
|---|---|---|
| 1 | Requisitos del negocio | Lista de entidades y reglas |
| 2 | Diagrama E-R | Mapa de relaciones y cardinalidades |
| 3 | Conversion relacional | Tablas con PK y FK |
| 4 | Revision final | Esquema consistente y sin redundancia |
