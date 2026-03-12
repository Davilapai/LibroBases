# Introducción a SQL — Capítulo 3

<div class="chapter-divider" id="cap3">
  <div class="cd-num">Capítulo 3</div>
  <h2>Introducción a SQL</h2>
</div>

<!-- 3.1-3.2 -->
<div class="section" id="s3-1">
  <h2>3.1-3.2 DDL — Definición de Datos</h2>

  <h3>Tipos de datos básicos</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Tipo</th><th>Descripción</th></tr></thead>
    <tbody>
      <tr><td><code>char(n)</code></td><td>Cadena de longitud fija n</td></tr>
      <tr><td><code>varchar(n)</code></td><td>Cadena de longitud variable, máximo n</td></tr>
      <tr><td><code>int / integer</code></td><td>Entero</td></tr>
      <tr><td><code>numeric(p,d)</code></td><td>Número de punto fijo (p dígitos, d decimales)</td></tr>
      <tr><td><code>real / double precision</code></td><td>Punto flotante</td></tr>
    </tbody>
  </table>
  </div>

  <h3>CREATE TABLE</h3>
  <pre><code><span class="kw">CREATE TABLE</span> department (
    dept_name  <span class="fn">VARCHAR</span>(<span class="num">20</span>),
    building   <span class="fn">VARCHAR</span>(<span class="num">15</span>),
    budget     <span class="fn">NUMERIC</span>(<span class="num">12</span>,<span class="num">2</span>),
    <span class="kw">PRIMARY KEY</span> (dept_name)
);</code></pre>

  <h3>Restricciones en CREATE TABLE</h3>
  <ul>
    <li><strong>PRIMARY KEY (A1, A2, …):</strong> No nulos y únicos.</li>
    <li><strong>FOREIGN KEY (A1, …) REFERENCES s:</strong> Clave foránea hacia la PK de s.</li>
    <li><strong>NOT NULL:</strong> El atributo no puede ser nulo.</li>
  </ul>

  <h3>Otras instrucciones DDL</h3>
  <ul>
    <li><code>DROP TABLE r</code> — Elimina tabla y datos.</li>
    <li><code>DELETE FROM r</code> — Elimina datos pero conserva esquema.</li>
    <li><code>ALTER TABLE r ADD A D</code> — Agrega atributo A de tipo D.</li>
    <li><code>ALTER TABLE r DROP A</code> — Elimina atributo A.</li>
  </ul>

  <!-- Fill in blanks DDL -->
  <div class="quiz-card" data-quiz="fill3-1">
    <div class="q-header"><span class="q-badge fill">Completar</span></div>
    <div class="q-text">Completa la sentencia DDL para crear la tabla <code>course</code>:</div>
    <pre><code><input class="fill-input" id="fill3-1a" data-answer="CREATE TABLE" placeholder="???"> course (
    course_id  VARCHAR(8),
    title      VARCHAR(50),
    dept_name  VARCHAR(20),
    credits    NUMERIC(2,0),
    <input class="fill-input" id="fill3-1b" data-answer="PRIMARY KEY" placeholder="???"> (course_id),
    <input class="fill-input" id="fill3-1c" data-answer="FOREIGN KEY" placeholder="???"> (dept_name) REFERENCES department
);</code></pre>
    <div class="quiz-feedback" id="fb-fill3-1"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkFill('fill3-1',['fill3-1a','fill3-1b','fill3-1c'])">Verificar</button></div>
  </div>
</div>

<!-- 3.3-3.4 -->
<div class="section" id="s3-3">
  <h2>3.3-3.4 Consultas SQL Básicas</h2>

  <h3>La consulta SELECT-FROM-WHERE</h3>
  <pre><code><span class="kw">SELECT</span> A1, A2, ..., An
<span class="kw">FROM</span>   r1, r2, ..., rm
<span class="kw">WHERE</span>  P;</code></pre>
  <p><strong>Orden de ejecución semántica:</strong> FROM (producto cartesiano) → WHERE (filtro) → SELECT (proyección).</p>

  <pre><code><span class="kw">SELECT</span> name
<span class="kw">FROM</span> instructor
<span class="kw">WHERE</span> dept_name = <span class="str">'Comp. Sci.'</span> <span class="kw">AND</span> salary > <span class="num">70000</span>;</code></pre>

  <h3>Duplicados, expresiones y renombramiento</h3>
  <ul>
    <li><code>SELECT DISTINCT</code> — Elimina duplicados.</li>
    <li><code>SELECT ALL</code> — Retiene duplicados (default).</li>
    <li><code>salary * 1.1</code> — Expresiones aritméticas en SELECT.</li>
    <li><code>AS</code> — Renombra atributos o relaciones (<strong>alias</strong>).</li>
  </ul>

  <h3>Operaciones con cadenas — LIKE</h3>
  <ul>
    <li><code>%</code> — Coincide con cualquier subcadena.</li>
    <li><code>_</code> — Coincide con exactamente un carácter.</li>
  </ul>
  <pre><code><span class="kw">SELECT</span> dept_name <span class="kw">FROM</span> department
<span class="kw">WHERE</span> building <span class="kw">LIKE</span> <span class="str">'%Watson%'</span>;</code></pre>

  <h3>ORDER BY y BETWEEN</h3>
  <pre><code><span class="kw">SELECT</span> * <span class="kw">FROM</span> instructor
<span class="kw">ORDER BY</span> salary <span class="kw">DESC</span>, name <span class="kw">ASC</span>;

<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor
<span class="kw">WHERE</span> salary <span class="kw">BETWEEN</span> <span class="num">90000</span> <span class="kw">AND</span> <span class="num">100000</span>;</code></pre>

  <!-- SQL writing exercise -->
  <div class="quiz-card" data-quiz="code3-3a">
    <div class="q-header"><span class="q-badge code">Escribir SQL</span></div>
    <div class="q-text">Escribe una consulta SQL para encontrar los <strong>nombres y salarios</strong> de todos los instructores cuyo salario está entre $70,000 y $100,000.</div>
    <textarea class="code-editor" id="code3-3a" rows="3" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-code3-3a"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('code3-3a',['select','name','salary','from','instructor','where','between 70000 and 100000|salary >= 70000 and salary <= 100000|salary>=70000 and salary<=100000'],'SELECT name, salary FROM instructor WHERE salary BETWEEN 70000 AND 100000;')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('code3-3a','SELECT name, salary\nFROM instructor\nWHERE salary BETWEEN 70000 AND 100000;')">Ver respuesta</button>
    </div>
  </div>
</div>

<!-- 3.5-3.6 -->
<div class="section" id="s3-5">
  <h2>3.5-3.6 Operaciones de Conjuntos y NULL</h2>

  <h3>Operaciones de Conjuntos</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>SQL</th><th>Álgebra</th><th>Duplicados</th><th>Variante con duplicados</th></tr></thead>
    <tbody>
      <tr><td><code>UNION</code></td><td>∪</td><td>Elimina</td><td><code>UNION ALL</code></td></tr>
      <tr><td><code>INTERSECT</code></td><td>∩</td><td>Elimina</td><td><code>INTERSECT ALL</code></td></tr>
      <tr><td><code>EXCEPT</code></td><td>−</td><td>Elimina</td><td><code>EXCEPT ALL</code></td></tr>
    </tbody>
  </table>
  </div>

  <h3>Valores Nulos (NULL)</h3>
  <ul>
    <li><strong>Aritmética:</strong> <code>NULL + 5 = NULL</code></li>
    <li><strong>Comparaciones:</strong> Cualquier comparación con null → <code>UNKNOWN</code></li>
    <li><strong>WHERE:</strong> Solo incluye tuplas donde el predicado es TRUE (excluye false y unknown).</li>
    <li><strong>Verificar nulls:</strong> <code>IS NULL</code> / <code>IS NOT NULL</code></li>
  </ul>

  <div class="callout danger">
    <strong>⚠️ Cuidado:</strong> <code>NULL = NULL</code> NO es TRUE, es UNKNOWN. Para verificar si algo es null siempre usa <code>IS NULL</code>.
  </div>

  <div class="quiz-card" data-quiz="q3-5a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">UNION y UNION ALL producen siempre el mismo resultado.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q3-5a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q3-5a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q3-5a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q3-5a','false','Correcto. UNION elimina duplicados; UNION ALL retiene todos los duplicados. Si hay tuplas en común, los resultados diferirán.','FALSO. UNION elimina duplicados automáticamente; UNION ALL retiene todos. Si hay tuplas en común, los resultados son distintos.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q3-5b">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">En SQL, la comparación <code>NULL = NULL</code> evalúa a TRUE.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q3-5b')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q3-5b')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q3-5b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q3-5b','false','Correcto. Cualquier comparación con NULL resulta en UNKNOWN. Debes usar IS NULL para esta verificación.','FALSO. En SQL, NULL = NULL resulta en UNKNOWN. Para verificar nulls usa IS NULL.')">Verificar</button></div>
  </div>
</div>

<!-- 3.7 -->
<div class="section" id="s3-7">
  <h2>3.7 Funciones Agregadas y GROUP BY</h2>

  <h3>Funciones Agregadas</h3>
  <div class="table-wrap">
  <table>
    <thead><tr><th>Función</th><th>Descripción</th><th>Ejemplo</th></tr></thead>
    <tbody>
      <tr><td><code>avg()</code></td><td>Promedio</td><td><code>avg(salary)</code></td></tr>
      <tr><td><code>min()</code></td><td>Valor mínimo</td><td><code>min(salary)</code></td></tr>
      <tr><td><code>max()</code></td><td>Valor máximo</td><td><code>max(salary)</code></td></tr>
      <tr><td><code>sum()</code></td><td>Suma total</td><td><code>sum(salary)</code></td></tr>
      <tr><td><code>count()</code></td><td>Cuenta tuplas</td><td><code>count(*)</code></td></tr>
    </tbody>
  </table>
  </div>

  <h3>GROUP BY y HAVING</h3>
  <pre><code><span class="kw">SELECT</span> dept_name, <span class="fn">avg</span>(salary) <span class="kw">AS</span> avg_salary
<span class="kw">FROM</span> instructor
<span class="kw">GROUP BY</span> dept_name
<span class="kw">HAVING</span> <span class="fn">avg</span>(salary) > <span class="num">42000</span>;</code></pre>

  <div class="callout danger">
    <strong>⚠️ REGLA CRÍTICA:</strong> Los atributos en SELECT que NO son agregados DEBEN estar en GROUP BY. Sin excepción.
  </div>

  <p><strong>Orden de ejecución lógico:</strong> FROM → WHERE → GROUP BY → HAVING → SELECT</p>

  <div class="quiz-card" data-quiz="q3-7a">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Cuál es la diferencia entre WHERE y HAVING?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>WHERE filtra filas individuales ANTES de agrupar; HAVING filtra GRUPOS después de agrupar</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>WHERE y HAVING son sinónimos y pueden intercambiarse</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>WHERE se usa para agregados; HAVING para filas individuales</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q3-7a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q3-7a','a','Correcto. WHERE filtra ANTES del GROUP BY (filas individuales). HAVING filtra DESPUÉS del GROUP BY (grupos completos).','WHERE filtra filas individuales ANTES de agrupar. HAVING filtra GRUPOS después de agrupar. No son intercambiables.')">Verificar</button></div>
  </div>

  <!-- SQL exercise: GROUP BY + HAVING -->
  <div class="quiz-card" data-quiz="code3-7a">
    <div class="q-header"><span class="q-badge code">Escribir SQL</span></div>
    <div class="q-text">Escribe la consulta para encontrar el <strong>promedio de salarios por departamento</strong>, mostrando solo los departamentos con promedio mayor a $80,000.</div>
    <textarea class="code-editor" id="code3-7a" rows="4" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-code3-7a"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('code3-7a',['select','dept_name','avg','salary','from','instructor','group by','dept_name','having','80000'],'SELECT dept_name, avg(salary) AS avg_salary\nFROM instructor\nGROUP BY dept_name\nHAVING avg(salary) > 80000;')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('code3-7a','SELECT dept_name, avg(salary) AS avg_salary\nFROM instructor\nGROUP BY dept_name\nHAVING avg(salary) > 80000;')">Ver respuesta</button>
    </div>
  </div>
</div>

<!-- 3.8 -->
<div class="section" id="s3-8">
  <h2>3.8 Subconsultas Anidadas</h2>

  <h3>IN y NOT IN</h3>
  <pre><code><span class="kw">SELECT DISTINCT</span> course_id <span class="kw">FROM</span> section
<span class="kw">WHERE</span> semester=<span class="str">'Fall'</span> <span class="kw">AND</span> year=<span class="num">2017</span> <span class="kw">AND</span>
      course_id <span class="kw">IN</span> (<span class="kw">SELECT</span> course_id <span class="kw">FROM</span> section
                   <span class="kw">WHERE</span> semester=<span class="str">'Spring'</span> <span class="kw">AND</span> year=<span class="num">2018</span>);</code></pre>

  <h3>SOME y ALL</h3>
  <ul>
    <li><code>= SOME</code> equivale a <code>IN</code>.</li>
    <li><code>&lt;&gt; ALL</code> equivale a <code>NOT IN</code>.</li>
    <li><code>&gt; SOME</code> → mayor que AL MENOS uno.</li>
    <li><code>&gt; ALL</code> → mayor que TODOS.</li>
  </ul>

  <h3>EXISTS y NOT EXISTS</h3>
  <pre><code><span class="cm">-- Instructores que enseñan algún curso de Biología:</span>
<span class="kw">SELECT</span> name <span class="kw">FROM</span> instructor I
<span class="kw">WHERE EXISTS</span> (<span class="kw">SELECT</span> * <span class="kw">FROM</span> teaches T
             <span class="kw">WHERE</span> T.ID = I.ID <span class="kw">AND</span> T.course_id <span class="kw">LIKE</span> <span class="str">'BIO%'</span>);</code></pre>

  <h3>Subconsultas en FROM y WITH</h3>
  <pre><code><span class="kw">WITH</span> max_budget(value) <span class="kw">AS</span>
    (<span class="kw">SELECT MAX</span>(budget) <span class="kw">FROM</span> department)
<span class="kw">SELECT</span> dept_name <span class="kw">FROM</span> department, max_budget
<span class="kw">WHERE</span> department.budget = max_budget.value;</code></pre>

  <div class="quiz-card" data-quiz="q3-8a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text"><code>= SOME</code> es equivalente a <code>IN</code> en SQL.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q3-8a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q3-8a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q3-8a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q3-8a','true','Correcto. = SOME (o = ANY) verifica si el valor es igual a algún elemento del conjunto, exactamente lo que hace IN.','VERDADERO. = SOME y IN verifican lo mismo: que el valor sea igual a algún elemento del conjunto.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="code3-8a">
    <div class="q-header"><span class="q-badge code">Escribir SQL</span></div>
    <div class="q-text">Encuentra los nombres de todos los instructores que ganan más que <strong>al menos un</strong> instructor del departamento de Biología (usa subconsulta con SOME).</div>
    <textarea class="code-editor" id="code3-8a" rows="3" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-code3-8a"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('code3-8a',['select','name','from','instructor','where','salary','>','some','select','salary','biology'],'SELECT name FROM instructor\nWHERE salary > SOME\n  (SELECT salary FROM instructor WHERE dept_name = \'Biology\');')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('code3-8a','SELECT name FROM instructor\nWHERE salary > SOME\n  (SELECT salary FROM instructor\n   WHERE dept_name = \'Biology\');')">Ver respuesta</button>
    </div>
  </div>
</div>

<!-- 3.9 -->
<div class="section" id="s3-9">
  <h2>3.9 Modificación de la Base de Datos</h2>

  <h3>DELETE</h3>
  <pre><code><span class="kw">DELETE FROM</span> instructor <span class="kw">WHERE</span> dept_name = <span class="str">'Finance'</span>;</code></pre>

  <h3>INSERT</h3>
  <pre><code><span class="kw">INSERT INTO</span> course <span class="kw">VALUES</span> (<span class="str">'CS-437'</span>, <span class="str">'Database Systems'</span>, <span class="str">'Comp. Sci.'</span>, <span class="num">4</span>);

<span class="cm">-- Insertar resultado de consulta:</span>
<span class="kw">INSERT INTO</span> instructor
    <span class="kw">SELECT</span> ID, name, dept_name, <span class="num">18000</span>
    <span class="kw">FROM</span> student <span class="kw">WHERE</span> dept_name = <span class="str">'Music'</span> <span class="kw">AND</span> tot_cred > <span class="num">144</span>;</code></pre>

  <h3>UPDATE con CASE</h3>
  <pre><code><span class="kw">UPDATE</span> instructor
<span class="kw">SET</span> salary = <span class="kw">CASE</span>
    <span class="kw">WHEN</span> salary &lt;= <span class="num">100000</span> <span class="kw">THEN</span> salary * <span class="num">1.05</span>
    <span class="kw">ELSE</span> salary * <span class="num">1.03</span>
<span class="kw">END</span>;</code></pre>

  <div class="quiz-card" data-quiz="q3-9a">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">¿Cuál es el resultado de <code>SELECT avg(salary) FROM instructor</code> si algunos instructores tienen salary = NULL?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Error: no se puede calcular avg con nulls</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>avg IGNORA los nulls y calcula el promedio solo sobre los valores definidos</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Los null se tratan como 0 en el cálculo</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q3-9a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q3-9a','b','Correcto. Las funciones agregadas (excepto count(*)) ignoran los valores null. El resultado es el promedio solo sobre salarios definidos.','avg() IGNORA los valores null. El resultado es el promedio calculado solo sobre los instructores que SÍ tienen salario definido.')">Verificar</button></div>
  </div>
</div>


<!-- ============================================================ -->
<!--                    CAPÍTULO 4                                 -->
<!-- ============================================================ -->
