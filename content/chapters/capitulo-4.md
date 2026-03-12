# SQL Intermedio — Capítulo 4

<div class="chapter-divider" id="cap4">
  <div class="cd-num">Capítulo 4</div>
  <h2>SQL Intermedio</h2>
</div>

<!-- 4.1 -->
<div class="section" id="s4-1">
  <h2>4.1 Expresiones JOIN</h2>

  <h3>Natural Join</h3>
  <p>Combina tuplas que tienen el mismo valor en atributos con el mismo nombre. Los atributos comunes aparecen solo una vez en el resultado.</p>

  <div class="callout danger">
    <strong>⚠️ PELIGRO:</strong> Si dos relaciones tienen un atributo de mismo nombre que NO deberías igualar, produce resultados incorrectos. Ejemplo: <code>student NATURAL JOIN takes NATURAL JOIN course</code> igualaría dept_name de student con dept_name de course.
  </div>

  <h3>JOIN USING y JOIN ON</h3>
  <pre><code><span class="cm">-- USING: especifica explícitamente qué atributos igualar</span>
<span class="kw">SELECT</span> name, title <span class="kw">FROM</span> (student <span class="kw">NATURAL JOIN</span> takes)
  <span class="kw">JOIN</span> course <span class="kw">USING</span> (course_id);

<span class="cm">-- ON: predicado de unión libre</span>
<span class="kw">SELECT</span> * <span class="kw">FROM</span> student <span class="kw">JOIN</span> takes <span class="kw">ON</span> student.ID = takes.ID;</code></pre>

  <h3>Outer Joins</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Tipo</th><th>Preserva</th><th>Ejemplo de uso</th></tr></thead>
    <tbody>
      <tr><td><strong>LEFT OUTER JOIN</strong></td><td>TODAS las tuplas de la tabla IZQUIERDA</td><td>Encontrar estudiantes sin cursos</td></tr>
      <tr><td><strong>RIGHT OUTER JOIN</strong></td><td>TODAS las tuplas de la tabla DERECHA</td><td>Simétrico al LEFT</td></tr>
      <tr><td><strong>FULL OUTER JOIN</strong></td><td>Tuplas de AMBAS tablas</td><td>Unión completa con nulls</td></tr>
    </tbody>
  </table>
  </div>

  <pre><code><span class="cm">-- Estudiantes que NO han tomado ningún curso:</span>
<span class="kw">SELECT</span> ID <span class="kw">FROM</span> student
  <span class="kw">NATURAL LEFT OUTER JOIN</span> takes
<span class="kw">WHERE</span> course_id <span class="kw">IS NULL</span>;</code></pre>

  <div class="quiz-card" data-quiz="q4-1a">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Por qué <code>student NATURAL JOIN takes NATURAL JOIN course</code> puede dar un resultado incorrecto?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Porque student y course comparten dept_name, y el natural join igualaría ese atributo, excluyendo estudiantes que toman cursos de otros departamentos</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Porque el natural join no puede encadenar tres relaciones</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Porque takes no tiene atributos en común con course</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q4-1a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q4-1a','a','Correcto. student y course comparten dept_name. El NATURAL JOIN igualaría ambos, excluyendo a un estudiante de Física tomando un curso de Matemáticas. La solución: JOIN course USING (course_id).','student y course comparten dept_name. El NATURAL JOIN lo iguala incorrectamente. Usa JOIN course USING (course_id) en su lugar.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="code4-1a">
    <div class="q-header"><span class="q-badge code">Escribir SQL</span></div>
    <div class="q-text">Escribe la consulta para mostrar <strong>todos los estudiantes</strong> y los cursos que han tomado. Los estudiantes sin cursos también deben aparecer (con null).</div>
    <textarea class="code-editor" id="code4-1a" rows="3" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-code4-1a"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('code4-1a',['select','from','student','left outer join|left join','takes','on'],'SELECT s.ID, s.name, t.course_id, t.semester, t.year\nFROM student s LEFT OUTER JOIN takes t ON s.ID = t.ID;')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('code4-1a','SELECT s.ID, s.name, t.course_id, t.semester, t.year\nFROM student s LEFT OUTER JOIN takes t\n  ON s.ID = t.ID;')">Ver respuesta</button>
    </div>
  </div>
</div>

<!-- 4.2 -->
<div class="section" id="s4-2">
  <h2>4.2 Vistas (Views)</h2>

  <p>Una <strong>vista</strong> es una relación virtual definida por una consulta. No almacena datos, se recalcula cada vez que se usa.</p>

  <pre><code><span class="kw">CREATE VIEW</span> faculty <span class="kw">AS</span>
    <span class="kw">SELECT</span> ID, name, dept_name <span class="kw">FROM</span> instructor;</code></pre>

  <h3>Beneficios</h3>
  <ul>
    <li><strong>Seguridad:</strong> Ocultan datos sensibles (ej: salario).</li>
    <li><strong>Simplificación:</strong> Perspectiva más sencilla para ciertos usuarios.</li>
    <li><strong>Independencia lógica:</strong> Si el esquema cambia, se actualiza la vista.</li>
  </ul>

  <h3>Vista Materializada</h3>
  <p>Almacena el resultado precomputado. Consultarla es rápido, pero mantenerla actualizada tiene costo (<strong>view maintenance</strong>).</p>

  <h3>Vista Actualizable</h3>
  <p>Una vista es actualizable SOLO si cumple TODAS estas condiciones:</p>
  <ol>
    <li>FROM tiene solo una relación de la BD.</li>
    <li>SELECT contiene solo nombres de atributos (no expresiones, agregados, DISTINCT).</li>
    <li>Atributos no en SELECT pueden ser nulos.</li>
    <li>No tiene GROUP BY ni HAVING.</li>
  </ol>

  <div class="quiz-card" data-quiz="q4-2a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">Una vista siempre refleja los datos más recientes de las relaciones subyacentes.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q4-2a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q4-2a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q4-2a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q4-2a','true','Correcto. Las vistas normales (no materializadas) recalculan cada vez que son consultadas, reflejando siempre el estado actual.','VERDADERO. Las vistas normales se recalculan en cada consulta, por lo que siempre reflejan los datos actuales.')">Verificar</button></div>
  </div>
</div>

<!-- 4.3 -->
<div class="section" id="s4-3">
  <h2>4.3 Transacciones</h2>

  <p>Una transacción es una secuencia de instrucciones SQL que forman una unidad lógica de trabajo.</p>
  <ul>
    <li><strong>COMMIT:</strong> Hace permanentes todos los cambios.</li>
    <li><strong>ROLLBACK:</strong> Deshace todos los cambios de la transacción actual.</li>
  </ul>

  <div class="callout warning">
    <strong>⚠️ Consejo:</strong> En la mayoría de sistemas (MySQL, PostgreSQL) cada instrucción SQL es su propia transacción por defecto (autocommit). En Oracle, el autocommit <strong>NO</strong> está activado — si olvidas COMMIT, los cambios se revertirán al desconectarte.
  </div>
</div>

<!-- 4.4 -->
<div class="section" id="s4-4">
  <h2>4.4 Restricciones de Integridad</h2>

  <h3>Restricciones en Relaciones Individuales</h3>
  <ul>
    <li><strong>NOT NULL:</strong> Prohíbe valores nulos.</li>
    <li><strong>UNIQUE:</strong> Superclave — no duplicados. A diferencia de PK, permite nulls.</li>
    <li><strong>CHECK (P):</strong> Cada tupla debe satisfacer el predicado P.</li>
  </ul>

  <pre><code>semester <span class="fn">VARCHAR</span>(<span class="num">6</span>) <span class="kw">CHECK</span> (semester <span class="kw">IN</span> (<span class="str">'Fall'</span>, <span class="str">'Winter'</span>, <span class="str">'Spring'</span>, <span class="str">'Summer'</span>))</code></pre>

  <h3>Integridad Referencial (Foreign Keys)</h3>
  <pre><code><span class="kw">FOREIGN KEY</span> (dept_name) <span class="kw">REFERENCES</span> department
  <span class="kw">ON DELETE CASCADE</span>
  <span class="kw">ON UPDATE CASCADE</span></code></pre>

  <div class="table-wrap">
  <table>
    <thead><tr><th>Opción</th><th>Efecto al eliminar/actualizar en tabla referenciada</th></tr></thead>
    <tbody>
      <tr><td><code>CASCADE</code></td><td>Propaga la operación a las tuplas referenciantes</td></tr>
      <tr><td><code>SET NULL</code></td><td>Pone null en los atributos FK</td></tr>
      <tr><td><code>SET DEFAULT</code></td><td>Pone el valor por defecto del dominio</td></tr>
      <tr><td><em>(sin especificar)</em></td><td>REJECT: la operación falla con error</td></tr>
    </tbody>
  </table>
  </div>

  <div class="quiz-card" data-quiz="q4-4a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">ON DELETE CASCADE elimina automáticamente las tuplas referenciantes cuando se elimina una tupla referenciada.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q4-4a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q4-4a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q4-4a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q4-4a','true','Correcto. ON DELETE CASCADE propaga la eliminación en cascada por toda la cadena de dependencias de claves foráneas.','VERDADERO. ON DELETE CASCADE elimina las tuplas que referencian a la tupla eliminada, propagándose en cadena.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q4-4b">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">UNIQUE y PRIMARY KEY son equivalentes en SQL.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q4-4b')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q4-4b')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q4-4b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q4-4b','false','Correcto. PRIMARY KEY implica NOT NULL; UNIQUE permite nulls. Además, solo puede haber una PK pero múltiples UNIQUE.','FALSO. PRIMARY KEY implica NOT NULL; UNIQUE permite nulls. Una tabla puede tener múltiples UNIQUE pero solo una PK.')">Verificar</button></div>
  </div>

  <!-- DDL exercise -->
  <div class="quiz-card" data-quiz="fill4-4">
    <div class="q-header"><span class="q-badge fill">Completar</span></div>
    <div class="q-text">Completa el DDL para la tabla section con la restricción CHECK que limita el semestre:</div>
    <pre><code>CREATE TABLE section (
    course_id    VARCHAR(8),
    sec_id       VARCHAR(8),
    semester     VARCHAR(6) <input class="fill-input" id="fill4-4a" data-answer="CHECK" placeholder="???"> (semester IN ('Fall','Winter','Spring','Summer')),
    year         NUMERIC(4,0),
    PRIMARY KEY (course_id, sec_id, semester, year),
    <input class="fill-input" id="fill4-4b" data-answer="FOREIGN KEY" placeholder="???"> (course_id) REFERENCES course
);</code></pre>
    <div class="quiz-feedback" id="fb-fill4-4"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkFill('fill4-4',['fill4-4a','fill4-4b'])">Verificar</button></div>
  </div>
</div>

<!-- 4.5-4.7 -->
<div class="section" id="s4-5">
  <h2>4.5-4.7 Tipos de Datos, Índices y Autorización</h2>

  <h3>Tipos de datos temporales</h3>
  <ul>
    <li><code>date</code> — Fecha: <code>'2018-04-25'</code></li>
    <li><code>time</code> — Hora: HH:MM:SS</li>
    <li><code>timestamp</code> — Combinación de date y time</li>
  </ul>

  <h3>CAST y COALESCE</h3>
  <pre><code><span class="kw">SELECT</span> <span class="fn">CAST</span>(ID <span class="kw">AS</span> <span class="fn">NUMERIC</span>(<span class="num">5</span>)) <span class="kw">AS</span> inst_id <span class="kw">FROM</span> instructor;
<span class="kw">SELECT</span> ID, <span class="fn">COALESCE</span>(salary, <span class="num">0</span>) <span class="kw">AS</span> salary <span class="kw">FROM</span> instructor;</code></pre>

  <h3>Índices</h3>
  <pre><code><span class="kw">CREATE INDEX</span> dept_index <span class="kw">ON</span> instructor (dept_name);
<span class="kw">DROP INDEX</span> dept_index;</code></pre>
  <p>Estructura de datos que permite acceso eficiente sin escanear toda la tabla. Es parte del esquema <strong>físico</strong> (no lógico).</p>

  <h3>Autorización</h3>
  <p>Privilegios sobre datos: <strong>SELECT, INSERT, UPDATE, DELETE</strong>.</p>
  <pre><code><span class="kw">GRANT SELECT ON</span> department <span class="kw">TO</span> Amit, Satoshi;
<span class="kw">GRANT UPDATE</span> (budget) <span class="kw">ON</span> department <span class="kw">TO</span> Amit;
<span class="kw">REVOKE SELECT ON</span> department <span class="kw">FROM</span> Amit;</code></pre>

  <h3>Roles</h3>
  <pre><code><span class="kw">CREATE ROLE</span> instructor;
<span class="kw">GRANT SELECT ON</span> takes <span class="kw">TO</span> instructor;
<span class="kw">GRANT</span> instructor <span class="kw">TO</span> Satoshi;  <span class="cm">-- Satoshi adquiere el rol</span></code></pre>

  <div class="quiz-card" data-quiz="q4-5a">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Cuál es la ventaja de usar roles versus asignar privilegios directamente a usuarios?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Los roles son más rápidos de ejecutar</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Se define el conjunto de privilegios una vez en el rol, y al modificarlo se afecta a todos los usuarios con ese rol automáticamente</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Los roles permiten evadir las restricciones de integridad</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q4-5a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q4-5a','b','Correcto. Con roles, se definen los privilegios una vez y se asignan a múltiples usuarios. Si cambian los privilegios, se modifica solo el rol.','Los roles simplifican la gestión: se definen privilegios una vez, se asignan a muchos usuarios, y al cambiar el rol se actualizan todos.')">Verificar</button></div>
  </div>
</div>

<!-- ============================================================ -->
<!--                 EJERCICIOS INTEGRADOS                         -->
<!-- ============================================================ -->
