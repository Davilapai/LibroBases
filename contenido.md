# BASES DE DATOS
## Resumen Exhaustivo — Capítulos 1 al 4

*Database System Concepts — Silberschatz, Korth & Sudarshan*

Guía completa de estudio con ejercicios resueltos para examen parcial.

---

## Contenido del Resumen

Este documento cubre en profundidad los primeros 4 capítulos del libro:

- Capítulo 1 — Introducción a los Sistemas de Bases de Datos
- Capítulo 2 — Introducción al Modelo Relacional
- Capítulo 3 — Introducción a SQL
- Capítulo 4 — SQL Intermedio

Cada capítulo incluye: explicación completa de todos los conceptos, ejemplos ilustrativos y ejercicios variados con soluciones. Al final encontrarás ejercicios integrados que combinan todos los capítulos.

---

# CAPÍTULO 1 — Introducción a los Sistemas de Bases de Datos

## 1.1 Conceptos Fundamentales

### ¿Qué es un DBMS?

Un Sistema Gestor de Bases de Datos (DBMS — Database Management System) es una colección de datos interrelacionados junto con un conjunto de programas que permiten acceder a esos datos. El objetivo primario de un DBMS es proporcionar una forma conveniente y eficiente de almacenar y recuperar información.

La colección de datos se denomina base de datos (database), y contiene información relevante para una empresa u organización.

### Aplicaciones de los Sistemas de Bases de Datos

Los sistemas de bases de datos son omnipresentes en el mundo moderno. Algunos ejemplos representativos:

- **Información empresarial:** Ventas (clientes, productos, compras), contabilidad, recursos humanos.
- **Manufactura:** Cadena de suministro, producción en fábricas, inventarios.
- **Banca y finanzas:** Información de clientes, cuentas, préstamos, transacciones.
- **Universidades:** Información de estudiantes, inscripciones en cursos, calificaciones.
- **Aerolíneas:** Reservaciones e información de vuelos.
- **Servicios web:** Redes sociales, comercio en línea, publicidad dirigida.
- **Sistemas de navegación:** Ubicación de lugares, rutas.

### Dos Modos de Uso de las Bases de Datos

- **Procesamiento de transacciones en línea (OLTP):** Muchos usuarios acceden y actualizan pequeñas cantidades de datos al mismo tiempo. Es el modo predominante para la mayoría de aplicaciones empresariales.
- **Análisis de datos (Analytics / Data Mining):** Procesamiento de datos para descubrir reglas y patrones, construir modelos predictivos y tomar decisiones de negocio.

---

## 1.2 Propósito de los Sistemas de Bases de Datos

Para entender por qué existen los DBMS, pensemos en el sistema de procesamiento de archivos tradicional del sistema operativo. Ese enfoque tiene graves desventajas:

### Problemas de los Sistemas de Archivos Tradicionales

- **1. Redundancia e inconsistencia de datos:** La misma información puede estar duplicada en varios archivos. Si se actualiza en un lugar pero no en otro, los datos se vuelven inconsistentes. Por ejemplo, la dirección de un estudiante guardada en dos departamentos distintos.
- **2. Dificultad de acceso a los datos:** Para cada consulta nueva se necesita un programa nuevo. No existe una forma genérica de recuperar datos bajo criterios arbitrarios.
- **3. Aislamiento de datos (data isolation):** Datos dispersos en múltiples archivos con distintos formatos dificultan escribir nuevas aplicaciones.
- **4. Problemas de integridad:** Las restricciones de consistencia (por ejemplo: el saldo de una cuenta no puede ser negativo) son difíciles de imponer cuando están codificadas en múltiples programas dispersos.
- **5. Problemas de atomicidad:** Ejemplo clásico: transferencia bancaria de $500 de cuenta A a cuenta B. Si el sistema falla después de debitar A pero antes de acreditar B, la base de datos queda en estado inconsistente. En un sistema de archivos es muy difícil garantizar que la operación sea atómica (todo-o-nada).
- **6. Anomalías de acceso concurrente:** Si dos procesos modifican el mismo dato al mismo tiempo, pueden producirse resultados incorrectos. Ejemplo: dos cajeros leen saldo $10,000 simultáneamente, cada uno resta $500, y el saldo final queda en $9,500 en vez de $9,000.
- **7. Problemas de seguridad:** En un sistema de archivos es difícil restringir el acceso a partes específicas de los datos según el rol del usuario.

> 💡 **Conclusión clave:** Todos estos problemas motivaron el desarrollo de los DBMS en la década de 1960-1970. Los DBMS resuelven cada uno de estos problemas mediante sus mecanismos integrados.

---

## 1.3 Vista de los Datos

### Modelos de Datos

Un modelo de datos es una colección de herramientas conceptuales para describir datos, sus relaciones, semántica y restricciones de consistencia. Existen cuatro categorías principales:

- **Modelo Relacional:** Usa tablas (relaciones) para representar datos y relaciones entre ellos. Es el modelo más ampliamente usado. Cada tabla tiene múltiples columnas con nombres únicos.
- **Modelo Entidad-Relación (E-R):** Usa entidades (objetos) y relaciones entre ellos. Muy usado para diseño de bases de datos. Se estudia en detalle en el capítulo 6.
- **Modelo Semi-estructurado:** Permite datos donde ítems del mismo tipo pueden tener diferentes conjuntos de atributos. JSON y XML son representaciones semi-estructuradas comunes.
- **Modelo Orientado a Objetos:** Integra conceptos de la programación orientada a objetos (encapsulamiento, métodos, identidad de objeto) con el modelo relacional.

### Abstracción de Datos — Los Tres Niveles

Para ocultar la complejidad a los usuarios, un DBMS provee tres niveles de abstracción:

- **Nivel físico (Physical level):** El nivel más bajo. Describe cómo se almacenan físicamente los datos en disco. Involucra estructuras de datos complejas (índices, bloques, páginas). El usuario normalmente no ve este nivel.
- **Nivel lógico (Logical level):** Describe QUÉ datos están en la base de datos y cuáles son sus relaciones. Los programadores y administradores trabajan en este nivel. Es independiente del físico (independencia física de datos).
- **Nivel de vista (View level):** El nivel más alto. Describe solo una parte de la base de datos relevante para un usuario particular. Simplifica la interacción del usuario y provee seguridad ocultando datos sensibles.

> 📌 **Ejemplo concreto:** Un empleado de nómina ve solo los salarios. El registrador de la universidad ve solo datos académicos. Ambos trabajan sobre la misma base de datos física, pero ven vistas (views) distintas.

### Instancias y Esquemas

- **Esquema (Schema):** El diseño lógico general de la base de datos (análogo a la definición de tipos en programación). El esquema raramente cambia.
- **Instancia (Instance):** Los datos reales almacenados en un momento dado (análogo al valor de una variable). Cambia constantemente con inserciones, eliminaciones y actualizaciones.
- **Independencia física de datos:** Las aplicaciones no deben depender del esquema físico. Si cambia cómo se almacenan los datos en disco, las aplicaciones no deben necesitar reescribirse.

---

## 1.4 Lenguajes de Base de Datos

### DDL — Lenguaje de Definición de Datos

El DDL (Data Definition Language) permite especificar el esquema de la base de datos. Genera salida en el diccionario de datos (data dictionary), que contiene metadatos (datos sobre datos).

Las restricciones de integridad que se pueden definir con DDL incluyen:

- **Restricciones de dominio:** Cada atributo debe tener un dominio (tipo) de posibles valores asociado (ej: entero, cadena, fecha). Se verifica en cada inserción.
- **Integridad referencial:** Un valor en un atributo de una relación debe aparecer en el atributo correspondiente de otra relación. Ejemplo: dept_name en instructor debe existir en department.
- **Autorización:** Diferentes usuarios tienen diferentes tipos de acceso: lectura (read), inserción (insert), actualización (update), eliminación (delete).

### DML — Lenguaje de Manipulación de Datos

El DML (Data Manipulation Language) permite acceder y manipular datos. Tipos de acceso:

- Recuperación de información almacenada
- Inserción de nueva información
- Eliminación de información
- Modificación de información almacenada

Tipos de DML:

- **DML procedimental:** El usuario especifica QUÉ datos se necesitan Y CÓMO obtenerlos.
- **DML declarativo (no procedimental):** El usuario especifica solo QUÉ datos se necesitan, sin especificar cómo obtenerlos. Es más fácil de aprender. SQL es un ejemplo.

Una **query** (consulta) es una instrucción para recuperar información. La porción del DML que se encarga de recuperación se llama query language (lenguaje de consulta). SQL es el lenguaje de consulta más ampliamente usado.

---

## 1.5 Diseño de Bases de Datos

El diseño de una base de datos involucra principalmente el diseño del esquema. Las fases del proceso son:

- **Fase conceptual:** Caracterizar completamente las necesidades de datos de los usuarios. Producir un esquema conceptual usando el modelo E-R o técnicas de normalización.
- **Fase lógica:** Mapear el esquema conceptual al modelo de datos del DBMS elegido (ej: relacional).
- **Fase física:** Especificar las características físicas: organización de archivos, estructuras de almacenamiento interno.

---

## 1.6 El Motor de Base de Datos (Database Engine)

Los componentes funcionales de un DBMS se dividen en tres grandes grupos:

### Gestor de Almacenamiento (Storage Manager)

Proporciona la interfaz entre los datos de bajo nivel y las aplicaciones. Subcomponentes:

- **Gestor de autorización e integridad:** Verifica restricciones de integridad y permisos de usuarios.
- **Gestor de transacciones:** Asegura consistencia ante fallos y coordina transacciones concurrentes.
- **Gestor de archivos:** Administra el espacio en disco y las estructuras de datos.
- **Gestor de buffer:** Transfiere datos entre disco y memoria principal. Crítico para el rendimiento.

Estructuras de datos del storage manager:

- Archivos de datos (data files): almacenan la base de datos.
- Diccionario de datos (data dictionary): almacena metadatos y el esquema.
- Índices (indices): permiten acceso rápido a datos.

### Procesador de Consultas (Query Processor)

- **Intérprete DDL:** Interpreta instrucciones DDL y registra las definiciones en el diccionario de datos.
- **Compilador DML:** Traduce instrucciones DML a un plan de evaluación de bajo nivel. Realiza optimización de consultas.
- **Motor de evaluación de consultas:** Ejecuta las instrucciones de bajo nivel generadas por el compilador.

### Gestor de Transacciones (Transaction Manager)

Una transacción es una colección de operaciones que realiza una sola función lógica. El gestor de transacciones garantiza las propiedades ACID:

- **Atomicidad (Atomicity):** La transacción ocurre en su totalidad o no ocurre en absoluto (todo-o-nada).
- **Consistencia (Consistency):** La base de datos permanece en estado consistente después de la transacción.
- **Durabilidad (Durability):** Los cambios de una transacción confirmada (committed) persisten aunque ocurra un fallo.

---

## 1.7 Arquitectura de Aplicaciones

Las aplicaciones que usan bases de datos pueden organizarse en dos o tres capas:

- **Arquitectura de dos capas (Two-tier):** La aplicación reside en el cliente y llama a la base de datos directamente. Era el estilo dominante en los años 80-90.
- **Arquitectura de tres capas (Three-tier):** El cliente (navegador web, app móvil) se comunica con un servidor de aplicación. El servidor de aplicación a su vez se comunica con la base de datos. La lógica de negocio está en el servidor de aplicación. Ofrece mejor seguridad y rendimiento que el modelo de dos capas.

---

## 1.8 Usuarios y Administradores

### Tipos de Usuarios

- **Usuarios ingenuos (Naïve users):** Usuarios no especializados que interactúan mediante interfaces predefinidas (formularios web, apps). No conocen SQL.
- **Programadores de aplicación:** Profesionales que escriben programas que interactúan con la BD a través de APIs.
- **Usuarios sofisticados:** Interactúan directamente sin escribir programas, usando lenguajes de consulta o herramientas de análisis.

### Administrador de Base de Datos (DBA)

El DBA (Database Administrator) tiene control central sobre el sistema. Sus funciones incluyen:

- Definición del esquema.
- Definición de estructura de almacenamiento y métodos de acceso.
- Modificación del esquema y organización física.
- Otorgamiento de autorización para acceso a datos.
- Mantenimiento rutinario: backups, monitoreo, gestión de espacio en disco.

---

## 1.9 Historia de los Sistemas de Bases de Datos

Evolución cronológica:

- **1950s-60s:** Cintas magnéticas para almacenamiento. Procesamiento secuencial de datos. Aplicaciones de nómina y contabilidad.
- **Finales 60s-70s:** Discos duros permiten acceso directo. Modelos de red y jerárquicos. Edgar Codd propone el modelo relacional en 1970 (ganó el Turing Award en 1981).
- **Finales 70s-80s:** Proyecto System R de IBM construye el primer DBMS relacional eficiente. Oracle 1ª versión. SQL se convierte en estándar ANSI/ISO en 1986.
- **1990s:** Explosión de la World Wide Web. Bases de datos deben soportar millones de usuarios simultáneos. Bases de datos paralelas y distribuidas.
- **2000s:** Datos semi-estructurados (XML, JSON). Sistemas de código abierto (PostgreSQL, MySQL). Bases de datos de grafos. Column-stores para analítica. NoSQL.
- **2010s:** NoSQL evoluciona hacia consistencia eventual. Cloud computing. Privacidad y ciberseguridad.

---

## 🎓 EJERCICIOS — CAPÍTULO 1

### Preguntas de Comprensión

**Ejercicio 1.1:** ¿Cuáles son los dos modos principales de uso de las bases de datos? Descríbelos brevemente.

> ✓ **Respuesta:** (1) Procesamiento de transacciones en línea (OLTP): muchos usuarios leen y modifican pequeñas cantidades de datos simultáneamente. (2) Análisis de datos (Analytics): procesamiento de grandes volúmenes para descubrir patrones, construir modelos predictivos y apoyar decisiones de negocio.

**Ejercicio 1.2:** Explica el problema de atomicidad con el ejemplo de la transferencia bancaria. ¿Por qué es difícil en un sistema de archivos?

> ✓ **Respuesta:** Si se transfieren $500 de A a B, deben ocurrir dos operaciones: debitar A y acreditar B. Si el sistema falla entre ambas, A queda sin $500 pero B no los recibe. En un sistema de archivos tradicional no existe mecanismo automático para revertir la primera operación si la segunda falla. Un DBMS garantiza atomicidad: ambas operaciones ocurren o ninguna.

**Ejercicio 1.3:** Describe los tres niveles de abstracción de datos y para quién está destinado cada uno.

> ✓ **Respuesta:** (1) Nivel físico: describe cómo se almacenan los datos en disco. Destinado a administradores de sistemas. (2) Nivel lógico: describe qué datos hay y sus relaciones. Destinado a DBAs y programadores. (3) Nivel de vista: muestra solo parte de la BD. Destinado a usuarios finales para simplificar su interacción y proteger datos sensibles.

**Ejercicio 1.4:** ¿Cuál es la diferencia entre esquema e instancia? Da un ejemplo concreto.

> ✓ **Respuesta:** El esquema es el diseño de la BD (análogo a la definición de tipos). La instancia son los datos reales en un momento dado (análogo al valor de una variable). Ejemplo: el esquema de la tabla instructor define los atributos ID, name, dept_name, salary. Una instancia concreta sería los datos reales de los 12 instructores que hay en la universidad en este momento. El esquema cambia poco; la instancia cambia constantemente.

### Verdadero o Falso

**V/F 1.1:** Un DML procedimental requiere que el usuario especifique tanto qué datos necesita como cómo obtenerlos.

> ✓ **VERDADERO.** Los DML procedimentales requieren tanto el QUÉ como el CÓMO. Los DML declarativos (como SQL) solo requieren el QUÉ.

**V/F 1.2:** El diccionario de datos es una tabla especial que puede ser modificada directamente por cualquier usuario.

> ✗ **FALSO.** El diccionario de datos (data dictionary) contiene metadatos y solo puede ser accedido y actualizado por el sistema de BD, no por usuarios regulares.

**V/F 1.3:** La arquitectura de tres capas ofrece mejor seguridad que la de dos capas.

> ✓ **VERDADERO.** En tres capas, la lógica de negocio y el acceso directo a BD están en el servidor de aplicación, no en el cliente. Esto protege mejor la BD de accesos no autorizados.

### Casos Prácticos

**Ejercicio 1.5:** Analiza la anomalía de acceso concurrente: Una cuenta tiene $10,000. Dos retiros simultáneos de $500 y $100 se procesan en paralelo. Si ambos leen el saldo original antes de que el otro haya actualizado, ¿cuál podría ser el saldo final incorrecto? ¿Cuál debería ser el correcto?

> ✓ **Respuesta:** Ambos procesos leen $10,000. El primero escribe $9,500 (10,000 - 500). El segundo escribe $9,900 (10,000 - 100). El resultado final depende de cuál escribe último: $9,500 o $9,900. El valor correcto debería ser $9,400 (10,000 - 500 - 100). El DBMS evita esto con control de concurrencia (locks o control de versiones).

---

# CAPÍTULO 2 — Introducción al Modelo Relacional

## 2.1 Estructura de las Bases de Datos Relacionales

### Conceptos Básicos: Relación, Tupla, Atributo

El modelo relacional organiza los datos en forma de tablas. Terminología fundamental:

- **Relación (Relation):** Una tabla con filas y columnas. Matemáticamente es un conjunto de tuplas.
- **Tupla (Tuple):** Una fila de la tabla. Representa un hecho individual.
- **Atributo (Attribute):** Una columna de la tabla. Cada atributo tiene un nombre único dentro de la relación.
- **Dominio:** El conjunto de valores permitidos para un atributo (ej: enteros, cadenas de 20 chars, etc.).
- **Dominio atómico:** Los elementos del dominio son indivisibles. Por ejemplo, si un número de teléfono se trata como una unidad indivisible, su dominio es atómico. Si se divide en código de país + área + número local, no es atómico.
- **Valor nulo (Null):** Valor especial que indica que el valor es desconocido o no existe. Los null values complican operaciones y deben evitarse cuando sea posible.

Ejemplo de la base de datos universitaria:

```
Relación instructor: (ID, name, dept_name, salary)
Ejemplo de tupla: (22222, Einstein, Physics, 95000)

Relación department: (dept_name, building, budget)
Ejemplo de tupla: (Biology, Watson, 90000)
```

---

## 2.2 Esquema de Base de Datos

El esquema de una relación (relation schema) define la estructura lógica: lista de atributos y sus dominios. Se escribe como: `nombre_relación(atributo1, atributo2, …)`.

Esquema completo de la universidad:

```sql
classroom(building, room_number, capacity)
department(dept_name, building, budget)
course(course_id, title, dept_name, credits)
instructor(ID, name, dept_name, salary)
section(course_id, sec_id, semester, year, building, room_number, time_slot_id)
teaches(ID, course_id, sec_id, semester, year)
student(ID, name, dept_name, tot_cred)
takes(ID, course_id, sec_id, semester, year, grade)
advisor(s_ID, i_ID)
time_slot(time_slot_id, day, start_time, end_time)
prereq(course_id, prereq_id)
```

---

## 2.3 Claves (Keys)

### Tipos de Claves

Las claves permiten identificar de forma única las tuplas en una relación.

- **Superclave (Superkey):** Cualquier conjunto de uno o más atributos que identifica de forma única a cada tupla. Ejemplo en instructor: `{ID}`, `{ID, name}`, `{ID, name, dept_name}` son todas superclaves.
- **Clave candidata (Candidate key):** Una superclave minimal — ningún subconjunto propio es también superclave. Ejemplo: `{ID}` es clave candidata en instructor. Si `{name, dept_name}` también identifica unívocamente, también sería clave candidata.
- **Clave primaria (Primary key):** La clave candidata elegida por el diseñador como medio principal de identificación. Se subraya en el esquema. No puede ser null. Dos tuplas no pueden tener el mismo valor en los atributos de la clave primaria.

> ⚠️ **Regla de elección de clave primaria:** La clave primaria debe ser un atributo que raramente o nunca cambie su valor. Por ejemplo, la dirección de una persona no es buena clave primaria (puede cambiar). El número de seguro social tampoco es ideal en sistemas internacionales (no todos lo tienen).

### Clave Foránea (Foreign Key)

Una restricción de clave foránea (foreign key constraint) de atributo(s) A en relación r1 hacia la clave primaria B de relación r2 establece que: el valor de A en cada tupla de r1 debe también ser el valor de B en alguna tupla de r2.

- r1 se llama relación referenciante (referencing relation).
- r2 se llama relación referenciada (referenced relation).

Ejemplo: `dept_name` en instructor es clave foránea que referencia a department. Esto garantiza que cada instructor pertenezca a un departamento que realmente existe.

### Restricción de Integridad Referencial

Una restricción de integridad referencial es más general que una clave foránea: exige que los valores en atributos especificados de cualquier tupla en la relación referenciante también aparezcan en la relación referenciada, aunque el atributo referenciado no sea necesariamente la clave primaria.

---

## 2.4 Diagramas de Esquema

Un diagrama de esquema representa visualmente el esquema de la base de datos. Convenciones:

- Cada relación aparece como un recuadro con el nombre de la relación arriba.
- Los atributos de clave primaria están subrayados.
- Las claves foráneas se muestran como flechas desde el atributo de la relación referenciante hacia la clave primaria de la relación referenciada.
- Las restricciones de integridad referencial que no son claves foráneas se muestran con una flecha de doble cabeza.

---

## 2.5 Lenguajes de Consulta

Los lenguajes de consulta sobre bases de datos relacionales pueden ser:

- **Imperativos:** El usuario instruye al sistema paso a paso sobre cómo calcular el resultado.
- **Funcionales:** El usuario aplica funciones a los datos y las compone. El álgebra relacional es funcional.
- **Declarativos:** El usuario especifica qué propiedades debe tener el resultado. El cálculo relacional es declarativo.

---

## 2.6 El Álgebra Relacional

El álgebra relacional es la base teórica de SQL. Define un conjunto de operaciones que toman una o dos relaciones como entrada y producen una nueva relación como resultado. Permite componer operaciones para expresar consultas complejas.

### Operaciones Unarias

- **Selección σ (Select):** Selecciona tuplas que satisfacen un predicado. Notación: `σpredicate(relación)`. Ejemplo: `σdept_name='Physics'(instructor)` — devuelve todos los instructores del departamento de Física. Los predicados pueden usar: `=`, `≠`, `<`, `≤`, `>`, `≥`, combinados con `∧` (and), `∨` (or), `¬` (not).
- **Proyección Π (Project):** Devuelve la relación original con solo algunos atributos (columnas). Elimina duplicados. Notación: `ΠA1,A2,…(relación)`. Ejemplo: `ΠID,name,salary(instructor)` — devuelve solo ID, nombre y salario.
- **Renombramiento ρ (Rename):** Renombra la relación resultante o sus atributos. Notación: `ρx(E)` o `ρx(A1,A2,...)(E)`. Útil cuando se necesita referenciar la misma relación más de una vez.

### Composición de Operaciones Relacionales

Como el resultado de cada operación es también una relación, se pueden componer operaciones. Ejemplo: encontrar los nombres de todos los instructores del departamento de Física:

```
Πname(σdept_name='Physics'(instructor))
```

Primero se aplica la selección para filtrar instructores de Física, luego la proyección para obtener solo los nombres.

### Operaciones Binarias — Producto Cartesiano y Join

- **Producto Cartesiano ×:** Combina cada tupla de r1 con cada tupla de r2. Si r1 tiene n1 tuplas y r2 tiene n2 tuplas, el resultado tiene n1×n2 tuplas. El esquema del resultado es la concatenación de los esquemas.
- **Join ⋈ (Theta Join):** Equivale a `σθ(r1 × r2)`. Combina tuplas que satisfacen la condición θ. Mucho más útil que el producto cartesiano sin filtrar. Ejemplo: `instructor ⋈instructor.ID=teaches.ID teaches` combina instructores con sus cursos correspondientes.

### Operaciones de Conjuntos

Requieren que las relaciones sean compatibles (mismo número de atributos y tipos correspondientes compatibles):

- **Unión ∪:** Produce tuplas que están en r1 O en r2 (o en ambas). Elimina duplicados.
- **Intersección ∩:** Produce tuplas que están tanto en r1 COMO en r2.
- **Diferencia de conjuntos −:** Produce tuplas que están en r1 pero NO en r2.

### Operación de Asignación ←

Permite asignar partes de una expresión a variables temporales, haciendo las consultas más legibles. No agrega poder expresivo al álgebra. Ejemplo:

```
courses_fall_2017 ← Πcourse_id(σsemester='Fall' ∧ year=2017(section))
courses_spring_2018 ← Πcourse_id(σsemester='Spring' ∧ year=2018(section))
courses_fall_2017 ∩ courses_spring_2018
```

### Equivalencia de Consultas

Muchas consultas pueden expresarse de múltiples formas equivalentes en álgebra relacional. Estas dos expresiones producen el mismo resultado:

```
σdept_name='Physics'(instructor ⋈ teaches)
(σdept_name='Physics'(instructor)) ⋈ teaches
```

Los optimizadores de consultas eligen la forma más eficiente para ejecutar la consulta.

---

## 🎓 EJERCICIOS — CAPÍTULO 2

### Claves y Esquema

**Ejercicio 2.1:** Para la relación `time_slot(time_slot_id, day, start_time, end_time)`, identifica la clave primaria y justifica por qué `end_time` NO forma parte de ella.

> ✓ **Respuesta:** La clave primaria es `(time_slot_id, day, start_time)`. Un slot particular puede tener múltiples sesiones en el mismo día a distintas horas, por eso tanto `day` como `start_time` son necesarios. El `end_time` NO es parte de la clave porque dado un `(time_slot_id, day, start_time)` específico, el `end_time` queda determinado — no necesitamos `end_time` para identificar de forma única la tupla.

**Ejercicio 2.2:** ¿Podemos usar el atributo `name` como clave primaria de la relación instructor en la instancia que se muestra en el libro? ¿Y en general?

> ✓ **Respuesta:** En la instancia mostrada, no hay dos instructores con el mismo nombre, por lo que PODRÍA funcionar como superclave en esa instancia. Pero NO podemos concluir que sea clave primaria en general, porque es perfectamente posible que en otra instancia haya dos instructores con el mismo nombre. La clave primaria debe garantizar unicidad en TODAS las posibles instancias, no solo en la actual.

### Álgebra Relacional

**Ejercicio 2.3:** Escribe una expresión de álgebra relacional para encontrar el nombre de cada instructor del departamento de Física.

> ✓ **Respuesta:** `Πname(σdept_name='Physics'(instructor))`

**Ejercicio 2.4:** Usando las relaciones instructor y teaches, escribe la expresión algebraica para encontrar el nombre de cada instructor y el ID del curso que enseña.

> ✓ **Respuesta:** `Πinstructor.name, teaches.course_id (instructor ⋈instructor.ID=teaches.ID teaches)`

**Ejercicio 2.5:** Escribe la expresión para encontrar todos los cursos enseñados en otoño 2017 pero NO en primavera 2018.

> ✓ **Respuesta:** `Πcourse_id(σsemester='Fall' ∧ year=2017(section)) − Πcourse_id(σsemester='Spring' ∧ year=2018(section))`

**Ejercicio 2.6:** ¿Por qué el producto cartesiano sin condición de selección es inútil en la práctica?

> ✓ **Respuesta:** Porque combina TODAS las tuplas de ambas relaciones sin ningún criterio de relación entre ellas. Con 200 instructores y 600 cursos enseñados, el producto cartesiano tendría 200×600 = 120,000 tuplas, la mayoría sin sentido (emparejando instructores con cursos que no enseñaron). El JOIN con condición es lo que hace útil la combinación.

### Verdadero o Falso

**V/F 2.1:** Una superclave siempre es también una clave candidata.

> ✗ **FALSO.** Una superclave puede contener atributos redundantes. Una clave candidata es la superclave MINIMAL (sin subconjunto propio que sea también superclave). Por ejemplo, `{ID, name}` es superclave pero no es clave candidata en instructor, porque `{ID}` por sí solo ya es superclave.

**V/F 2.2:** El resultado de una operación de álgebra relacional es siempre una relación.

> ✓ **VERDADERO.** Esta es una propiedad fundamental que permite componer operaciones: el resultado de cada operación es una relación, que puede usarse como entrada de otra operación.

**V/F 2.3:** Una clave foránea debe referenciar la clave primaria de la relación referenciada.

> ✓ **VERDADERO.** Por definición, una foreign key constraint referencia la clave primaria de la relación referenciada. Una restricción de integridad referencial más general puede referenciar atributos que no sean clave primaria.

---

# CAPÍTULO 3 — Introducción a SQL

## 3.1 Historia y Partes de SQL

SQL (Structured Query Language) fue desarrollado originalmente por IBM como 'Sequel' en el proyecto System R a comienzos de los años 70. Se convirtió en estándar ANSI/ISO en 1986 como SQL-86. Versiones importantes: SQL-89, SQL-92, SQL:1999, SQL:2003, SQL:2016.

Las partes del lenguaje SQL son:

- **DDL:** Definición de esquemas, eliminación de relaciones, modificación de esquemas.
- **DML:** Consultas, inserción, eliminación y modificación de tuplas.
- **Definición de vistas (View definition).**
- **Control de transacciones.**
- **SQL embebido y dinámico.**
- **Autorización.**

---

## 3.2 Definición de Datos SQL (DDL)

### Tipos de Datos Básicos en SQL

- **char(n):** Cadena de longitud fija n. Rellena con espacios si es más corta. Se recomienda usar varchar en cambio.
- **varchar(n):** Cadena de longitud variable, máximo n caracteres. Más eficiente en almacenamiento.
- **int / integer:** Entero (dependiente de la máquina).
- **smallint:** Entero pequeño.
- **numeric(p,d):** Número de punto fijo. p = total de dígitos, d = dígitos decimales. Ej: `numeric(3,1)` permite 44.5.
- **real, double precision:** Punto flotante.
- **float(n):** Punto flotante con precisión mínima de n dígitos.

### Creación de Tablas — CREATE TABLE

Sintaxis general:

```sql
CREATE TABLE nombre_relacion (
    atributo1  tipo1  [restricciones],
    atributo2  tipo2  [restricciones],
    ...,
    [restricciones_de_tabla]
);
```

Ejemplo completo:

```sql
CREATE TABLE department (
    dept_name  VARCHAR(20),
    building   VARCHAR(15),
    budget     NUMERIC(12,2),
    PRIMARY KEY (dept_name)
);
```

Restricciones de integridad en CREATE TABLE:

- **PRIMARY KEY (A1, A2, …):** Declara la clave primaria. Los atributos no pueden ser nulos y deben ser únicos.
- **FOREIGN KEY (A1, …) REFERENCES s:** Declara clave foránea que referencia la clave primaria de s.
- **NOT NULL:** El atributo no puede tener valor nulo.

### Otras Instrucciones DDL

- **DROP TABLE r:** Elimina la tabla r y todos sus datos. Más drástico que DELETE.
- **DELETE FROM r:** Elimina todos los datos de r pero conserva el esquema.
- **ALTER TABLE r ADD A D:** Agrega el atributo A de tipo D a la relación r (todas las tuplas existentes toman NULL).
- **ALTER TABLE r DROP A:** Elimina el atributo A de la relación r (muchos sistemas no lo permiten).

---

## 3.3 Estructura Básica de Consultas SQL

### La Consulta SELECT-FROM-WHERE

Forma típica:

```sql
SELECT A1, A2, ..., An
FROM   r1, r2, ..., rm
WHERE  P;
```

El CÓMO ejecutarlo (semántica operacional):

1. **FROM:** genera el producto cartesiano de todas las relaciones listadas.
2. **WHERE:** filtra las tuplas del producto cartesiano que satisfacen el predicado P.
3. **SELECT:** proyecta los atributos (o expresiones) especificados.

Ejemplo: nombres de instructores del departamento de Ciencias de la Computación con salario > $70,000:

```sql
SELECT name
FROM instructor
WHERE dept_name = 'Comp. Sci.' AND salary > 70000;
```

### Duplicados en SQL

A diferencia del álgebra relacional (que trabaja con conjuntos), SQL trabaja por defecto con multiconjuntos (permite duplicados).

- **SELECT dept_name:** Puede devolver el mismo valor múltiples veces.
- **SELECT DISTINCT dept_name:** Elimina duplicados del resultado.
- **SELECT ALL dept_name:** Retiene duplicados explícitamente (es el comportamiento por defecto).

### Expresiones en SELECT

La cláusula SELECT puede contener expresiones aritméticas:

```sql
SELECT ID, name, dept_name, salary * 1.1
FROM instructor;
```

Esto muestra el salario con 10% de aumento, sin modificar la BD.

---

## 3.4 Operaciones Básicas Adicionales

### Renombramiento — AS

La cláusula AS permite renombrar atributos o relaciones (alias). Útil para:

- Dar nombre a expresiones calculadas que no tienen nombre.
- Renombrar relaciones para evitar ambigüedad (especialmente en self-joins).

```sql
SELECT name AS instructor_name, course_id
FROM instructor AS T, teaches AS S
WHERE T.ID = S.ID;
```

El identificador T o S usado para renombrar una relación se llama **variable de correlación** (correlation variable) o **alias de tabla** (table alias).

### Operaciones con Cadenas

SQL usa comillas simples para cadenas: `'Computer'`. El operador LIKE permite coincidencia de patrones:

- **% (porcentaje):** Coincide con cualquier subcadena (incluso vacía).
- **_ (guión bajo):** Coincide con exactamente un carácter.

Ejemplos de patrones:

```sql
'Intro%'       -- cualquier cadena que empiece con 'Intro'
'%Comp%'       -- cualquier cadena que contenga 'Comp'
'___'          -- cualquier cadena de exactamente 3 caracteres
'__ %'         -- cualquier cadena de al menos 3 caracteres
```

Ejemplo de consulta: departamentos cuyo edificio contiene 'Watson':

```sql
SELECT dept_name FROM department
WHERE building LIKE '%Watson%';
```

### ORDER BY

Controla el orden de presentación del resultado. Por defecto es ASC (ascendente). Se puede especificar DESC (descendente).

```sql
SELECT * FROM instructor
ORDER BY salary DESC, name ASC;
```

### BETWEEN

```sql
SELECT name FROM instructor
WHERE salary BETWEEN 90000 AND 100000;
```

Equivalente a: `WHERE salary >= 90000 AND salary <= 100000`.

---

## 3.5 Operaciones de Conjuntos en SQL

SQL ofrece las operaciones UNION, INTERSECT y EXCEPT que corresponden a ∪, ∩ y − del álgebra relacional.

**UNION:** Elimina duplicados automáticamente. `UNION ALL` retiene todos los duplicados.

```sql
(SELECT course_id FROM section WHERE semester='Fall' AND year=2017)
UNION
(SELECT course_id FROM section WHERE semester='Spring' AND year=2018);
```

**INTERSECT:** Devuelve tuplas presentes en AMBAS consultas. Elimina duplicados. `INTERSECT ALL` retiene duplicados.

**EXCEPT:** Devuelve tuplas en la primera pero NO en la segunda. Elimina duplicados. `EXCEPT ALL` retiene.

---

## 3.6 Valores Nulos (NULL)

Los valores nulos crean complicaciones especiales:

- **Aritmética con null:** Cualquier expresión aritmética que involucra null resulta en null. Ejemplo: `NULL + 5 = NULL`.
- **Comparaciones con null:** Cualquier comparación con null resulta en UNKNOWN (tercer valor lógico, además de true y false).

Tabla de verdad con UNKNOWN:

- `true AND unknown = unknown`; `false AND unknown = false`; `unknown AND unknown = unknown`
- `true OR unknown = true`; `false OR unknown = unknown`; `unknown OR unknown = unknown`
- `NOT unknown = unknown`

El WHERE solo incluye tuplas donde el predicado evalúa a TRUE (las que evalúan a false o unknown quedan excluidas).

Para verificar si un valor ES null se usa: `WHERE salary IS NULL;` o `WHERE salary IS NOT NULL;`

---

## 3.7 Funciones Agregadas

### Funciones Agregadas Básicas

SQL ofrece 5 funciones agregadas estándar: `avg`, `min`, `max`, `sum`, `count`. Actúan sobre colecciones de valores.

```sql
SELECT avg(salary) AS avg_salary FROM instructor
WHERE dept_name = 'Comp. Sci.';

SELECT count(*) FROM course;  -- cuenta tuplas

SELECT count(DISTINCT ID) FROM teaches WHERE semester='Spring' AND year=2018;
```

> ⚠️ **Regla de duplicados en agregaciones:** Para `avg` y `sum`, eliminar duplicados puede dar resultados incorrectos. Usa DISTINCT solo cuando realmente lo necesitas.

### Agrupación — GROUP BY

Permite aplicar funciones agregadas a grupos de tuplas:

```sql
SELECT dept_name, avg(salary) AS avg_salary
FROM instructor
GROUP BY dept_name;
```

**REGLA CRÍTICA:** Los atributos que aparecen en SELECT sin ser agregados DEBEN estar en GROUP BY. Si un atributo no está en GROUP BY, solo puede aparecer en SELECT como argumento de una función agregada.

Ejemplo incorrecto (SQL lo rechaza):

```sql
-- ERRÓNEO: ID no está en GROUP BY
SELECT dept_name, ID, avg(salary)
FROM instructor GROUP BY dept_name;
```

### Filtrado de Grupos — HAVING

HAVING permite imponer condiciones sobre grupos (después de agrupar), en lugar de sobre tuplas individuales (que es lo que hace WHERE):

```sql
SELECT dept_name, avg(salary) AS avg_salary
FROM instructor
GROUP BY dept_name
HAVING avg(salary) > 42000;
```

**Orden de ejecución lógico:** FROM → WHERE → GROUP BY → HAVING → SELECT.

### Agregación con Valores Null

Todas las funciones agregadas EXCEPTO `count(*)` ignoran los valores null. Si la colección de valores está vacía después de ignorar nulls, count devuelve 0 y todas las demás devuelven null.

---

## 3.8 Subconsultas Anidadas (Nested Subqueries)

### Membresía en Conjuntos — IN y NOT IN

Permiten verificar si un valor está (o no está) en el conjunto producido por una subconsulta:

```sql
SELECT DISTINCT course_id FROM section
WHERE semester='Fall' AND year=2017 AND
      course_id IN (SELECT course_id FROM section
                   WHERE semester='Spring' AND year=2018);
```

IN también funciona con conjuntos enumerados: `WHERE name NOT IN ('Mozart', 'Einstein');`

### Comparación de Conjuntos — SOME y ALL

**SOME (= ANY):** La condición es verdadera si se satisface para al menos UN elemento del conjunto. `= SOME` equivale a IN; `<> SOME` NO equivale a NOT IN.

```sql
SELECT name FROM instructor
WHERE salary > SOME (SELECT salary FROM instructor
                    WHERE dept_name = 'Biology');
```

**ALL:** La condición es verdadera si se satisface para TODOS los elementos del conjunto. `<> ALL` equivale a NOT IN; `= ALL` NO equivale a IN.

```sql
SELECT name FROM instructor
WHERE salary > ALL (SELECT salary FROM instructor
                   WHERE dept_name = 'Biology');
```

### Subconsultas Correlacionadas — EXISTS y NOT EXISTS

EXISTS devuelve true si la subconsulta retorna al menos una tupla. NOT EXISTS devuelve true si la subconsulta está vacía:

```sql
-- Instructores que enseñan algún curso de Biología:
SELECT name FROM instructor I
WHERE EXISTS (SELECT * FROM teaches T
             WHERE T.ID = I.ID AND T.course_id LIKE 'BIO%');
```

### UNIQUE — Verificar Duplicados

El test UNIQUE evalúa como true si la subconsulta no contiene tuplas duplicadas:

```sql
SELECT T.course_id FROM course T
WHERE UNIQUE (SELECT R.course_id FROM section R
             WHERE T.course_id = R.course_id AND R.year = 2017);
```

Devuelve cursos que se ofrecieron como máximo una vez en 2017.

### Subconsultas en FROM

Una subconsulta puede aparecer en la cláusula FROM:

```sql
SELECT dept_name, avg_salary FROM
    (SELECT dept_name, avg(salary) AS avg_salary
     FROM instructor GROUP BY dept_name) AS dept_avg
WHERE avg_salary > 42000;
```

La cláusula WITH permite definir vistas temporales (solo válidas en esa consulta):

```sql
WITH max_budget(value) AS
    (SELECT MAX(budget) FROM department)
SELECT dept_name FROM department, max_budget
WHERE department.budget = max_budget.value;
```

---

## 3.9 Modificación de la Base de Datos

### DELETE

```sql
DELETE FROM instructor WHERE dept_name = 'Finance';
```

Elimina solo las tuplas que satisfacen el WHERE. Sin WHERE, elimina todas las tuplas.

### INSERT

```sql
INSERT INTO course VALUES ('CS-437', 'Database Systems', 'Comp. Sci.', 4);
INSERT INTO student(ID, name, dept_name) VALUES ('3003', 'Green', 'Finance');  -- tot_cred se pone null
```

También se puede insertar el resultado de una consulta:

```sql
INSERT INTO instructor
    SELECT ID, name, dept_name, 18000
    FROM student WHERE dept_name = 'Music' AND tot_cred > 144;
```

### UPDATE

```sql
UPDATE instructor SET salary = salary * 1.05;  -- 5% de aumento a todos
UPDATE instructor SET salary = salary * 1.05 WHERE salary < 70000;
```

CASE cuando se necesitan diferentes aumentos según condición:

```sql
UPDATE instructor
SET salary = CASE
    WHEN salary <= 100000 THEN salary * 1.05
    ELSE salary * 1.03
END;
```

---

## 🎓 EJERCICIOS — CAPÍTULO 3

### Consultas SQL Básicas

**Ejercicio 3.1:** Escribe una consulta SQL para encontrar los nombres y salarios de todos los instructores cuyo salario está entre $70,000 y $100,000.

> ✓ **Respuesta:** `SELECT name, salary FROM instructor WHERE salary BETWEEN 70000 AND 100000;`

**Ejercicio 3.2:** Escribe la consulta para encontrar el promedio de salarios por departamento, mostrando solo los departamentos con promedio mayor a $80,000.

> ✓ **Respuesta:** `SELECT dept_name, avg(salary) AS avg_salary FROM instructor GROUP BY dept_name HAVING avg(salary) > 80000;`

**Ejercicio 3.3:** Encuentra los cursos que se enseñaron en otoño 2017 Y en primavera 2018 (usando INTERSECT).

> ✓ **Respuesta:** `(SELECT course_id FROM section WHERE semester='Fall' AND year=2017) INTERSECT (SELECT course_id FROM section WHERE semester='Spring' AND year=2018);`

**Ejercicio 3.4:** ¿Cuál es la diferencia entre WHERE y HAVING? Da un ejemplo de cuándo usarías cada uno.

> ✓ **Respuesta:** WHERE filtra filas individuales ANTES de agrupar. HAVING filtra GRUPOS después de agrupar. Ejemplo: `WHERE salary > 50000` elimina instructores con bajo salario antes de calcular promedios por departamento. `HAVING avg(salary) > 80000` elimina departamentos cuyo promedio es bajo.

**Ejercicio 3.5:** Escribe una consulta para encontrar los nombres de todos los instructores que ganan más que al menos un instructor del departamento de Biología, usando: (a) subconsulta con SOME y (b) versión con self-join y alias.

> ✓ **Respuesta:**
> (a) `SELECT name FROM instructor WHERE salary > SOME (SELECT salary FROM instructor WHERE dept_name = 'Biology');`
> (b) `SELECT DISTINCT T.name FROM instructor T, instructor S WHERE T.salary > S.salary AND S.dept_name = 'Biology';`

**Ejercicio 3.6:** ¿Cuál es el resultado de: `SELECT avg(salary) FROM instructor` si algunos instructores tienen salary = NULL?

> ✓ **Respuesta:** La función avg IGNORA los valores null. El resultado es el promedio calculado solo sobre los instructores que SÍ tienen un salario definido. Si TODOS los salarios fueran null, avg devolvería null.

### Verdadero o Falso

**V/F 3.1:** UNION y UNION ALL producen siempre el mismo resultado.

> ✗ **FALSO.** UNION elimina duplicados automáticamente; UNION ALL retiene todos los duplicados. Si los dos conjuntos tienen tuplas en común, los resultados diferirán.

**V/F 3.2:** En SQL, la comparación 'NULL = NULL' evalúa a TRUE.

> ✗ **FALSO.** En SQL, cualquier comparación que involucra NULL resulta en UNKNOWN. Para verificar si algo es null se usa `IS NULL`, no `= NULL`.

**V/F 3.3:** `= SOME` es equivalente a `IN` en SQL.

> ✓ **VERDADERO.** `= SOME` (o `= ANY`) verifica si el valor es igual a algún elemento del conjunto, lo cual es exactamente lo que hace `IN`.

### Escribe las Consultas SQL

**Ejercicio 3.7:** Encuentra el ID y nombre de cada instructor que haya enseñado algún curso en el departamento de Ciencias de la Computación.

> ✓ **Respuesta:** `SELECT DISTINCT I.ID, I.name FROM instructor I, teaches T, course C WHERE I.ID = T.ID AND T.course_id = C.course_id AND C.dept_name = 'Comp. Sci.';`

**Ejercicio 3.8:** Escribe la consulta para contar cuántos estudiantes hay en cada departamento que tengan más de 100 créditos totales.

> ✓ **Respuesta:** `SELECT dept_name, count(*) AS num_students FROM student WHERE tot_cred > 100 GROUP BY dept_name;`

---

# CAPÍTULO 4 — SQL Intermedio

## 4.1 Expresiones JOIN

### Natural Join

El NATURAL JOIN combina tuplas de dos relaciones que tienen el mismo valor en los atributos con el mismo nombre. Características:

- Solo considera pares de tuplas con igualdad en los atributos de mismo nombre.
- Los atributos comunes aparecen solo una vez en el resultado.
- Equivalencia: `SELECT name, course_id FROM student NATURAL JOIN takes;` es lo mismo que `SELECT name, course_id FROM student, takes WHERE student.ID = takes.ID;`

**PELIGRO del Natural Join:** Si dos relaciones tienen un atributo de mismo nombre que no deberías igualar, puede producir resultados incorrectos. Ejemplo:

```sql
-- INCORRECTO: iguala dept_name de student con dept_name de course
SELECT name, title FROM student NATURAL JOIN takes NATURAL JOIN course;

-- CORRECTO: especifica que solo se iguala course_id
SELECT name, title FROM (student NATURAL JOIN takes) JOIN course USING (course_id);
```

### JOIN … USING

Variante del natural join donde se especifican explícitamente los atributos a igualar:

```sql
SELECT name, title FROM (student NATURAL JOIN takes) JOIN course USING (course_id);
```

### JOIN … ON

Permite especificar cualquier predicado de unión:

```sql
SELECT * FROM student JOIN takes ON student.ID = takes.ID;
```

**ON vs WHERE con OUTER JOIN:** La condición ON es parte de la especificación del join y se evalúa antes de preservar tuplas sin match. WHERE filtra después. Esto hace que con outer joins, ON y WHERE produzcan resultados distintos.

### Outer Joins — Joins Externos

Los inner joins descartan tuplas sin correspondencia. Los outer joins las preservan añadiendo nulls en los atributos sin match.

**LEFT OUTER JOIN:** Preserva TODAS las tuplas de la relación de la IZQUIERDA. Las de la derecha sin match se rellenan con null.

```sql
SELECT * FROM student NATURAL LEFT OUTER JOIN takes;
```

El estudiante que no ha tomado ningún curso aparece con null en course_id, sec_id, etc.

**RIGHT OUTER JOIN:** Preserva TODAS las tuplas de la relación de la DERECHA. Simétrico al LEFT OUTER JOIN.

```sql
SELECT * FROM takes NATURAL RIGHT OUTER JOIN student;
```

**FULL OUTER JOIN:** Preserva tuplas de AMBAS relaciones sin match. Equivale a la unión de LEFT y RIGHT outer join.

```sql
SELECT * FROM (SELECT * FROM student WHERE dept_name = 'Comp. Sci.')
NATURAL FULL OUTER JOIN
(SELECT * FROM takes WHERE semester = 'Spring' AND year = 2017);
```

> 💡 **Uso práctico de Outer Joins:** LEFT OUTER JOIN es muy útil para encontrar 'qué no tiene match'. Ejemplo: `SELECT ID FROM student NATURAL LEFT OUTER JOIN takes WHERE course_id IS NULL;` — encuentra estudiantes que no han tomado ningún curso.

### Tipos y Condiciones de Join — Resumen

Cualquier tipo de join puede combinarse con cualquier condición:

- Tipos: INNER JOIN, LEFT OUTER JOIN, RIGHT OUTER JOIN, FULL OUTER JOIN
- Condiciones: NATURAL, USING (A1, A2, …), ON \<predicado\>

El join interno (INNER JOIN) es el default; la palabra INNER es opcional.

---

## 4.2 Vistas (Views)

### Definición de Vista

Una vista es una 'relación virtual' definida por una consulta. No almacena datos precomputados sino la expresión que la define; se recalcula cada vez que se usa:

```sql
CREATE VIEW faculty AS
    SELECT ID, name, dept_name FROM instructor;
```

Beneficios de las vistas:

- **Seguridad:** ocultan datos sensibles (como el salario del instructor).
- **Simplificación:** presentan una perspectiva más sencilla para ciertos usuarios.
- **Independencia lógica:** si el esquema cambia, se puede actualizar la vista sin cambiar las aplicaciones.

### Uso de Vistas en Consultas

Una vez creada, la vista se usa como cualquier relación:

```sql
CREATE VIEW physics_fall_2017 AS
    SELECT course.course_id, sec_id, building, room_number
    FROM course, section
    WHERE course.course_id = section.course_id
          AND course.dept_name = 'Physics'
          AND section.semester = 'Fall' AND section.year = 2017;

SELECT course_id FROM physics_fall_2017 WHERE building = 'Watson';
```

### Vistas Materializadas (Materialized Views)

Una vista materializada almacena el resultado precomputado en la BD. Ventajas: consultas mucho más rápidas. Desventaja: costo de actualización cuando cambian las relaciones subyacentes. El proceso de mantener actualizada la vista se llama **view maintenance**.

### Actualización de Vistas

Una vista es actualizable (updatable) si satisface TODAS estas condiciones:

- FROM tiene solo una relación de la BD.
- SELECT contiene solo nombres de atributos (no expresiones, agregados, ni DISTINCT).
- Los atributos no listados en SELECT pueden ser nulos (no tienen NOT NULL ni son clave primaria).
- No tiene GROUP BY ni HAVING.

La opción `WITH CHECK OPTION` al final de la definición de vista rechaza inserciones que no satisfacen la condición WHERE de la vista.

---

## 4.3 Transacciones

Una transacción es una secuencia de instrucciones SQL que forman una unidad lógica de trabajo.

- **COMMIT WORK:** Hace permanentes todos los cambios de la transacción. Inicia automáticamente una nueva transacción.
- **ROLLBACK WORK:** Deshace todos los cambios de la transacción actual. La BD vuelve al estado anterior.

La palabra WORK es opcional. Si un programa termina sin COMMIT ni ROLLBACK, el comportamiento es dependiente del sistema.

En la mayoría de sistemas (MySQL, PostgreSQL), cada instrucción SQL individual es por defecto su propia transacción (autocommit). Para agrupar múltiples instrucciones, se debe desactivar el autocommit: `SET AUTOCOMMIT OFF;` o usar `BEGIN ATOMIC … END`.

> ⚠️ **Consejo práctico:** En Oracle, el autocommit NO está activado por defecto. Si olvidas hacer COMMIT al desconectarte, todos los cambios se revertirán.

---

## 4.4 Restricciones de Integridad

### Restricciones en Relaciones Individuales

Además de la clave primaria, el CREATE TABLE puede incluir:

- **NOT NULL:** Prohibe valores nulos para un atributo. Ejemplo: `name VARCHAR(20) NOT NULL`.
- **UNIQUE (A1, A2, …):** Los atributos listados forman una superclave. No puede haber dos tuplas iguales en esos atributos. A diferencia de la clave primaria, los atributos UNIQUE sí pueden ser null.
- **CHECK (P):** Cada tupla debe satisfacer el predicado P. Ejemplo: `CHECK (budget > 0)`. Muy poderoso para simular tipos enumerados: `CHECK (semester IN ('Fall', 'Winter', 'Spring', 'Summer'))`.

### Integridad Referencial (Foreign Keys)

Opciones de comportamiento cuando se viola la FK por delete/update en la relación referenciada:

- **ON DELETE CASCADE:** Elimina en cascada las tuplas referenciantes.
- **ON DELETE SET NULL:** Pone null en los atributos de FK de las tuplas referenciantes.
- **ON DELETE SET DEFAULT:** Pone el valor por defecto del dominio.
- **ON UPDATE CASCADE/SET NULL/SET DEFAULT:** Análogo para actualizaciones.

```sql
FOREIGN KEY (dept_name) REFERENCES department ON DELETE CASCADE ON UPDATE CASCADE
```

### Restricciones con Nombre y Violación Durante Transacciones

Se puede dar nombre a las restricciones para poder eliminarlas después:

```sql
salary NUMERIC(8,2), CONSTRAINT minsalary CHECK (salary > 29000),
ALTER TABLE instructor DROP CONSTRAINT minsalary;
```

Una transacción puede violar temporalmente una restricción entre pasos. Para esto se puede usar `INITIALLY DEFERRED` o `DEFERRABLE` para posponer la verificación hasta el final de la transacción.

### Aserciones (Assertions)

Una aserción es un predicado que la BD siempre debe satisfacer. Se crea con `CREATE ASSERTION`. La mayoría de sistemas actuales no las implementan (se usan triggers en su lugar).

```sql
CREATE ASSERTION credits_earned_constraint CHECK
(NOT EXISTS (SELECT ID FROM student WHERE tot_cred <>
    (SELECT COALESCE(SUM(credits), 0) FROM takes NATURAL JOIN course
     WHERE student.ID = takes.ID AND grade IS NOT NULL AND grade <> 'F')));
```

---

## 4.5 Tipos de Datos SQL y Esquemas

### Tipos de Datos para Fechas y Tiempos

- **date:** Fecha con año, mes, día. Formato: `'2018-04-25'`.
- **time:** Hora en HH:MM:SS. Puede incluir información de zona horaria.
- **timestamp:** Combinación de date y time.

Funciones: `CURRENT_DATE`, `CURRENT_TIME`, `LOCALTIMESTAMP`, `EXTRACT(year FROM d)`.

Se puede hacer aritmética: la resta de dos fechas devuelve un intervalo.

### Conversión de Tipos — CAST y COALESCE

```sql
SELECT CAST(ID AS NUMERIC(5)) AS inst_id FROM instructor ORDER BY inst_id;
```

COALESCE retorna el primer argumento no-null:

```sql
SELECT ID, COALESCE(salary, 0) AS salary FROM instructor;
```

### Tipos Definidos por el Usuario

```sql
CREATE TYPE Dollars AS NUMERIC(12,2) FINAL;
CREATE TYPE Pounds AS NUMERIC(12,2) FINAL;
```

Permite verificación de tipos más estricta: no se puede asignar Dollars a Pounds aunque ambos sean NUMERIC.

**DOMAIN vs TYPE:** Los dominios pueden tener restricciones (NOT NULL, CHECK). Los tipos son más portables pero sin restricciones en su definición.

```sql
CREATE DOMAIN YearlySalary NUMERIC(8,2)
    CONSTRAINT salary_value_test CHECK(value >= 29000.00);
```

### Generación de Claves Únicas

```sql
ID NUMBER(5) GENERATED ALWAYS AS IDENTITY  -- Oracle/DB2
ID SERIAL  -- PostgreSQL
ID INT AUTO_INCREMENT  -- MySQL
```

### Esquemas, Catálogos y Entornos

Jerarquía de tres niveles para nombrar relaciones: catálogo → esquema → relación. Ejemplo: `catalog5.univ_schema.course`.

---

## 4.6 Índices en SQL

Un índice es una estructura de datos que permite acceder eficientemente a tuplas por el valor de un atributo sin escanear toda la tabla. Son parte del esquema físico (no lógico).

```sql
CREATE INDEX dept_index ON instructor (dept_name);
CREATE UNIQUE INDEX dept_index ON instructor (dept_name);  -- declara clave candidata
DROP INDEX dept_index;
```

El optimizador de consultas decide automáticamente si usar un índice para cada consulta.

---

## 4.7 Autorización

### Tipos de Privilegios

Los privilegios sobre datos son: SELECT (leer), INSERT (insertar), UPDATE (actualizar), DELETE (eliminar). También existen privilegios sobre el esquema.

### GRANT y REVOKE

```sql
GRANT SELECT ON department TO Amit, Satoshi;
GRANT UPDATE (budget) ON department TO Amit, Satoshi;
GRANT ALL PRIVILEGES ON course TO instructor_role;
REVOKE SELECT ON department FROM Amit, Satoshi;
```

`public` se refiere a todos los usuarios actuales y futuros del sistema.

Para permitir que el receptor también pueda transferir el privilegio: `GRANT SELECT ON department TO Amit WITH GRANT OPTION;`

### Roles

Un rol agrupa un conjunto de privilegios para asignarlos colectivamente:

```sql
CREATE ROLE instructor;
GRANT SELECT ON takes TO instructor;
GRANT instructor TO Satoshi;  -- el usuario Satoshi adquiere el rol
```

Los roles pueden heredarse: se puede otorgar un rol a otro rol. Los privilegios de un usuario incluyen: privilegios directos + privilegios de todos los roles otorgados.

### Autorización en Vistas

El creador de una vista obtiene solo los privilegios que puede otorgar sin exceder los que ya tenía. Las vistas se usan como mecanismo de seguridad para restringir el acceso.

```sql
CREATE VIEW geo_instructor AS
    (SELECT * FROM instructor WHERE dept_name = 'Geology');
GRANT SELECT ON geo_instructor TO geology_staff;
```

### Revocación en Cascada

Si se revoca un privilegio a un usuario que a su vez lo había concedido a otros, por defecto la revocación se propaga en cascada. Para evitar cascada: `REVOKE SELECT ON department FROM Amit RESTRICT` (fallará si Amit ha otorgado el privilegio a otros).

**El grafo de autorización:** los nodos son usuarios, hay arista U_i → U_j si U_i otorgó el privilegio a U_j. Un usuario tiene el privilegio si y solo si existe un camino desde el root (el DBA) hasta ese usuario.

---

## 🎓 EJERCICIOS — CAPÍTULO 4

### Joins

**Ejercicio 4.1:** ¿Cuál es la diferencia entre INNER JOIN y OUTER JOIN? Da un ejemplo de cuándo preferirías usar LEFT OUTER JOIN.

> ✓ **Respuesta:** INNER JOIN solo incluye en el resultado las tuplas que tienen match en ambas relaciones. OUTER JOIN preserva tuplas sin match, llenando con NULL. Usarías LEFT OUTER JOIN cuando quieres TODOS los registros de la tabla izquierda, hayan tenido match o no. Ejemplo: `SELECT s.ID, s.name, t.course_id FROM student s LEFT OUTER JOIN takes t ON s.ID = t.ID;` — muestra todos los estudiantes, incluso los que no han tomado ningún curso.

**Ejercicio 4.2:** ¿Por qué `student NATURAL JOIN takes NATURAL JOIN course` puede dar un resultado incorrecto?

> ✓ **Respuesta:** Porque student y course comparten el atributo `dept_name`. El natural join los igualaría, devolviendo solo pares (estudiante, curso) donde el departamento del estudiante es igual al departamento del curso. Un estudiante de Física tomando un curso de Matemáticas no aparecería. La solución es: `(student NATURAL JOIN takes) JOIN course USING (course_id);`

**Ejercicio 4.3:** Escribe la consulta para mostrar todos los estudiantes y los cursos que han tomado. Los estudiantes que no han tomado ningún curso también deben aparecer (con null para course_id).

> ✓ **Respuesta:** `SELECT s.ID, s.name, t.course_id, t.semester, t.year FROM student s LEFT OUTER JOIN takes t ON s.ID = t.ID;`

### Vistas y Transacciones

**Ejercicio 4.4:** ¿Cuándo una vista es actualizable (updatable) en SQL? ¿Por qué esta restricción existe?

> ✓ **Respuesta:** Una vista es actualizable cuando: (1) FROM tiene solo una relación, (2) SELECT solo contiene nombres de atributos, (3) atributos no en SELECT pueden ser null, (4) no hay GROUP BY ni HAVING. La restricción existe porque las modificaciones en la vista deben poder traducirse de forma no ambigua a modificaciones en la relación real. Si la vista tiene joins o agregados, no hay una sola forma de realizar el cambio en las tablas base.

**Ejercicio 4.5:** ¿Por qué es importante usar transacciones al actualizar múltiples tablas? Da un ejemplo.

> ✓ **Respuesta:** Para garantizar atomicidad: o todos los cambios ocurren o ninguno. Ejemplo: al registrar que un estudiante completó un curso, debemos (1) actualizar la calificación en 'takes' y (2) incrementar tot_cred en 'student'. Si el sistema falla entre ambas operaciones, la BD quedaría en estado inconsistente. Una transacción garantiza que ambas ocurren juntas o ninguna.

### Restricciones de Integridad

**Ejercicio 4.6:** Escribe el DDL para crear la tabla section con la restricción CHECK que limita el semestre a 'Fall', 'Winter', 'Spring' o 'Summer'.

> ✓ **Respuesta:**
> ```sql
> CREATE TABLE section (
>     course_id    VARCHAR(8),
>     sec_id       VARCHAR(8),
>     semester     VARCHAR(6) CHECK (semester IN ('Fall', 'Winter', 'Spring', 'Summer')),
>     year         NUMERIC(4,0) CHECK (year > 1759 AND year < 2100),
>     building     VARCHAR(15),
>     room_number  VARCHAR(7),
>     time_slot_id VARCHAR(4),
>     PRIMARY KEY (course_id, sec_id, semester, year),
>     FOREIGN KEY (course_id) REFERENCES course
> );
> ```

### Autorización

**Ejercicio 4.7:** ¿Cuál es la ventaja de usar roles versus asignar privilegios directamente a usuarios?

> ✓ **Respuesta:** Con roles, se define una vez el conjunto de privilegios del rol 'instructor' y se asigna a todos los instructores. Si hay que cambiar los privilegios, se modifica el rol y automáticamente afecta a todos los usuarios con ese rol. Sin roles, habría que modificar los privilegios de cada usuario individualmente.

### Verdadero o Falso

**V/F 4.1:** Una vista siempre refleja los datos más recientes de las relaciones subyacentes.

> ✓ **VERDADERO.** Las vistas normales (no materializadas) recalculan su contenido cada vez que son consultadas, por lo que siempre reflejan el estado actual de la BD.

**V/F 4.2:** ON DELETE CASCADE elimina automáticamente las tuplas referenciantes cuando se elimina una tupla referenciada.

> ✓ **VERDADERO.** ON DELETE CASCADE propaga la eliminación en cascada por toda la cadena de dependencias de claves foráneas.

**V/F 4.3:** UNIQUE y PRIMARY KEY son equivalentes en SQL.

> ✗ **FALSO.** PRIMARY KEY implica NOT NULL; UNIQUE permite nulls (y dos nulls no se consideran iguales). Una tabla puede tener múltiples columnas UNIQUE pero solo una clave primaria.

---

# EJERCICIOS INTEGRADOS — Todos los Capítulos

Estos ejercicios combinan conceptos de múltiples capítulos y tienen mayor nivel de dificultad.

## Análisis y Diseño

**INT.1 — ANÁLISIS:** Tienes una tabla `students(ID, name, email)` y quieres identificar: (a) cuál es la superclave más pequeña posible, (b) por qué email podría ser problemático como clave primaria, y (c) qué problemas podría surgir si almacenas los cursos tomados como un atributo multivaluado en la misma tabla.

> ✓ **Respuesta:** (a) La superclave más pequeña (clave candidata) es {ID}, ya que un número de ID generado por la institución identifica unívocamente a cada estudiante. (b) El email podría cambiar, podría no existir para todos los estudiantes, y podría ser null. Las claves primarias no deberían cambiar ni ser null. (c) Un atributo multivaluado viola el requisito de dominio atómico del modelo relacional. Viola la Primera Forma Normal. La solución correcta es crear una tabla separada `takes(student_ID, course_id, ...)` con FK a students.

**INT.2 — DISEÑO:** Necesitas representar la relación entre empleados y sus gerentes. Cada empleado tiene exactamente un gerente (excepto el CEO). ¿Cómo modelarías esto con el esquema relacional? ¿Qué tipo de restricción usarías?

> ✓ **Respuesta:** Agrega un atributo `manager_id` a la tabla `employee(ID, name, ..., manager_id)`. `manager_id` sería una clave foránea que referencia al mismo ID de la tabla employee (FK autorreferencial). El CEO tendrá `manager_id = NULL`. La FK se define como: `FOREIGN KEY (manager_id) REFERENCES employee(ID)`.

## Consultas Complejas

**INT.3 — CONSULTA AVANZADA:** Escribe una consulta SQL para encontrar los departamentos donde el instructor con mayor salario gana menos que el instructor con menor salario del departamento de Física.

> ✓ **Respuesta:**
> ```sql
> SELECT dept_name FROM instructor
> GROUP BY dept_name
> HAVING MAX(salary) < (SELECT MIN(salary) FROM instructor WHERE dept_name = 'Physics');
> ```

**INT.4 — SUBCONSULTAS:** Usa SQL para encontrar los estudiantes que han tomado TODOS los cursos ofrecidos en el departamento de Ciencias de la Computación.

> ✓ **Respuesta:**
> ```sql
> SELECT DISTINCT s.ID, s.name FROM student s
> WHERE NOT EXISTS (
>     SELECT course_id FROM course WHERE dept_name = 'Comp. Sci.'
>     EXCEPT
>     SELECT t.course_id FROM takes t WHERE t.ID = s.ID
> );
> ```
> Para cada estudiante, verifica que no exista ningún curso de Comp. Sci. que el estudiante NO haya tomado.

**INT.5 — VISTAS Y SEGURIDAD:** El personal de nómina necesita ver solo el ID, nombre y salario de los instructores. Un asistente docente necesita ver solo los cursos y secciones disponibles. Escribe las definiciones de vista y los GRANT apropiados.

> ✓ **Respuesta:**
> ```sql
> -- Vista para nómina:
> CREATE VIEW payroll_view AS SELECT ID, name, salary FROM instructor;
> GRANT SELECT ON payroll_view TO payroll_staff;
> 
> -- Vista para asistentes:
> CREATE VIEW course_section_view AS
>     SELECT c.course_id, c.title, s.sec_id, s.semester, s.year
>     FROM course c, section s
>     WHERE c.course_id = s.course_id;
> GRANT SELECT ON course_section_view TO teaching_assistant;
> ```

**INT.6 — JOINS COMPLEJOS:** Escribe la consulta para mostrar, para cada estudiante, su nombre y el número de cursos que ha completado. Los estudiantes sin cursos completados también deben aparecer (con 0).

> ✓ **Respuesta:**
> ```sql
> SELECT s.ID, s.name, COUNT(t.course_id) AS courses_completed
> FROM student s LEFT OUTER JOIN takes t
>     ON s.ID = t.ID AND t.grade IS NOT NULL AND t.grade <> 'F'
> GROUP BY s.ID, s.name;
> ```
> La condición en ON (no en WHERE) es crucial para que se mantenga el comportamiento del outer join.

**INT.7 — ÁLGEBRA RELACIONAL vs SQL:** Expresa en álgebra relacional y luego en SQL: 'Encontrar el nombre de cada instructor y el número de cursos que enseña en el semestre de primavera 2018.'

> ✓ **Respuesta:**
> Álgebra Relacional: `r ← σsemester='Spring'∧year=2018(teaches)`, luego agregación `γID,count(course_id)(r)`, y join con instructor para nombre.
> ```sql
> SELECT I.ID, I.name, COUNT(T.course_id) AS courses_taught
> FROM instructor I LEFT OUTER JOIN teaches T
>     ON I.ID = T.ID AND T.semester = 'Spring' AND T.year = 2018
> GROUP BY I.ID, I.name;
> ```

## Análisis de Errores Comunes

**INT.8 — DETECTAR EL ERROR:** El siguiente SQL tiene un problema. Identifícalo y corrígelo:
`SELECT dept_name, ID, avg(salary) FROM instructor GROUP BY dept_name;`

> ✓ **Respuesta:** ERROR: ID no está en la cláusula GROUP BY ni es argumento de una función agregada. Todos los atributos del SELECT que no sean agregados DEBEN aparecer en GROUP BY.
> Corrección: `SELECT dept_name, avg(salary) FROM instructor GROUP BY dept_name;`

**INT.9 — ENTENDER NULL:** Dado que `NULL = NULL` evalúa a UNKNOWN en SQL, ¿cómo funciona SELECT DISTINCT cuando hay valores null? ¿Y cómo funciona UNION con tuplas que tienen null?

> ✓ **Respuesta:** En SELECT DISTINCT: SQL trata dos valores NULL como idénticos para propósitos de eliminar duplicados. Dos tuplas `{('A', null), ('A', null)}` se consideran iguales y se muestra solo una. En UNION: similarmente, si dos tuplas con null aparecen en ambas consultas, el UNION las trata como idénticas y muestra solo una copia. Este tratamiento difiere del comportamiento en predicados WHERE, donde `null = null` devuelve UNKNOWN.

**INT.10 — INTEGRIDAD REFERENCIAL:** ¿Qué sucede cuando se intenta eliminar el departamento 'Physics' y existen instructores asignados a ese departamento? Describe tres opciones y sus implicaciones.

> ✓ **Respuesta:** (1) **REJECT** (defecto sin CASCADE): La operación de DELETE falla con un error. El departamento no puede eliminarse mientras tenga instructores. (2) **ON DELETE CASCADE:** Se eliminan automáticamente todos los instructores de Physics (y potencialmente sus cursos, secciones, etc. en cascada). Drástico pero mantiene consistencia. (3) **ON DELETE SET NULL:** dept_name de los instructores de Physics se pone a NULL. Los instructores existen pero sin departamento asignado. Puede ser apropiado si los instructores serán reasignados.

---

# RESUMEN GENERAL DE CONCEPTOS CLAVE

## Conceptos Fundamentales a Recordar para el Examen

- **Modelo Relacional:** Datos en tablas (relaciones). Filas son tuplas. Columnas son atributos. Dominios atómicos. Sin duplicados (matemáticamente).
- **Claves:** Superclave ⊇ Clave candidata ⊇ Clave primaria. FK = restricción referencial a PK de otra tabla.
- **Álgebra Relacional:** σ (select), Π (project), ρ (rename), × (producto), ⋈ (join), ∪, ∩, − (conjuntos), ← (asignación).
- **DDL SQL:** CREATE TABLE, ALTER TABLE, DROP TABLE. Restricciones: PK, FK, NOT NULL, UNIQUE, CHECK.
- **DML SQL:** SELECT-FROM-WHERE. DISTINCT, ORDER BY, BETWEEN, LIKE. GROUP BY + HAVING. Funciones agregadas: avg, min, max, sum, count.
- **Subconsultas:** IN/NOT IN, SOME/ALL, EXISTS/NOT EXISTS, subconsultas en FROM, WITH.
- **JOINS:** INNER JOIN (default), LEFT/RIGHT/FULL OUTER JOIN. Condiciones: NATURAL, USING, ON.
- **Vistas:** Relaciones virtuales. CREATE VIEW. Vistas materializadas. Condiciones de actualización. WITH CHECK OPTION.
- **Transacciones:** COMMIT = guardar cambios. ROLLBACK = deshacer cambios. Propiedades: atomicidad.
- **Integridad:** NOT NULL, UNIQUE, CHECK, FK con CASCADE/SET NULL/SET DEFAULT. DEFERRED constraints. Assertions.
- **Autorización:** GRANT / REVOKE. Privilegios: SELECT, INSERT, UPDATE, DELETE. Roles. WITH GRANT OPTION. Cascading revocation.

---

*— Fin del Resumen de Estudio —*
