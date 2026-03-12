# Introducción a los Sistemas de Bases de Datos — Capítulo 1

<div class="chapter-divider" id="cap1">
  <div class="cd-num">Capítulo 1</div>
  <h2>Introducción a los Sistemas de Bases de Datos</h2>
</div>

<!-- 1.1 -->
<div class="section" id="s1-1">
  <h2>1.1 Conceptos Fundamentales</h2>

  <h3>¿Qué es un DBMS?</h3>
  <p>Un <strong>Sistema Gestor de Bases de Datos</strong> (DBMS — Database Management System) es una colección de datos interrelacionados junto con un conjunto de programas que permiten acceder a esos datos. Su objetivo primario es proporcionar una forma <strong>conveniente y eficiente</strong> de almacenar y recuperar información.</p>
  <p>La colección de datos se denomina <strong>base de datos</strong> (database) y contiene información relevante para una empresa u organización.</p>

  <h3>Aplicaciones de los Sistemas de Bases de Datos</h3>
  <ul>
    <li><strong>Información empresarial:</strong> Ventas, contabilidad, recursos humanos.</li>
    <li><strong>Banca y finanzas:</strong> Cuentas, préstamos, transacciones.</li>
    <li><strong>Universidades:</strong> Estudiantes, inscripciones, calificaciones.</li>
    <li><strong>Aerolíneas:</strong> Reservaciones e información de vuelos.</li>
    <li><strong>Servicios web:</strong> Redes sociales, comercio en línea.</li>
  </ul>

  <h3>Dos Modos de Uso</h3>
  <ul>
    <li><strong>OLTP (Procesamiento de transacciones en línea):</strong> Muchos usuarios acceden y actualizan pequeñas cantidades de datos simultáneamente.</li>
    <li><strong>Analytics / Data Mining:</strong> Procesamiento de datos para descubrir patrones, modelos predictivos y decisiones de negocio.</li>
  </ul>

  <!-- Flashcards -->
  <h4>🃏 Flashcards — Conceptos fundamentales</h4>
  <p class="flashcard-hint">Haz clic en cada tarjeta para ver la definición</p>
  <div class="flashcard-container">
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">DBMS</div></div>
        <div class="flashcard-back">Colección de datos interrelacionados + programas para accederlos. Provee almacenamiento y recuperación conveniente y eficiente.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">OLTP</div></div>
        <div class="flashcard-back">Procesamiento de transacciones en línea. Muchos usuarios leen y modifican pequeñas cantidades de datos simultáneamente.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">Término</div><div class="fc-term">Analytics</div></div>
        <div class="flashcard-back">Procesamiento de grandes volúmenes de datos para descubrir patrones, construir modelos predictivos y apoyar decisiones.</div>
      </div>
    </div>
  </div>
</div>

<!-- 1.2 -->
<div class="section" id="s1-2">
  <h2>1.2 Propósito de los Sistemas de Bases de Datos</h2>
  <p>Para entender por qué existen los DBMS, consideremos los problemas del procesamiento de archivos tradicional:</p>

  <div class="table-wrap">
  <table>
    <thead><tr><th>#</th><th>Problema</th><th>Descripción</th></tr></thead>
    <tbody>
      <tr><td>1</td><td><strong>Redundancia e inconsistencia</strong></td><td>Datos duplicados en varios archivos; si se actualiza en un lugar pero no en otro, se vuelven inconsistentes.</td></tr>
      <tr><td>2</td><td><strong>Dificultad de acceso</strong></td><td>Cada consulta nueva necesita un programa nuevo; no hay forma genérica de recuperar datos.</td></tr>
      <tr><td>3</td><td><strong>Aislamiento de datos</strong></td><td>Datos dispersos en múltiples archivos con distintos formatos dificultan nuevas aplicaciones.</td></tr>
      <tr><td>4</td><td><strong>Problemas de integridad</strong></td><td>Restricciones de consistencia difíciles de imponer cuando están en múltiples programas.</td></tr>
      <tr><td>5</td><td><strong>Falta de atomicidad</strong></td><td>Operaciones parciales (ej: transferencia bancaria) pueden dejar datos inconsistentes.</td></tr>
      <tr><td>6</td><td><strong>Acceso concurrente</strong></td><td>Dos procesos modificando el mismo dato simultáneamente producen resultados incorrectos.</td></tr>
      <tr><td>7</td><td><strong>Problemas de seguridad</strong></td><td>Difícil restringir acceso a partes específicas según el rol del usuario.</td></tr>
    </tbody>
  </table>
  </div>

  <div class="callout tip">
    <strong>💡 Conclusión clave:</strong> Todos estos problemas motivaron el desarrollo de los DBMS en la década de 1960-1970. Los DBMS resuelven cada uno mediante mecanismos integrados.
  </div>

  <!-- Quiz: problemas de archivo -->
  <div class="quiz-card" data-quiz="q1-2a">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">Dos cajeros de banco leen el saldo $10,000 simultáneamente y cada uno resta $500. ¿Cuál será el saldo final <strong>incorrecto</strong> y cuál problema lo causa?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>$9,000 — Problema de atomicidad</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>$9,500 — Anomalía de acceso concurrente</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>$9,500 — Redundancia de datos</span></div>
      <div class="quiz-opt" data-val="d" onclick="selectOpt(this)"><span class="opt-marker">D</span><span>$10,000 — Aislamiento de datos</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q1-2a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q1-2a','b','Correcto. Ambos leen $10,000. Uno escribe $9,500 y el otro también $9,500. El correcto sería $9,000. Esto es una anomalía de acceso concurrente.','El saldo queda en $9,500 (no $9,000) porque ambos leyeron el valor original antes de que el otro actualizara. Es una anomalía de acceso concurrente.')">Verificar</button></div>
  </div>
</div>

<!-- 1.3 -->
<div class="section" id="s1-3">
  <h2>1.3 Vista de los Datos</h2>

  <h3>Modelos de Datos</h3>
  <ul>
    <li><strong>Modelo Relacional:</strong> Usa tablas (relaciones) para representar datos. El modelo más ampliamente usado.</li>
    <li><strong>Modelo Entidad-Relación (E-R):</strong> Usa entidades y relaciones entre ellas. Muy usado para diseño.</li>
    <li><strong>Modelo Semi-estructurado:</strong> Permite datos con distintos conjuntos de atributos (JSON, XML).</li>
    <li><strong>Modelo Orientado a Objetos:</strong> Integra conceptos de POO con el modelo relacional.</li>
  </ul>

  <h3>Abstracción de Datos — Los Tres Niveles</h3>
  <ul>
    <li><strong>Nivel físico:</strong> Cómo se almacenan los datos en disco. Estructuras de datos complejas (índices, bloques).</li>
    <li><strong>Nivel lógico:</strong> QUÉ datos hay y sus relaciones. Programadores y DBAs trabajan aquí.</li>
    <li><strong>Nivel de vista:</strong> Solo una parte de la BD relevante para un usuario particular. Provee seguridad.</li>
  </ul>

  <h3>Instancias y Esquemas</h3>
  <ul>
    <li><strong>Esquema:</strong> Diseño lógico general (análogo a definición de tipo). Raramente cambia.</li>
    <li><strong>Instancia:</strong> Datos reales almacenados en un momento dado (análogo al valor de una variable).</li>
    <li><strong>Independencia física de datos:</strong> Las aplicaciones no dependen del esquema físico.</li>
  </ul>

  <!-- Matching exercise -->
  <div class="quiz-card" data-quiz="match1-3">
    <div class="q-header"><span class="q-badge match">Emparejar</span></div>
    <div class="q-text">Empareja cada nivel de abstracción con su descripción (selecciona uno de cada columna):</div>
    <div class="match-exercise" id="match1-3">
      <div class="match-cols">
        <div class="match-col">
          <h4>Nivel</h4>
          <div class="match-item" data-match="left" data-pair="1" onclick="selectMatch(this,'match1-3')">Físico</div>
          <div class="match-item" data-match="left" data-pair="2" onclick="selectMatch(this,'match1-3')">Lógico</div>
          <div class="match-item" data-match="left" data-pair="3" onclick="selectMatch(this,'match1-3')">Vista</div>
        </div>
        <div class="match-col">
          <h4>Descripción</h4>
          <div class="match-item" data-match="right" data-pair="3" onclick="selectMatch(this,'match1-3')">Subconjunto de la BD visible al usuario final</div>
          <div class="match-item" data-match="right" data-pair="1" onclick="selectMatch(this,'match1-3')">Cómo se almacenan los datos en disco</div>
          <div class="match-item" data-match="right" data-pair="2" onclick="selectMatch(this,'match1-3')">Qué datos hay y sus relaciones</div>
        </div>
      </div>
    </div>
    <div class="quiz-feedback" id="fb-match1-3"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkMatch('match1-3')">Verificar</button><button class="btn btn-secondary" onclick="resetMatch('match1-3')">Reiniciar</button></div>
  </div>
</div>

<!-- 1.4 -->
<div class="section" id="s1-4">
  <h2>1.4 Lenguajes de Base de Datos</h2>

  <h3>DDL — Lenguaje de Definición de Datos</h3>
  <p>Permite especificar el esquema de la BD. Genera salida en el <strong>diccionario de datos</strong> (metadatos). Restricciones definibles:</p>
  <ul>
    <li><strong>Restricciones de dominio:</strong> Cada atributo tiene un tipo de valores.</li>
    <li><strong>Integridad referencial:</strong> Valores deben existir en la relación referenciada.</li>
    <li><strong>Autorización:</strong> Diferentes usuarios con diferentes permisos.</li>
  </ul>

  <h3>DML — Lenguaje de Manipulación de Datos</h3>
  <ul>
    <li><strong>DML procedimental:</strong> El usuario especifica QUÉ datos necesita Y CÓMO obtenerlos.</li>
    <li><strong>DML declarativo:</strong> El usuario especifica solo QUÉ datos necesita. SQL es un ejemplo.</li>
  </ul>

  <div class="quiz-card" data-quiz="q1-4a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">Un DML procedimental requiere que el usuario especifique tanto qué datos necesita como cómo obtenerlos.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q1-4a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q1-4a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q1-4a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q1-4a','true','Correcto. Los DML procedimentales requieren tanto el QUÉ como el CÓMO. Los declarativos (como SQL) solo requieren el QUÉ.','Los DML procedimentales SÍ requieren ambos: qué datos y cómo obtenerlos.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q1-4b">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">El diccionario de datos es una tabla especial que puede ser modificada directamente por cualquier usuario.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q1-4b')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q1-4b')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q1-4b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q1-4b','false','Correcto. El diccionario de datos contiene metadatos y solo puede ser accedido y actualizado por el sistema de BD, no por usuarios regulares.','FALSO. El diccionario de datos solo puede ser accedido y actualizado por el propio sistema de BD, no por usuarios regulares.')">Verificar</button></div>
  </div>
</div>

<!-- 1.5/1.6 -->
<div class="section" id="s1-5">
  <h2>1.5 Diseño y Motor del DBMS</h2>

  <h3>Fases del Diseño</h3>
  <ol>
    <li><strong>Fase conceptual:</strong> Caracterizar necesidades de datos → esquema conceptual (modelo E-R).</li>
    <li><strong>Fase lógica:</strong> Mapear al modelo de datos del DBMS (ej: relacional).</li>
    <li><strong>Fase física:</strong> Organización de archivos, estructuras de almacenamiento.</li>
  </ol>

  <h3>Componentes del Motor</h3>
  <ul>
    <li><strong>Gestor de almacenamiento:</strong> Autorización, transacciones, archivos, buffer.</li>
    <li><strong>Procesador de consultas:</strong> Intérprete DDL, compilador DML, motor de evaluación.</li>
    <li><strong>Gestor de transacciones:</strong> Garantiza propiedades ACID.</li>
  </ul>

  <h4>🃏 Flashcards — Propiedades ACID</h4>
  <p class="flashcard-hint">Clic para voltear</p>
  <div class="flashcard-container">
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">ACID</div><div class="fc-term">Atomicidad</div></div>
        <div class="flashcard-back">La transacción ocurre en su totalidad o no ocurre en absoluto (todo-o-nada).</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">ACID</div><div class="fc-term">Consistencia</div></div>
        <div class="flashcard-back">La BD permanece en estado consistente después de la transacción.</div>
      </div>
    </div>
    <div class="flashcard" onclick="this.classList.toggle('flipped')">
      <div class="flashcard-inner">
        <div class="flashcard-front"><div class="fc-label">ACID</div><div class="fc-term">Durabilidad</div></div>
        <div class="flashcard-back">Los cambios de una transacción confirmada (committed) persisten aun si ocurre un fallo del sistema.</div>
      </div>
    </div>
  </div>

  <h3>Arquitectura de Aplicaciones</h3>
  <ul>
    <li><strong>Dos capas:</strong> Aplicación en cliente → BD directamente.</li>
    <li><strong>Tres capas:</strong> Cliente → Servidor de aplicación → BD. Mejor seguridad y rendimiento.</li>
  </ul>

  <h3>Usuarios y Administradores</h3>
  <ul>
    <li><strong>Usuarios ingenuos:</strong> Interactúan mediante interfaces predefinidas.</li>
    <li><strong>Programadores de aplicación:</strong> Escriben programas que interactúan con la BD.</li>
    <li><strong>Usuarios sofisticados:</strong> Usan lenguajes de consulta directamente.</li>
    <li><strong>DBA:</strong> Control central: esquema, almacenamiento, autorización, mantenimiento.</li>
  </ul>

  <div class="quiz-card" data-quiz="q1-5a">
    <div class="q-header"><span class="q-badge tf">Verdadero / Falso</span></div>
    <div class="q-text">La arquitectura de tres capas ofrece mejor seguridad que la de dos capas porque la lógica de negocio está en el servidor de aplicación, no en el cliente.</div>
    <div class="tf-options">
      <div class="tf-btn" onclick="selectTF(this,'q1-5a')" data-val="true">Verdadero</div>
      <div class="tf-btn" onclick="selectTF(this,'q1-5a')" data-val="false">Falso</div>
    </div>
    <div class="quiz-feedback" id="fb-q1-5a"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkTF('q1-5a','true','Correcto. En tres capas, la lógica de negocio y el acceso directo a BD están en el servidor de aplicación, protegiendo la BD de accesos no autorizados.','VERDADERO. En la arquitectura de tres capas el cliente no accede directamente a la BD, mejorando la seguridad.')">Verificar</button></div>
  </div>

  <div class="quiz-card" data-quiz="q1-5b">
    <div class="q-header"><span class="q-badge mc">Opción múltiple</span></div>
    <div class="q-text">Una cuenta bancaria tiene $10,000. Se procesan dos retiros simultáneos de $500 y $100 en paralelo (ambos leen el saldo original). ¿Cuál podría ser el saldo incorrecto y cuál debería ser el correcto?</div>
    <div class="quiz-options">
      <div class="quiz-opt" data-val="a" onclick="selectOpt(this)"><span class="opt-marker">A</span><span>Incorrecto: $9,500 o $9,900 — Correcto: $9,400</span></div>
      <div class="quiz-opt" data-val="b" onclick="selectOpt(this)"><span class="opt-marker">B</span><span>Incorrecto: $9,400 — Correcto: $9,500</span></div>
      <div class="quiz-opt" data-val="c" onclick="selectOpt(this)"><span class="opt-marker">C</span><span>Incorrecto: $9,000 — Correcto: $9,400</span></div>
    </div>
    <div class="quiz-feedback" id="fb-q1-5b"></div>
    <div class="quiz-actions"><button class="btn btn-primary" onclick="checkQuiz('q1-5b','a','Correcto. Ambos leen $10,000. El primero escribe $9,500 (10,000−500) y el segundo $9,900 (10,000−100). El último en escribir gana. El correcto es $9,400.','El resultado depende de cuál escribe último: $9,500 o $9,900. El valor correcto debería ser $9,400 (10,000 − 500 − 100).')">Verificar</button></div>
  </div>
</div>


<!-- ============================================================ -->
<!--                    CAPÍTULO 2                                 -->
<!-- ============================================================ -->
