# SQL Avanzado — Capítulo 5

## Introducción

El SQL básico (visto en capítulos anteriores) permite realizar consultas poderosas sobre bases de datos relacionales. Sin embargo, las aplicaciones reales necesitan capacidades adicionales: conectar SQL con lenguajes de programación, definir lógica reutilizable dentro de la base de datos, automatizar acciones ante eventos, y realizar análisis estadísticos avanzados.

Este capítulo abarca los siguientes temas fundamentales:

- **Acceso a SQL desde lenguajes de programación** (JDBC, Python, ODBC, SQL embebido)
- **Funciones y procedimientos almacenados** en SQL
- **Triggers** (disparadores) para automatizar acciones
- **Consultas recursivas** para jerarquías y clausura transitiva
- **Agregación avanzada**: ranking, ventanas, pivoting, rollup y cube

---

## Contexto en Oracle SQL Developer

Oracle SQL Developer es un entorno visual para trabajar con bases de datos Oracle. En este capítulo encontrarás contenido directamente aplicable a Oracle:

- **JDBC** permite conectarse a Oracle desde Java usando el driver `jdbc:oracle:thin:`.
- **PL/SQL** es el lenguaje procedural de Oracle, equivalente al SQL estándar PSM descrito en el capítulo. Tiene diferencias sintácticas importantes (se documentan en las secciones correspondientes).
- Los **triggers** en Oracle tienen diferencias con el estándar SQL:1999 (ej. no se puede hacer `ROLLBACK` directamente; se usa `RAISE_APPLICATION_ERROR`).
- Las **consultas recursivas** en Oracle se expresan con `START WITH / CONNECT BY PRIOR` (sintaxis heredada) o con `WITH RECURSIVE` (desde Oracle 12c, con `UNION ALL` obligatorio).
- Las funciones de **ranking y windowing** están completamente soportadas en Oracle SQL Developer.

Puedes ejecutar todos los bloques de código SQL de este documento directamente en la hoja de trabajo de Oracle SQL Developer.

---

## Conceptos Fundamentales

### Concepto 1: SQL Dinámico vs. SQL Embebido

**Definición simple:** Son dos formas de integrar SQL dentro de un lenguaje de programación general.

**Explicación profunda:**

- **SQL Dinámico:** El programa construye y envía consultas SQL en tiempo de ejecución, usando una API (como JDBC u ODBC). Las consultas son cadenas de texto que se procesan al momento de ejecutarse.
- **SQL Embebido:** Las sentencias SQL se escriben directamente en el código fuente del programa y un preprocesador las traduce antes de la compilación.

**¿Cuándo usar cada uno?**

| Característica | SQL Dinámico | SQL Embebido |
|---|---|---|
| Detección de errores | En tiempo de ejecución | En tiempo de compilación |
| Flexibilidad | Alta (consultas variables) | Limitada |
| Uso actual | Predominante (JDBC, ODBC) | Poco común en sistemas modernos |

**Ejemplo:** En JDBC (SQL Dinámico), una consulta se envía como String:

```java
stmt.executeQuery("SELECT * FROM instructor WHERE dept_name = 'CS'");
```

En SQL Embebido (C), la consulta está en el código antes de compilar:

```c
EXEC SQL SELECT salary INTO :host_var FROM instructor WHERE ID = :id;
```

---

### Concepto 2: Stored Procedures y Functions (Procedimientos y Funciones Almacenados)

**Definición simple:** Son bloques de código SQL reutilizables guardados dentro de la base de datos.

**Explicación profunda:**

Las **funciones** retornan un valor. Los **procedimientos** ejecutan acciones y pueden retornar valores a través de parámetros `OUT`.

Ventajas de almacenar lógica en la base de datos:
- Múltiples aplicaciones pueden reutilizarla.
- Un solo punto de cambio cuando las reglas de negocio cambian.
- Mejor rendimiento (el código ya está compilado en el servidor).

**Ejemplo de función:**

```sql
-- Cuenta el número de instructores de un departamento
CREATE OR REPLACE FUNCTION dept_count(dname IN instructor.dept_name%TYPE)
RETURN INTEGER AS
  d_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO d_count
  FROM instructor
  WHERE instructor.dept_name = dname;
  RETURN d_count;
END;
```

> **Nota Oracle:** En PL/SQL se usa `dname IN instructor.dept_name%TYPE` para tomar el tipo directamente del atributo de la tabla.

**Usando la función en una consulta:**

```sql
SELECT dept_name, budget
FROM department
WHERE dept_count(dept_name) > 12;
```

*Esta consulta retorna los departamentos con más de 12 instructores.*

---

### Concepto 3: Triggers (Disparadores)

**Definición simple:** Un trigger es una sentencia que la base de datos ejecuta automáticamente cuando ocurre un evento determinado (INSERT, UPDATE, DELETE).

**Explicación profunda:**

Un trigger tiene tres componentes clave:
1. **Evento:** qué acción lo activa (INSERT, UPDATE, DELETE).
2. **Condición:** una condición opcional que debe cumplirse para que el trigger actúe.
3. **Acción:** lo que hace el trigger (puede ser otra sentencia SQL).

Los triggers pueden ejecutarse **BEFORE** (antes) o **AFTER** (después) del evento.

**Ejemplo básico:**

```sql
-- Trigger que verifica integridad referencial al insertar en 'section'
CREATE TRIGGER timeslot_check1 AFTER INSERT ON section
REFERENCING NEW ROW AS nrow
FOR EACH ROW
WHEN (nrow.time_slot_id NOT IN (
    SELECT time_slot_id FROM time_slot))
BEGIN
  ROLLBACK;
END;
```

> **Nota Oracle:** En Oracle no se permite `ROLLBACK` dentro de un trigger. Se usa: `RAISE_APPLICATION_ERROR(-20001, 'Mensaje de error');`

---

### Concepto 4: Consultas Recursivas

**Definición simple:** Permiten que una consulta SQL se refiera a sí misma para explorar jerarquías o relaciones transitivas.

**Explicación profunda:**

La **clausura transitiva** de una relación contiene todos los pares (A, B) donde B es prerequisito directo o indirecto de A.

Casos de uso típicos: prerrequisitos de cursos, jerarquías organizacionales, componentes de productos.

**Sintaxis estándar SQL:**

```sql
WITH RECURSIVE rec_prereq(course_id, prereq_id) AS (
    -- Caso base: prerequisitos directos
    SELECT course_id, prereq_id FROM prereq
    UNION
    -- Caso recursivo: extender un nivel más
    SELECT rec_prereq.course_id, prereq.prereq_id
    FROM rec_prereq, prereq
    WHERE rec_prereq.prereq_id = prereq.course_id
)
SELECT * FROM rec_prereq;
```

> **Nota Oracle:** Desde Oracle 12c se acepta esta sintaxis, pero requiere `UNION ALL` en lugar de `UNION`. La sintaxis clásica de Oracle es `START WITH ... CONNECT BY PRIOR`.

---

### Concepto 5: Agregación Avanzada (Ranking, Windowing, Rollup, Cube)

**Definición simple:** SQL ofrece funciones especiales para calcular rangos, promedios móviles y totales acumulados sobre grupos de datos.

**Explicación profunda:**

| Función/Operación | Propósito |
|---|---|
| `RANK()` | Asigna un rango; deja huecos en empates |
| `DENSE_RANK()` | Asigna un rango continuo sin huecos |
| `ROW_NUMBER()` | Número de fila único en el orden |
| `NTILE(n)` | Divide en n grupos iguales (cuartiles, deciles...) |
| `OVER (...)` | Define la ventana sobre la que actúa la función |
| `PARTITION BY` | Aplica la función dentro de subgrupos |
| `ROLLUP` | Subtotales jerárquicos |
| `CUBE` | Subtotales para todas las combinaciones posibles |
| `PIVOT` | Convierte valores de filas en columnas |

---

## Explicación Detallada del Contenido del PDF

### 5.1 Acceso a SQL desde un Lenguaje de Programación

Existen dos razones por las que un programador necesita combinar SQL con un lenguaje general:

1. **No todas las consultas son expresables en SQL puro.** SQL carece del poder expresivo completo de lenguajes como Java, Python o C.
2. **Las acciones no declarativas** (imprimir reportes, interactuar con el usuario, enviar resultados a una GUI) no pueden hacerse desde SQL solo.

#### 5.1.1 JDBC (Java Database Connectivity)

JDBC es el estándar de API para conectar Java con bases de datos relacionales.

**Pasos fundamentales para usar JDBC:**

1. Abrir una conexión a la base de datos.
2. Crear un objeto `Statement` o `PreparedStatement`.
3. Ejecutar consultas o actualizaciones.
4. Procesar los resultados con `ResultSet`.
5. Cerrar recursos.

**Ejemplo completo de conexión y consulta:**

```java
import java.sql.*;

public static void JDBCexample(String userid, String passwd) {
    try (
        // 1. Abrir conexión a Oracle
        Connection conn = DriverManager.getConnection(
            "jdbc:oracle:thin:@db.yale.edu:1521:univdb",
            userid, passwd);
        Statement stmt = conn.createStatement();
    ) {
        // 2. Ejecutar INSERT (executeUpdate para DML/DDL)
        try {
            stmt.executeUpdate(
                "INSERT INTO instructor VALUES('77987','Kim','Physics',98000)");
        } catch (SQLException sqle) {
            System.out.println("No se pudo insertar: " + sqle);
        }

        // 3. Ejecutar SELECT (executeQuery para consultas)
        ResultSet rset = stmt.executeQuery(
            "SELECT dept_name, AVG(salary) " +
            "FROM instructor " +
            "GROUP BY dept_name");

        // 4. Iterar resultados
        while (rset.next()) {
            System.out.println(rset.getString("dept_name") + " " +
                               rset.getFloat(2));
        }
    } catch (Exception sqle) {
        System.out.println("Excepción: " + sqle);
    }
}
```

**Explicación del ejemplo:**
- `getConnection()` abre la conexión. El primer parámetro es la URL del servidor Oracle.
- `executeUpdate()` ejecuta sentencias que modifican datos (INSERT, UPDATE, DELETE, DDL). Retorna el número de filas afectadas.
- `executeQuery()` ejecuta SELECT y retorna un `ResultSet`.
- `rset.next()` avanza al siguiente registro; retorna `false` cuando no hay más.
- `rset.getString("dept_name")` obtiene el valor por nombre de columna; `rset.getFloat(2)` por posición.
- El bloque `try-with-resources` cierra automáticamente la conexión al finalizar.

---

#### Prepared Statements (Sentencias Preparadas)

Un `PreparedStatement` permite definir una consulta con parámetros (`?`) que se rellenan antes de ejecutar. Ventajas:

- **Rendimiento:** la consulta se compila una vez y se reutiliza.
- **Seguridad:** previene ataques de **SQL Injection**.

```java
PreparedStatement pStmt = conn.prepareStatement(
    "INSERT INTO instructor VALUES(?, ?, ?, ?)");

pStmt.setString(1, "88877");
pStmt.setString(2, "Perry");
pStmt.setString(3, "Finance");
pStmt.setInt(4, 125000);
pStmt.executeUpdate();  // Inserta ('88877','Perry','Finance',125000)

pStmt.setString(1, "88878"); // Solo cambia el primer parámetro
pStmt.executeUpdate();       // Inserta ('88878','Perry','Finance',125000)
```

**¿Por qué evitar la concatenación de strings?**

Si un usuario malintencionado ingresa `X' OR 'Y' = 'Y` como nombre, la consulta concatenada se vuelve:

```sql
SELECT * FROM instructor WHERE name = 'X' OR 'Y' = 'Y'
```

Esto retorna **todos** los registros. Con `PreparedStatement`, los caracteres especiales se escapan automáticamente.

> ⚠️ **Regla de oro:** Nunca construyas sentencias SQL concatenando strings con datos del usuario. Usa siempre `PreparedStatement`.

---

#### Metadata (Metadatos)

JDBC permite consultar la estructura de la base de datos en tiempo de ejecución:

```java
// Metadatos de columnas de un ResultSet
ResultSetMetaData rsmd = rs.getMetaData();
for (int i = 1; i <= rsmd.getColumnCount(); i++) {
    System.out.println(rsmd.getColumnName(i));    // Nombre de columna
    System.out.println(rsmd.getColumnTypeName(i)); // Tipo de dato
}

// Metadatos de la base de datos
DatabaseMetaData dbmd = conn.getMetaData();
ResultSet rs = dbmd.getColumns(null, "univdb", "department", "%");
while (rs.next()) {
    System.out.println(rs.getString("COLUMN_NAME") + " " +
                       rs.getString("TYPE_NAME"));
}
```

Métodos útiles de `DatabaseMetaData`: `getTables()`, `getPrimaryKeys()`, `getCrossReference()`.

---

#### Transacciones en JDBC

Por defecto, cada sentencia SQL es una transacción independiente con auto-commit. Para manejar transacciones manualmente:

```java
conn.setAutoCommit(false);  // Deshabilitar auto-commit

try {
    // ... operaciones SQL ...
    conn.commit();           // Confirmar cambios
} catch (Exception e) {
    conn.rollback();         // Revertir en caso de error
}
```

---

#### 5.1.2 Acceso desde Python

```python
import psycopg2

def PythonDatabaseExample(userid, passwd):
    try:
        conn = psycopg2.connect(host="db.yale.edu", port=5432,
                                dbname="univdb", user=userid, password=passwd)
        cur = conn.cursor()
        try:
            # %s equivale a '?' de JDBC
            cur.execute("INSERT INTO instructor VALUES(%s, %s, %s, %s)",
                        ("77987", "Kim", "Physics", 98000))
            conn.commit()
        except Exception as e:
            print("Error:", e)
            conn.rollback()

        cur.execute("SELECT dept_name, AVG(salary) FROM instructor GROUP BY dept_name")
        for dept in cur:
            print(dept[0], dept[1])
    except Exception as e:
        print("Excepción:", e)
```

> **Nota:** En Python no hay auto-commit; debes llamar a `conn.commit()` explícitamente. El driver `psycopg2` es para PostgreSQL; para Oracle se usa `cx_Oracle`.

---

#### 5.1.3 ODBC (Open Database Connectivity)

ODBC es un estándar de API para C/C++ (y otros lenguajes) que permite conectarse a cualquier base de datos que lo soporte.

```c
void ODBCexample() {
    HENV env;
    HDBC conn;
    SQLAllocEnv(&env);
    SQLAllocConnect(env, &conn);
    SQLConnect(conn, "db.yale.edu", SQL_NTS, "avi", SQL_NTS,
               "avipasswd", SQL_NTS);

    char deptname[80];
    float salary;
    int lenOut1, lenOut2;
    HSTMT stmt;

    char *sqlquery = "SELECT dept_name, SUM(salary) "
                     "FROM instructor GROUP BY dept_name";
    SQLAllocStmt(conn, &stmt);
    RETCODE error = SQLExecDirect(stmt, sqlquery, SQL_NTS);

    if (error == SQL_SUCCESS) {
        SQLBindCol(stmt, 1, SQL_C_CHAR, deptname, 80, &lenOut1);
        SQLBindCol(stmt, 2, SQL_C_FLOAT, &salary, 0, &lenOut2);
        while (SQLFetch(stmt) == SQL_SUCCESS) {
            printf("%s %g\n", deptname, salary);
        }
    }
    SQLFreeStmt(stmt, SQL_DROP);
    SQLDisconnect(conn);
    SQLFreeConnect(conn);
    SQLFreeEnv(env);
}
```

**Diferencias clave ODBC vs JDBC:**
- ODBC es para C/C++; JDBC es para Java.
- ODBC usa `SQLExecDirect` + `SQLBindCol` + `SQLFetch`; JDBC usa `executeQuery()` + `ResultSet`.
- Ambos soportan sentencias preparadas con `?` como placeholder.

---

#### 5.1.4 SQL Embebido

En SQL embebido, las sentencias SQL se escriben directamente en el código del programa y un **preprocesador** las traduce antes de compilar.

```c
EXEC SQL SELECT salary INTO :host_var FROM instructor WHERE ID = :id;
```

- `:host_var` y `:id` son variables del lenguaje anfitrión, identificadas con `:`.
- Hoy en día se prefiere SQL dinámico (JDBC/ODBC) sobre SQL embebido, por mayor flexibilidad y compatibilidad.
- Excepción notable: **LINQ** de Microsoft, que integra consultas directamente en C#/VB.NET.

---

### 5.2 Funciones y Procedimientos

#### Funciones SQL

Una **función** retorna un valor calculado y puede usarse directamente en sentencias SELECT.

```sql
-- Estándar SQL
CREATE FUNCTION dept_count(dept_name VARCHAR(20))
RETURNS INTEGER
BEGIN
  DECLARE d_count INTEGER;
  SELECT COUNT(*) INTO d_count
  FROM instructor
  WHERE instructor.dept_name = dept_name;
  RETURN d_count;
END;
```

**En Oracle PL/SQL (diferencias marcadas):**

```sql
CREATE OR REPLACE FUNCTION dept_count(dname IN instructor.dept_name%TYPE)
RETURN INTEGER AS
  d_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO d_count
  FROM instructor
  WHERE instructor.dept_name = dname;
  RETURN d_count;
END;
```

> En PL/SQL: `RETURNS` → `RETURN`, no hay `BEGIN...END` anidado, se usa `AS` en vez de `BEGIN` al inicio, y el tipo puede referenciarse con `%TYPE`.

---

#### Funciones de Tabla (Table Functions)

Las funciones de tabla retornan una tabla completa como resultado.

```sql
CREATE FUNCTION instructor_of(dept_name VARCHAR(20))
RETURNS TABLE (
    ID       VARCHAR(5),
    name     VARCHAR(20),
    dept_name VARCHAR(20),
    salary   NUMERIC(8,2))
RETURN TABLE (
    SELECT ID, name, dept_name, salary
    FROM instructor
    WHERE instructor.dept_name = instructor_of.dept_name);
```

**Uso:**

```sql
SELECT * FROM TABLE(instructor_of('Finance'));
```

*Retorna todos los instructores del departamento de Finanzas. Equivale a una vista parametrizada.*

---

#### Procedimientos

A diferencia de las funciones, los procedimientos no retornan un valor directamente, sino a través de parámetros `OUT`.

```sql
CREATE PROCEDURE dept_count_proc(
    IN  dept_name VARCHAR(20),
    OUT d_count   INTEGER)
BEGIN
  SELECT COUNT(*) INTO d_count
  FROM instructor
  WHERE instructor.dept_name = dept_count_proc.dept_name;
END;
```

**Invocación:**

```sql
DECLARE d_count INTEGER;
CALL dept_count_proc('Physics', d_count);
```

**Parámetros `IN` vs `OUT`:**
- `IN`: valor que el llamador proporciona al procedimiento.
- `OUT`: valor que el procedimiento devuelve al llamador.

---

#### Constructores del Lenguaje Procedural (PSM)

El estándar SQL define el **Persistent Storage Module (PSM)** para programación procedural:

```sql
-- Variables y asignación
DECLARE n INTEGER DEFAULT 0;
SET n = n + 1;

-- Bucle FOR sobre consulta
FOR r AS SELECT budget FROM department WHERE dept_name = 'Music'
DO
  SET n = n - r.budget;
END FOR;

-- Bucle WHILE
WHILE boolean_expr DO
  sentencias;
END WHILE;

-- REPEAT ... UNTIL
REPEAT
  sentencias;
UNTIL boolean_expr
END REPEAT;

-- IF ... THEN ... ELSEIF ... ELSE
IF condicion THEN
  sentencias;
ELSEIF otra_condicion THEN
  sentencias;
ELSE
  sentencias;
END IF;
```

---

#### Manejo de Excepciones

```sql
DECLARE out_of_classroom_seats CONDITION;
DECLARE EXIT HANDLER FOR out_of_classroom_seats
BEGIN
  -- acción al salir
END;

-- Dentro del bloque, lanzar la excepción:
SIGNAL out_of_classroom_seats;
```

**Ejemplo completo — Función registerStudent:**

```sql
CREATE FUNCTION registerStudent(
    IN  s_id         VARCHAR(5),
    IN  s_courseid   VARCHAR(8),
    IN  s_secid      VARCHAR(8),
    IN  s_semester   VARCHAR(6),
    IN  s_year       NUMERIC(4,0),
    OUT errorMsg     VARCHAR(100))
RETURNS INTEGER
BEGIN
  DECLARE currEnrol INT;
  SELECT COUNT(*) INTO currEnrol
  FROM takes
  WHERE course_id = s_courseid AND sec_id = s_secid
    AND semester = s_semester AND year = s_year;

  DECLARE limit INT;
  SELECT capacity INTO limit
  FROM classroom NATURAL JOIN section
  WHERE course_id = s_courseid AND sec_id = s_secid
    AND semester = s_semester AND year = s_year;

  IF (currEnrol < limit) THEN
  BEGIN
    INSERT INTO takes VALUES
        (s_id, s_courseid, s_secid, s_semester, s_year, NULL);
    RETURN(0);
  END;
  END IF;

  SET errorMsg = 'Enrollment limit reached for course ' || s_courseid
                 || ' section ' || s_secid;
  RETURN(-1);
END;
```

*Retorna 0 si el registro fue exitoso, -1 si el cupo estaba lleno. `errorMsg` explica el fallo.*

---

#### Rutinas en Lenguajes Externos

SQL permite definir funciones en C, Java, C#, etc.:

```sql
CREATE PROCEDURE dept_count_proc(IN dept_name VARCHAR(20), OUT count INTEGER)
LANGUAGE C
EXTERNAL NAME '/usr/bin/dept_count_proc';

CREATE FUNCTION dept_count(dept_name VARCHAR(20))
RETURNS INTEGER
LANGUAGE C
EXTERNAL NAME '/usr/bin/dept_count';
```

**Consideraciones de seguridad:**
- Código externo cargado directamente: riesgo de corromper la base de datos.
- Lenguajes seguros (Java, C#) pueden ejecutarse en un **sandbox** dentro del proceso de la BD.
- Oracle y IBM DB2 permiten funciones Java; SQL Server permite código CLR (C#/VB.NET); PostgreSQL soporta Perl, Python, Tcl.

---

### 5.3 Triggers

Un **trigger** es código que se ejecuta automáticamente como efecto secundario de una modificación en la base de datos.

#### Componentes de un Trigger

```
Evento  →  Condición  →  Acción
(INSERT/UPDATE/DELETE)   (WHEN ...)   (bloque SQL)
```

#### Ejemplo 1 — Integridad Referencial

```sql
-- Verifica que time_slot_id sea válido al insertar en section
CREATE TRIGGER timeslot_check1 AFTER INSERT ON section
REFERENCING NEW ROW AS nrow
FOR EACH ROW
WHEN (nrow.time_slot_id NOT IN (
    SELECT time_slot_id FROM time_slot))
BEGIN
  ROLLBACK;
END;

-- Verifica al borrar de time_slot que no queden referencias huérfanas
CREATE TRIGGER timeslot_check2 AFTER DELETE ON timeslot
REFERENCING OLD ROW AS orow
FOR EACH ROW
WHEN (orow.time_slot_id NOT IN (SELECT time_slot_id FROM time_slot)
  AND orow.time_slot_id IN    (SELECT time_slot_id FROM section))
BEGIN
  ROLLBACK;
END;
```

#### Ejemplo 2 — Actualización de Créditos Acumulados

```sql
-- Actualiza tot_cred del estudiante cuando aprueba una materia
CREATE TRIGGER credits_earned AFTER UPDATE OF takes ON grade
REFERENCING NEW ROW AS nrow
REFERENCING OLD ROW AS orow
FOR EACH ROW
WHEN (nrow.grade <> 'F' AND nrow.grade IS NOT NULL
  AND (orow.grade = 'F' OR orow.grade IS NULL))
BEGIN ATOMIC
  UPDATE student
  SET tot_cred = tot_cred + (
      SELECT credits FROM course WHERE course.course_id = nrow.course_id)
  WHERE student.id = nrow.id;
END;
```

#### Ejemplo 3 — BEFORE Trigger (corrección de dato)

```sql
-- Reemplaza calificación en blanco por NULL antes de insertar
CREATE TRIGGER setnull BEFORE UPDATE OF takes
REFERENCING NEW ROW AS nrow
FOR EACH ROW
WHEN (nrow.grade = ' ')
BEGIN ATOMIC
  SET nrow.grade = NULL;
END;
```

#### Ejemplo 4 — Reorden de Inventario

```sql
CREATE TRIGGER reorder AFTER UPDATE OF level ON inventory
REFERENCING OLD ROW AS orow, NEW ROW AS nrow
FOR EACH ROW
WHEN (nrow.level <= (SELECT level FROM minlevel WHERE minlevel.item = orow.item)
  AND orow.level >  (SELECT level FROM minlevel WHERE minlevel.item = orow.item))
BEGIN ATOMIC
  INSERT INTO orders
    (SELECT item, amount FROM reorder WHERE reorder.item = orow.item);
END;
```

#### Diferencias de Sintaxis por Sistema

| Característica | SQL Estándar | Oracle | MS SQL Server | PostgreSQL |
|---|---|---|---|---|
| `AFTER` | `AFTER` | `AFTER` | `ON` | `AFTER` |
| `REFERENCING NEW ROW AS` | Sí | Sí (sin `ROW`) | No (usa `inserted`) | No (usa `:new`) |
| `ROLLBACK` directo | Sí | No (usa `RAISE_APPLICATION_ERROR`) | No | `RAISE EXCEPTION` |
| `BEFORE` | Sí | Sí | `INSTEAD OF` | Sí |

#### Cuándo NO usar Triggers

- **No uses triggers** para implementar cascadas de clave foránea (`ON DELETE CASCADE`) — usa la restricción nativa.
- **No uses triggers** para mantener vistas materializadas — muchos sistemas lo hacen automáticamente.
- **No uses triggers** para replicación — los sistemas modernos tienen facilidades nativas.
- Los triggers pueden causar **cadenas infinitas** de activación. La mayoría de los sistemas limitan la profundidad de anidamiento (ej. 16 o 32 niveles).

---

### 5.4 Consultas Recursivas

#### Problema: Clausura Transitiva

Dada la relación `prereq(course_id, prereq_id)`:

| course_id | prereq_id |
|---|---|
| CS-347 | CS-319 |
| CS-319 | CS-315 |
| CS-319 | CS-101 |
| CS-315 | CS-190 |
| CS-190 | CS-101 |

¿Cuáles son todos los prerrequisitos (directos e indirectos) de CS-347?

Respuesta: CS-319, CS-315, CS-101, CS-190.

---

#### 5.4.1 Clausura Transitiva con Iteración

```sql
CREATE FUNCTION findAllPrereqs(cid VARCHAR(8))
RETURNS TABLE (course_id VARCHAR(8))
BEGIN
  CREATE TEMPORARY TABLE c_prereq    (course_id VARCHAR(8));
  CREATE TEMPORARY TABLE new_c_prereq(course_id VARCHAR(8));
  CREATE TEMPORARY TABLE temp        (course_id VARCHAR(8));

  INSERT INTO new_c_prereq
    SELECT prereq_id FROM prereq WHERE course_id = cid;

  REPEAT
    INSERT INTO c_prereq
      SELECT course_id FROM new_c_prereq;

    INSERT INTO temp
      (SELECT prereq.prereq_id
       FROM new_c_prereq, prereq
       WHERE new_c_prereq.course_id = prereq.course_id)
      EXCEPT
      (SELECT course_id FROM c_prereq);

    DELETE FROM new_c_prereq;
    INSERT INTO new_c_prereq SELECT * FROM temp;
    DELETE FROM temp;
  UNTIL NOT EXISTS (SELECT * FROM new_c_prereq)
  END REPEAT;

  RETURN TABLE c_prereq;
END;
```

**Evolución por iteración para CS-347:**

| Iteración | Nuevos en c_prereq |
|---|---|
| 0 | (vacío) |
| 1 | CS-319 |
| 2 | CS-319, CS-315, CS-101 |
| 3 | CS-319, CS-315, CS-101, CS-190 |
| 4 | (sin cambios → fin) |

---

#### 5.4.2 Recursión en SQL (WITH RECURSIVE)

```sql
WITH RECURSIVE rec_prereq(course_id, prereq_id) AS (
    -- Caso base
    SELECT course_id, prereq_id FROM prereq
    UNION
    -- Caso recursivo: un nivel más de profundidad
    SELECT rec_prereq.course_id, prereq.prereq_id
    FROM rec_prereq, prereq
    WHERE rec_prereq.prereq_id = prereq.course_id
)
SELECT * FROM rec_prereq
WHERE course_id = 'CS-347';
```

**Estructura obligatoria de una vista recursiva:**
1. **Base query** (no recursiva): punto de partida.
2. **Recursive query**: usa la misma vista, agregando un nivel más.
3. Terminadas con `UNION` (o `UNION ALL` en Oracle).

**Restricciones de monotonía** — La consulta recursiva NO puede usar:
- Agregación sobre la vista recursiva.
- `NOT EXISTS` en subconsulta que use la vista recursiva.
- `EXCEPT` cuyo lado derecho use la vista recursiva.

> **En Oracle:** Sintaxis clásica → `START WITH course_id = 'CS-347' CONNECT BY PRIOR course_id = prereq_id`. Desde Oracle 12c se acepta `WITH RECURSIVE` con `UNION ALL`.

---

### 5.5 Características Avanzadas de Agregación

#### 5.5.1 Ranking

```sql
-- Rango de estudiantes por GPA (con huecos en empates)
SELECT ID, RANK() OVER (ORDER BY GPA DESC) AS s_rank
FROM student_grades
ORDER BY s_rank;

-- DENSE_RANK: sin huecos
SELECT ID, DENSE_RANK() OVER (ORDER BY GPA DESC) AS s_rank
FROM student_grades;

-- Controlar NULLs
SELECT ID, RANK() OVER (ORDER BY GPA DESC NULLS LAST) AS s_rank
FROM student_grades;

-- Ranking por departamento (PARTITION BY)
SELECT ID, dept_name,
       RANK() OVER (PARTITION BY dept_name ORDER BY GPA DESC) AS dept_rank
FROM dept_grades
ORDER BY dept_name, dept_rank;

-- Top 5 estudiantes
SELECT *
FROM (SELECT ID, RANK() OVER (ORDER BY GPA DESC) AS s_rank
      FROM student_grades)
WHERE s_rank <= 5;
```

**Funciones de ranking disponibles:**

| Función | Descripción |
|---|---|
| `RANK()` | Rango con huecos en empates |
| `DENSE_RANK()` | Rango sin huecos |
| `ROW_NUMBER()` | Número de fila único |
| `PERCENT_RANK()` | Rango como fracción `(r-1)/(n-1)` |
| `CUME_DIST()` | Distribución acumulada `p/n` |
| `NTILE(n)` | Divide en n cubetas iguales |

**Cuartiles con NTILE:**

```sql
SELECT ID, NTILE(4) OVER (ORDER BY GPA DESC) AS quartile
FROM student_grades;
```

> En Oracle SQL Developer puedes ejecutar estas consultas directamente en la hoja de trabajo. Oracle soporta todas estas funciones de ventana.

---

#### 5.5.2 Windowing (Funciones de Ventana)

Las ventanas calculan agregados sobre rangos de filas, permitiendo **promedios móviles** y tendencias.

```sql
-- Promedio móvil de los últimos 3 años
SELECT year, AVG(num_credits)
    OVER (ORDER BY year ROWS 3 PRECEDING) AS avg_total_credits
FROM tot_credits;

-- Promedio de todos los años anteriores
SELECT year, AVG(num_credits)
    OVER (ORDER BY year ROWS UNBOUNDED PRECEDING) AS avg_total_credits
FROM tot_credits;

-- Ventana entre 3 anteriores y 2 posteriores
SELECT year, AVG(num_credits)
    OVER (ORDER BY year ROWS BETWEEN 3 PRECEDING AND 2 FOLLOWING) AS avg_total_credits
FROM tot_credits;

-- Ventana por departamento
SELECT dept_name, year, AVG(num_credits)
    OVER (PARTITION BY dept_name
          ORDER BY year ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)
    AS avg_total_credits
FROM tot_credits_dept;
```

**Visualización de ventana `ROWS 3 PRECEDING` para year=2019:**

```
[2017] [2018] [2019]  ← ventana de 3 filas
                 ↑ fila actual
```

---

#### 5.5.3 Pivoting (Tabla Cruzada)

El **pivot** convierte valores de filas en columnas. Dada la relación:

```
sales(item_name, color, clothes_size, quantity)
```

```sql
-- En Oracle / MS SQL Server
SELECT *
FROM sales
PIVOT (
    SUM(quantity)
    FOR color IN ('dark', 'pastel', 'white')
);
```

**Resultado:**

| item_name | clothes_size | dark | pastel | white |
|---|---|---|---|---|
| dress | small | 2 | 4 | 2 |
| dress | medium | 6 | 3 | 3 |
| pants | small | 14 | 1 | 3 |
| ... | ... | ... | ... | ... |

*El atributo `color` desaparece; sus valores se convierten en columnas con `SUM(quantity)` como valor.*

---

#### 5.5.4 Rollup y Cube

**ROLLUP** genera subtotales jerárquicos:

```sql
SELECT item_name, color, SUM(quantity)
FROM sales
GROUP BY ROLLUP(item_name, color);
```

Genera los agrupamientos: `(item_name, color)`, `(item_name)`, `()`.
Los atributos no usados en un agrupamiento aparecen como `NULL`.

Equivalente con UNION:

```sql
(SELECT item_name, color,       SUM(quantity) FROM sales GROUP BY item_name, color)
UNION
(SELECT item_name, NULL AS color, SUM(quantity) FROM sales GROUP BY item_name)
UNION
(SELECT NULL, NULL, SUM(quantity) FROM sales);
```

**CUBE** genera todos los subconjuntos posibles de agrupamiento:

```sql
SELECT item_name, color, clothes_size, SUM(quantity)
FROM sales
GROUP BY CUBE(item_name, color, clothes_size);
```

Genera: `(item_name, color, clothes_size)`, `(item_name, color)`, `(item_name, clothes_size)`, `(color, clothes_size)`, `(item_name)`, `(color)`, `(clothes_size)`, `()`.

**GROUPING SETS** — control preciso:

```sql
SELECT item_name, color, clothes_size, SUM(quantity)
FROM sales
GROUP BY GROUPING SETS ((color, clothes_size), (clothes_size, item_name));
```

**Función GROUPING()** — distingue NULLs de rollup vs. NULLs reales:

```sql
SELECT
    CASE WHEN GROUPING(item_name) = 1 THEN 'all' ELSE item_name END AS item_name,
    CASE WHEN GROUPING(color)     = 1 THEN 'all' ELSE color     END AS color,
    SUM(quantity) AS quantity
FROM sales
GROUP BY ROLLUP(item_name, color);
```

---

## Visualización Conceptual

### Jerarquía de Prerrequisitos (CS-347)

```
CS-347
  └── CS-319
        ├── CS-315
        │     └── CS-190
        │           └── CS-101
        └── CS-101 (ya incluido)
```

### Estructura de un Trigger

```
[Evento: INSERT/UPDATE/DELETE]
          ↓
   [Condición: WHEN ...]
          ↓
   [Acción: BEGIN...END]
```

### Diferencia ROLLUP vs CUBE

```
ROLLUP(A, B, C) → {(A,B,C), (A,B), (A), ()}
CUBE(A, B, C)   → {(A,B,C), (A,B), (A,C), (B,C), (A), (B), (C), ()}
```

### Comparación de APIs de Acceso a BD

```
Java     → JDBC  → Driver específico → Base de datos
C/C++    → ODBC  → Driver específico → Base de datos
Python   → DB API (psycopg2, cx_Oracle, pyodbc) → Base de datos
Código   → SQL Embebido (preprocesador) → Host Language → Base de datos
```

---

## Resumen del Tema

- **JDBC** permite a Java comunicarse con cualquier BD SQL usando `Connection`, `Statement`/`PreparedStatement` y `ResultSet`.
- **PreparedStatement** previene SQL Injection y mejora el rendimiento al reutilizar consultas compiladas.
- **ODBC** cumple el mismo rol que JDBC para lenguajes como C/C++.
- **SQL Embebido** inserta SQL en el código fuente, pero hoy en día se prefiere SQL dinámico.
- **Funciones y procedimientos almacenados** centralizan la lógica de negocio en la BD; Oracle usa PL/SQL con sintaxis diferente al estándar.
- **Triggers** ejecutan código automáticamente ante INSERT/UPDATE/DELETE; tienen sintaxis no estándar en cada sistema.
- **Consultas recursivas** con `WITH RECURSIVE` (o `CONNECT BY` en Oracle) resuelven jerarquías y clausuras transitivas.
- **RANK()**, **DENSE_RANK()**, **NTILE()** permiten ranking eficiente sin subconsultas costosas.
- Las **funciones de ventana** (`OVER`) calculan promedios móviles y tendencias sin agrupar los datos.
- **PIVOT** convierte valores de filas en columnas. **ROLLUP** y **CUBE** generan múltiples niveles de subtotales.

---

## Preguntas de Comprensión

1. ¿Cuál es la diferencia entre `executeQuery()` y `executeUpdate()` en JDBC? ¿Cuándo usarías cada uno?

2. Explica con un ejemplo concreto cómo un atacante podría usar SQL Injection si no se usa `PreparedStatement`. ¿Por qué `PreparedStatement` previene este ataque?

3. ¿En qué se diferencia una función SQL de un procedimiento SQL? ¿Cuándo conviene usar uno u otro?

4. Un trigger `BEFORE UPDATE` en Oracle no puede ejecutar `ROLLBACK` directamente. ¿Qué alternativa provee Oracle para rechazar una operación inválida desde un trigger?

5. Explica el concepto de **punto fijo** (`fixed point`) en el contexto de las consultas recursivas. ¿Cuándo termina la recursión?

6. ¿Cuál es la diferencia entre `RANK()` y `DENSE_RANK()`? Da un ejemplo con datos concretos donde el resultado sea diferente.

7. ¿Qué problema tienen los triggers cuando se ejecutan al restaurar una copia de seguridad o al replicar una base de datos? ¿Cómo se puede resolver?

8. ¿Qué restricción de **monotonía** deben cumplir las consultas recursivas en SQL? ¿Por qué no se puede usar `NOT EXISTS` sobre la vista recursiva?

9. ¿En qué se diferencia `ROLLUP(A, B)` de `CUBE(A, B)`? ¿Cuántos agrupamientos genera cada uno?

10. ¿Cuándo conviene usar `GROUPING SETS` en lugar de `ROLLUP` o `CUBE`?

---

## Ejercicios Prácticos

Estos ejercicios pueden realizarse directamente en **Oracle SQL Developer**.

### Ejercicio 1 — Función de Promedio de Salario
Crea una función `avg_salary(company_name VARCHAR)` que retorne el salario promedio de una empresa. Luego úsala para encontrar empresas con salario promedio mayor al de 'First Bank'.

```sql
-- Esquema:
-- employee(employee_name, street, city)
-- works(employee_name, company_name, salary)

CREATE OR REPLACE FUNCTION avg_salary(cname IN VARCHAR)
RETURN NUMBER AS
  avg_sal NUMBER;
BEGIN
  SELECT AVG(salary) INTO avg_sal
  FROM works WHERE company_name = cname;
  RETURN avg_sal;
END;
/

SELECT DISTINCT company_name
FROM works
WHERE avg_salary(company_name) > avg_salary('First Bank');
```

---

### Ejercicio 2 — Trigger de Integridad
Escribe un trigger que, al eliminar una cuenta bancaria, borre al cliente de la relación `depositor` si ya no tiene más cuentas.

```sql
-- Esquema:
-- account(account_number, branch_name, balance)
-- depositor(customer_name, account_number)

CREATE OR REPLACE TRIGGER cleanup_depositor
AFTER DELETE ON account
REFERENCING OLD ROW AS orow
FOR EACH ROW
BEGIN
  DELETE FROM depositor d
  WHERE d.customer_name IN (
      SELECT customer_name FROM depositor WHERE account_number = :orow.account_number)
  AND NOT EXISTS (
      SELECT 1 FROM depositor d2
      JOIN account a ON d2.account_number = a.account_number
      WHERE d2.customer_name = d.customer_name
        AND d2.account_number <> :orow.account_number);
END;
/
```

---

### Ejercicio 3 — Consulta Recursiva
Dado el esquema `prereq(course_id, prereq_id)`, escribe una consulta recursiva que liste todos los prerrequisitos directos e indirectos del curso 'CS-347'.

```sql
-- En Oracle 12c+
WITH rec_prereq(course_id, prereq_id) AS (
    SELECT course_id, prereq_id FROM prereq
    UNION ALL
    SELECT rp.course_id, p.prereq_id
    FROM rec_prereq rp
    JOIN prereq p ON rp.prereq_id = p.course_id
)
SELECT DISTINCT prereq_id
FROM rec_prereq
WHERE course_id = 'CS-347';
```

---

### Ejercicio 4 — Ranking por Departamento
Usando la vista `dept_grades(ID, dept_name, GPA)`, encuentra el top 3 de estudiantes por departamento.

```sql
SELECT *
FROM (
    SELECT ID, dept_name, GPA,
           RANK() OVER (PARTITION BY dept_name ORDER BY GPA DESC) AS dept_rank
    FROM dept_grades
)
WHERE dept_rank <= 3
ORDER BY dept_name, dept_rank;
```

---

### Ejercicio 5 — Promedio Móvil
Dada la vista `tot_credits(year, num_credits)`, calcula para cada año el promedio acumulado de créditos desde el primer año hasta el año actual.

```sql
SELECT year, num_credits,
       AVG(num_credits) OVER (ORDER BY year ROWS UNBOUNDED PRECEDING) AS avg_acumulado
FROM tot_credits
ORDER BY year;
```

---

### Ejercicio 6 — ROLLUP de Ventas
Usa la relación `sales(item_name, color, clothes_size, quantity)` para generar un reporte de ventas totales por item_name, por combinación (item_name, color), y el gran total.

```sql
SELECT
    CASE WHEN GROUPING(item_name) = 1 THEN 'TOTAL' ELSE item_name END AS item_name,
    CASE WHEN GROUPING(color) = 1     THEN 'TOTAL' ELSE color     END AS color,
    SUM(quantity) AS total_quantity
FROM sales
GROUP BY ROLLUP(item_name, color)
ORDER BY item_name, color;
```

---

## Notas Importantes

> ⚠️ **SQL Injection es una vulnerabilidad crítica.** Nunca concatenes strings del usuario en consultas SQL. Usa siempre `PreparedStatement` (JDBC) o equivalente en tu lenguaje.

> ⚠️ **Los triggers pueden causar recursión infinita.** Un trigger que inserta en la misma tabla puede dispararse a sí mismo. Los sistemas limitan la profundidad de anidamiento. Diseña triggers con cuidado.

> ⚠️ **Sintaxis no estándar.** Las funciones, procedimientos y triggers tienen sintaxis diferente en Oracle (PL/SQL), SQL Server (T-SQL) y PostgreSQL (PL/pgSQL). El código de este documento sigue el estándar SQL con adaptaciones para Oracle donde se indica.

> ⚠️ **Rendimiento de funciones UDF en consultas.** Invocar funciones definidas por el usuario dentro de consultas sobre grandes tablas puede ser muy lento. Considera el impacto de rendimiento antes de usarlas.

> ⚠️ **Triggers y replicación/backups.** Al restaurar backups o replicar bases de datos, los triggers pueden ejecutarse de nuevo innecesariamente. Desactívalos con `ALTER TRIGGER nombre DISABLE` antes de operaciones de restauración.

> ✅ **`CREATE OR REPLACE` en Oracle.** Al crear funciones o procedimientos durante el desarrollo, usa `CREATE OR REPLACE` para poder modificarlos fácilmente sin borrarlos primero.

> ✅ **`UNION ALL` vs `UNION` en recursión Oracle.** Oracle 12c+ requiere `UNION ALL` (no `UNION`) en las consultas `WITH RECURSIVE`.
