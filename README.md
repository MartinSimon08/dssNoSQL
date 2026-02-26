
#  Sistema de Gestión de Comandas - Pizzería - TPI INTEGRACION DE UNA BASE DE DATOS NOSQL

### **Proyecto Final**

**Alumno:** Martin Forlini Simon

**Profesores:** Emilio Watemberg y Giudici Paula

---

##  Cómo ejecutar el proyecto

> **Nota:** El Backend y el Frontend se encuentran en la misma estructura de carpetas (monorepo).

### 1. Requisitos Previos

* Tener instalado **Node.js**.
* Tener **MongoDB Community Server** instalado y el servicio activo.

### 2. Levantar el Backend

Desde la carpeta raíz del proyecto (`app`), abre una terminal y ejecuta:

```bash
node server/index.js

```

**Resultado esperado en consola:**

```text
Servidor en puerto 4000
Mongo conectado

```

* **API URL:** `http://localhost:4000`

### 3. Levantar el Frontend

Abre una **segunda terminal** en la misma carpeta raíz y ejecuta:

```bash
npm run dev

```

* **App URL:** `http://localhost:5173`

---

##  Fundamentación Teórica: Base de Datos No Relacional (NoSQL)

### ¿Qué es NoSQL?

A diferencia de las bases de datos relacionales (SQL) basadas en tablas rígidas, las NoSQL almacenan datos en formatos flexibles como documentos. No requieren un esquema fijo, permitiendo que cada registro tenga una estructura única si es necesario.

### ¿Cuándo es conveniente usarla?

* Datos no estructurados o que cambian constantemente.
* Proyectos que requieren alta escalabilidad horizontal.
* Desarrollo ágil con evolución rápida del modelo de datos.
* Casos donde la persistencia a largo plazo no es el objetivo principal.

---

##  Problemática y Elección de MongoDB

### Problemática: Gestión de Comandas en Tiempo Real

Un sistema de pizzería gestiona pedidos con alta variabilidad: notas especiales, múltiples variedades y diversos métodos de entrega (Rappi, PedidosYa, Delivery Propio, Retiro). Una tabla rígida obligaría a tener muchos campos vacíos o relaciones complejas para un flujo que debe ser rápido y dinámico.

### ¿Por qué MongoDB?

1. **Documentos Nativo:** Las comandas son, por naturaleza, documentos. Un "Ticket" es un objeto con ítems, cliente y estado; no hay necesidad de hacer *joins* complejos. Toda la información vive y muere dentro del mismo objeto.
2. **JSON Nativo:** Al usar BSON (JSON binario), la comunicación con **React/JavaScript** es natural. El estado de la App y la DB hablan el mismo idioma.
3. **Esquema Flexible:** Permite agregar campos (como "monto a pagar" o "empleado") sobre la marcha sin necesidad de migraciones de base de datos costosas.
4. **Desarrollo Ágil:** Menor tiempo en diseño de diagramas entidad-relación y mayor tiempo en funcionalidad.

---

## Solución Implementada

Aplicación **Full Stack** diseñada para la gestión operativa de una cocina. Permite un control total sobre el ciclo de vida del pedido mediante los siguientes estados:

`PENDIENTE` → `EN_PREPARACION` → `LISTO` → `DESPACHADO`

### Funciones Principales:

* **CRUD Completo:** Crear, leer, actualizar y eliminar pedidos.
* **Persistencia Real:** Integración con MongoDB para mantener datos tras reinicios.
* **Gestión de Ítems:** Manejo de múltiples pizzas por ticket.
* **Sistema de Prioridades:** Resaltado visual para pedidos urgentes.
* **Interfaz de Tablero:** Visualización clara de pedidos activos.

---

##  Tecnologías y Arquitectura

### Arquitectura de 3 Capas:

1. **Frontend (Cliente):** React + Vite. Interfaz interactiva y manejo de estado.
2. **Backend (Servidor):** Node.js + Express. API REST para lógica de negocio.
3. **Base de Datos:** MongoDB + Mongoose. Persistencia documental de pedidos.

---

##  Dificultades Encontradas

* **Sincronización de estados:** Lograr que la interfaz de usuario refleje los cambios de la base de datos de forma inmediata tras operaciones CRUD.
* **Gestión de arrays anidados:** El desafío técnico de manipular eficientemente el agregado y quitado de múltiples ítems (pizzas) dentro de un mismo documento de pedido.
* **Validaciones de formulario:** Controlar la integridad de los datos (número de pedido y selección mínima de ítems) antes de impactar el servidor.

---
