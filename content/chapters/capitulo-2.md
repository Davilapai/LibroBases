# Introducción al Modelo Relacional — Capítulo 2

<div class="chapter-divider" id="cap2">
  <div class="cd-num">Capítulo 2</div>
  <h2>Introducción al Modelo Relacional</h2>
</div>

<!-- 2.1 -->
<div class="section" id="s2-1">
  <h2>2.1 Estructura de las Bases de Datos Relacionales</h2>

  <h4>🃏 Flashcards — Terminología relacional</h4>
  <p class="flashcard-hint">Clic para voltear</p>
  <div class="flashcard-container">
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Relación</div></div>
        <div class="flashcard-back">Una tabla con filas y columnas. Matemáticamente es un conjunto de tuplas.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Tupla</div></div>
        <div class="flashcard-back">Una fila de la tabla. Representa un hecho individual.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Atributo</div></div>
        <div class="flashcard-back">Una columna de la tabla. Cada atributo tiene un nombre único dentro de la relación.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Dominio atómico</div></div>
        <div class="flashcard-back">Conjunto de valores permitidos para un atributo, cuyos elementos son indivisibles.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Valor nulo (NULL)</div></div>
        <div class="flashcard-back">Valor especial que indica que el valor es desconocido o no existe. Complica operaciones y debe evitarse cuando sea posible.</div>
      </div>
    </div>
  </div>

  <p>Ejemplo de la base de datos universitaria:</p>
  <pre><code>Relación instructor: (<span class="kw">ID</span>, name, dept_name, salary)
Ejemplo de tupla: (22222, Einstein, Physics, 95000)

Relación department: (<span class="kw">dept_name</span>, building, budget)
Ejemplo de tupla: (Biology, Watson, 90000)</code></pre>
</div>

<!-- 2.2-2.3 -->
<div class="section" id="s2-2">
  <h2>2.2-2.3 Esquema de BD y Claves</h2>

  <h3>Esquema completo de la universidad</h3>
  <pre><code><span class="kw">classroom</span>(building, room_number, capacity)
<span class="kw">department</span>(dept_name, building, budget)
<span class="kw">course</span>(course_id, title, dept_name, credits)
<span class="kw">instructor</span>(ID, name, dept_name, salary)
<span class="kw">section</span>(course_id, sec_id, semester, year, building, room_number, time_slot_id)
<span class="kw">teaches</span>(ID, course_id, sec_id, semester, year)
<span class="kw">student</span>(ID, name, dept_name, tot_cred)
<span class="kw">takes</span>(ID, course_id, sec_id, semester, year, grade)
<span class="kw">advisor</span>(s_ID, i_ID)
<span class="kw">prereq</span>(course_id, prereq_id)</code></pre>

  <h3>Tipos de Claves</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Tipo</th><th>Definición</th><th>Ejemplo (instructor)</th></tr></thead>
    <tbody>
      <tr><td><strong>Superclave</strong></td><td>Cualquier conjunto de atributos que identifica cada tupla de forma única</td><td>{ID}, {ID, name}, {ID, name, salary}</td></tr>
      <tr><td><strong>Clave candidata</strong></td><td>Superclave minimal (sin subconjunto propio que sea superclave)</td><td>{ID}</td></tr>
      <tr><td><strong>Clave primaria</strong></td><td>Clave candidata elegida como identificador principal; no puede ser null</td><td>ID (subrayado en esquema)</td></tr>
      <tr><td><strong>Clave foránea</strong></td><td>Atributo cuyo valor debe existir como clave primaria en otra relación</td><td>dept_name → department</td></tr>
    </tbody>
  </table>
  </div>

  <div class="callout warning">
    <strong>⚠️ Regla de elección:</strong> La clave primaria debe ser un atributo que raramente o nunca cambie su valor. La dirección o el nombre NO son buenas opciones.
  </div>

  <!-- Quiz claves -->
  <div class="quiz-card" data-quiz="q2-2a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">Una superclave siempre es también una clave candidata.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q2-2a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q2-2a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q2-2a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q2-2a','false','Correcto. Una superclave puede contener atributos redundantes. Una clave candidata es la superclave MINIMAL. Ej: {ID, name} es superclave pero no clave candidata si {ID} ya identifica.','FALSO. Una superclave puede tener atributos redundantes. La clave candidata es la superclave minimal — ningún subconjunto propio es también superclave.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q2-2b">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Podemos usar <code>name</code> como clave primaria de la relación <code>instructor</code>?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Sí, siempre que en la instancia actual no haya duplicados</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>No, porque la clave primaria debe garantizar unicidad en TODAS las posibles instancias</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Sí, si combinamos name con dept_name</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q2-2b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q2-2b','b','Correcto. La clave primaria debe garantizar unicidad en TODAS las posibles instancias, no solo en la actual. Es perfectamente posible que dos instructores tengan el mismo nombre.','La clave primaria debe funcionar para TODAS las instancias posibles. Dos instructores distintos podrían compartir nombre.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q2-2c">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">Una clave foránea debe referenciar la clave primaria de la relación referenciada.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q2-2c')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q2-2c')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q2-2c"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q2-2c','true','Correcto. Por definición, una foreign key referencia la clave primaria. Una restricción de integridad referencial más general puede referenciar atributos que no sean clave primaria.','VERDADERO. Una foreign key constraint referencia la clave primaria de la relación referenciada por definición.')">Verificar</button></div>
  </div>
</div>

<!-- 2.4-2.6 -->
<div class="section" id="s2-4">
  <h2>2.4-2.6 Álgebra Relacional</h2>
  <p>Base teórica de SQL. Define operaciones que toman relaciones como entrada y producen nuevas relaciones.</p>

  <h3>Operaciones Unarias</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Operación</th><th>Símbolo</th><th>Descripción</th><th>Ejemplo</th></tr></thead>
    <tbody>
      <tr><td>Selección</td><td>σ</td><td>Filtra tuplas que satisfacen un predicado</td><td>σ<sub>dept='Physics'</sub>(instructor)</td></tr>
      <tr><td>Proyección</td><td>Π</td><td>Retiene solo ciertos atributos (columnas)</td><td>Π<sub>ID,name</sub>(instructor)</td></tr>
      <tr><td>Renombramiento</td><td>ρ</td><td>Renombra relación o atributos</td><td>ρ<sub>x</sub>(E)</td></tr>
    </tbody>
  </table>
  </div>

  <h3>Operaciones Binarias</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Operación</th><th>Símbolo</th><th>Descripción</th></tr></thead>
    <tbody>
      <tr><td>Producto Cartesiano</td><td>×</td><td>Combina cada tupla de r1 con cada tupla de r2</td></tr>
      <tr><td>Join</td><td>⋈</td><td>Combina tuplas que satisfacen una condición (= σ<sub>θ</sub>(r1 × r2))</td></tr>
      <tr><td>Unión</td><td>∪</td><td>Tuplas en r1 O en r2</td></tr>
      <tr><td>Intersección</td><td>∩</td><td>Tuplas en r1 Y en r2</td></tr>
      <tr><td>Diferencia</td><td>−</td><td>Tuplas en r1 pero NO en r2</td></tr>
    </tbody>
  </table>
  </div>

  <div class="callout info">
    <strong>📌 Composición:</strong> Como el resultado de cada operación es una relación, se pueden componer: <code>Π<sub>name</sub>(σ<sub>dept='Physics'</sub>(instructor))</code> — primero selecciona, luego proyecta.
  </div>

  <!-- Matching: operadores -->
  <div class="quiz-card" data-quiz="match2-4">
    <div class="q-header"><span class="q-badge match">Emparejar</span></div>
    <div class="q-text">Empareja cada símbolo de álgebra relacional con su operación:</div>
    <div class="match-exercise" id="match2-4">
      <div class="match-cols">
        <div class="match-col">
          <h4>Símbolo</h4>
          <div class="match-item" data-match="left" data-pair="1" onclick="selectMatch(this,'match2-4')">σ</div>
          <div class="match-item" data-match="left" data-pair="2" onclick="selectMatch(this,'match2-4')">Π</div>
          <div class="match-item" data-match="left" data-pair="3" onclick="selectMatch(this,'match2-4')">⋈</div>
          <div class="match-item" data-match="left" data-pair="4" onclick="selectMatch(this,'match2-4')">−</div>
        </div>
        <div class="match-col">
          <h4>Operación</h4>
          <div class="match-item" data-match="right" data-pair="3" onclick="selectMatch(this,'match2-4')">Join (combinación con condición)</div>
          <div class="match-item" data-match="right" data-pair="1" onclick="selectMatch(this,'match2-4')">Selección (filtrar por predicado)</div>
          <div class="match-item" data-match="right" data-pair="4" onclick="selectMatch(this,'match2-4')">Diferencia de conjuntos</div>
          <div class="match-item" data-match="right" data-pair="2" onclick="selectMatch(this,'match2-4')">Proyección (columnas)</div>
        </div>
      </div>
    </div>
    <div class="quiz-feedback" id="fb-match2-4"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkMatch('match2-4')">Verificar</button><button class="btn btn-secondary" onclick="resetMatch('match2-4')">Reiniciar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q2-4a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">El resultado de una operación de álgebra relacional es siempre una relación.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q2-4a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q2-4a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q2-4a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q2-4a','true','Correcto. Esta propiedad fundamental permite componer operaciones: cada resultado es una relación que puede usarse como entrada de otra.','VERDADERO. La clausura (closure) es propiedad fundamental del álgebra relacional.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q2-4b">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Por qué el producto cartesiano sin condición de selección es inútil en la práctica?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Porque combina TODAS las tuplas sin criterio de relación, generando combinaciones sin sentido</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Porque elimina todas las tuplas duplicadas</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Porque solo funciona con relaciones del mismo esquema</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q2-4b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q2-4b','a','Correcto. Con 200 instructores y 600 cursos, generaría 120,000 tuplas, la mayoría emparejando instructores con cursos que no enseñaron. El JOIN con condición es lo útil.','Combina TODAS las tuplas sin criterio, generando combinaciones sin sentido. Con 200×600 = 120,000 filas mayoritariamente irrelevantes.')">Verificar</button></div>
  </div>
</div>

<!-- ============================================================ -->
<!--                    CAPÍTULO 3                                 -->
<!-- ============================================================ -->
