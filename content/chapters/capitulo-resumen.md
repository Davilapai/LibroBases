# Conceptos Clave para el Examen — Resumen

<div class="chapter-divider" id="capResumen">
  <div class="cd-num">Resumen</div>
  <h2>Conceptos Clave para el Examen</h2>
</div>

<div class="section" id="sResumen">
  <h2>Resumen General</h2>

  <div class="table-wrap">
  <table>
    <thead><tr><th>Tema</th><th>Conceptos clave</th></tr></thead>
    <tbody>
      <tr><td><strong>Modelo Relacional</strong></td><td>Tablas, tuplas, atributos, dominios atómicos, sin duplicados (matemáticamente)</td></tr>
      <tr><td><strong>Claves</strong></td><td>Superclave ⊇ Candidata ⊇ Primaria. FK referencia PK de otra tabla</td></tr>
      <tr><td><strong>Álgebra Relacional</strong></td><td>σ (select), Π (project), ρ (rename), × (producto), ⋈ (join), ∪, ∩, −</td></tr>
      <tr><td><strong>DDL</strong></td><td>CREATE TABLE, ALTER TABLE, DROP TABLE. PK, FK, NOT NULL, UNIQUE, CHECK</td></tr>
      <tr><td><strong>DML</strong></td><td>SELECT-FROM-WHERE, DISTINCT, ORDER BY, BETWEEN, LIKE, GROUP BY + HAVING</td></tr>
      <tr><td><strong>Subconsultas</strong></td><td>IN/NOT IN, SOME/ALL, EXISTS/NOT EXISTS, FROM, WITH</td></tr>
      <tr><td><strong>Joins</strong></td><td>INNER (default), LEFT/RIGHT/FULL OUTER. NATURAL, USING, ON</td></tr>
      <tr><td><strong>Vistas</strong></td><td>CREATE VIEW, vistas materializadas, condiciones de actualización</td></tr>
      <tr><td><strong>Transacciones</strong></td><td>COMMIT/ROLLBACK, atomicidad, ACID</td></tr>
      <tr><td><strong>Integridad</strong></td><td>NOT NULL, UNIQUE, CHECK, FK con CASCADE/SET NULL/SET DEFAULT</td></tr>
      <tr><td><strong>Autorización</strong></td><td>GRANT/REVOKE, roles, WITH GRANT OPTION, cascading revocation</td></tr>
    </tbody>
  </table>
  </div>

  <div class="score-summary" id="scoreSummary">
    <div class="big-score" id="finalScore">—</div>
    <p>Ejercicios completados correctamente</p>
    <div style="margin-top:16px">
      <button class="btn btn-primary" onclick="calcScore()">Calcular mi puntuación</button>
      <button class="btn btn-secondary" onclick="resetAll()" style="margin-left:8px">Reiniciar todo</button>
    </div>
  </div>
</div>

