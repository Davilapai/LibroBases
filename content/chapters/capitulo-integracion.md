# Ejercicios Integrados — Integración

<div class="chapter-divider" id="capInt">
  <div class="cd-num">Integración</div>
  <h2>Ejercicios Integrados — Todos los Capítulos</h2>
</div>

<div class="section" id="sInt">
  <h2>Ejercicios de Mayor Complejidad</h2>

  <!-- INT.3 -->
  <div class="quiz-card" data-quiz="codeInt3">
    <div class="q-header"><span class="q-badge code">Consulta avanzada</span></div>
    <div class="q-text">Escribe una consulta SQL para encontrar los departamentos donde el instructor con <strong>mayor salario</strong> gana <strong>menos que</strong> el instructor con <strong>menor salario</strong> del departamento de Física.</div>
    <textarea class="code-editor" id="codeInt3" rows="4" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-codeInt3"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('codeInt3',['select','dept_name','from','instructor','group by','having','max','salary','<','select','min','salary','physics'],'SELECT dept_name FROM instructor\nGROUP BY dept_name\nHAVING MAX(salary) < (SELECT MIN(salary)\n  FROM instructor WHERE dept_name = \'Physics\');')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('codeInt3','SELECT dept_name FROM instructor\nGROUP BY dept_name\nHAVING MAX(salary) < (\n  SELECT MIN(salary) FROM instructor\n  WHERE dept_name = \'Physics\'\n);')">Ver respuesta</button>
    </div>
  </div>

  <!-- INT.4 -->
  <div class="quiz-card" data-quiz="codeInt4">
    <div class="q-header"><span class="q-badge code">Subconsultas</span></div>
    <div class="q-text">Escribe la consulta para encontrar los estudiantes que han tomado <strong>TODOS</strong> los cursos del departamento de Ciencias de la Computación. (Pista: usa NOT EXISTS + EXCEPT)</div>
    <textarea class="code-editor" id="codeInt4" rows="6" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-codeInt4"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('codeInt4',['select','student','not exists','except','takes','comp. sci|comp.sci'],'SELECT DISTINCT s.ID, s.name FROM student s\nWHERE NOT EXISTS (\n  SELECT course_id FROM course WHERE dept_name = \'Comp. Sci.\'\n  EXCEPT\n  SELECT t.course_id FROM takes t WHERE t.ID = s.ID\n);')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('codeInt4','SELECT DISTINCT s.ID, s.name FROM student s\nWHERE NOT EXISTS (\n  SELECT course_id FROM course\n  WHERE dept_name = \'Comp. Sci.\'\n  EXCEPT\n  SELECT t.course_id FROM takes t\n  WHERE t.ID = s.ID\n);')">Ver respuesta</button>
    </div>
  </div>

  <!-- INT.6 -->
  <div class="quiz-card" data-quiz="codeInt6">
    <div class="q-header"><span class="q-badge code">Joins complejos</span></div>
    <div class="q-text">Para cada estudiante, muestra su nombre y el <strong>número de cursos completados</strong> (grade no es null ni 'F'). Los estudiantes sin cursos deben aparecer con 0. <em>(Pista: la condición va en ON, no en WHERE)</em></div>
    <textarea class="code-editor" id="codeInt6" rows="5" placeholder="SELECT ..."></textarea>
    <div class="quiz-feedback" id="fb-codeInt6"></div>
    <div class="quiz-actions">
      <button class="btn btn-primary" onclick="checkSQL('codeInt6',['select','count','from','student','left','join|outer','takes','on','group by','grade is not null|grade<>|grade !='],'SELECT s.ID, s.name, COUNT(t.course_id) AS courses_completed\nFROM student s LEFT OUTER JOIN takes t\n  ON s.ID = t.ID AND t.grade IS NOT NULL AND t.grade <> \'F\'\nGROUP BY s.ID, s.name;')">Verificar</button>
      <button class="btn btn-secondary" onclick="showAnswer('codeInt6','SELECT s.ID, s.name,\n  COUNT(t.course_id) AS courses_completed\nFROM student s LEFT OUTER JOIN takes t\n  ON s.ID = t.ID\n  AND t.grade IS NOT NULL\n  AND t.grade <> \'F\'\nGROUP BY s.ID, s.name;')">Ver respuesta</button>
    </div>
  </div>

  <!-- INT.8 error detection -->
  <div class="quiz-card" data-quiz="qInt8">
    <div class="q-header"><span class="q-badge mc">Detectar el error</span></div>
    <div class="q-text">El siguiente SQL tiene un problema. ¿Cuál es?<br><br><code>SELECT dept_name, ID, avg(salary) FROM instructor GROUP BY dept_name;</code></div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Falta la cláusula WHERE</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>ID no está en GROUP BY ni es argumento de función agregada</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>avg(salary) no puede usarse sin HAVING</span></div>
    </div>
    <div class="quiz-feedback" id="fb-qInt8"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('qInt8','b','Correcto. Todos los atributos en SELECT que no son agregados DEBEN aparecer en GROUP BY. ID no está en GROUP BY, lo que hace la consulta inválida.','ID no está en GROUP BY ni es argumento de una función agregada. Todo atributo no agregado en SELECT debe estar en GROUP BY.')">Verificar</button></div>
  </div>

  <!-- INT.10 -->
  <div class="quiz-card" data-quiz="qInt10">
    <div class="q-header"><span class="q-badge mc">Integridad referencial</span></div>
    <div class="q-text">Se intenta eliminar el departamento 'Physics' pero existen instructores asignados. ¿Qué ocurre si la FK tiene <code>ON DELETE CASCADE</code>?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>La operación falla con error</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Se eliminan automáticamente todos los instructores de Physics (y potencialmente en cadena)</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>dept_name de los instructores se pone a NULL</span></div>
    </div>
    <div class="quiz-feedback" id="fb-qInt10"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('qInt10','b','Correcto. ON DELETE CASCADE propaga la eliminación: todos los instructores de Physics se eliminan, y potencialmente las tuplas que los referencian en otras tablas también.','CASCADE elimina en cadena todos los registros que referencian al departamento eliminado.')">Verificar</button></div>
  </div>
</div>

<!-- ============================================================ -->
<!--              RESUMEN FINAL Y SCORE                            -->
<!-- ============================================================ -->
