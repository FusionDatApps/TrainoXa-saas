
# 📘 TrainoXa — Documento Maestro del Proyecto

**Versión:** 1.0
**Tipo:** SaaS B2C (Entrenador → Cliente)
**Estado:** Definición estratégica (Día 0)

---

# 1. Visión del Producto

**TrainoXa** es una plataforma SaaS diseñada para entrenadores personales que necesitan operar, escalar y profesionalizar su negocio fitness mediante un sistema centralizado de gestión de clientes, rutinas y progreso.

El sistema reemplaza flujos fragmentados basados en:

* WhatsApp
* PDFs
* hojas de cálculo

Por un entorno estructurado, trazable y escalable.

### Resultado esperado

Un entrenador pasa de operar manualmente a operar como un negocio digital con control, visibilidad y capacidad de crecimiento.

---

# 2. Problema a Resolver

Los entrenadores independientes enfrentan:

* gestión manual de clientes
* creación repetitiva de rutinas
* falta de seguimiento estructurado
* baja adherencia del cliente
* dificultad para escalar

Esto genera:

* pérdida de tiempo operativo
* baja retención
* experiencia inconsistente
* ingresos limitados por capacidad humana

---

# 3. Usuario Objetivo

## 3.1 Entrenador (Primary User)

**Perfil:**

* entrenador personal independiente
* coach online
* microempresa fitness

**Necesidades:**

* centralizar operación
* reducir carga manual
* mejorar retención
* escalar clientes sin perder control

---

## 3.2 Cliente (End User)

**Perfil:**

* usuario final que sigue un plan de entrenamiento

**Necesidades:**

* claridad en su rutina
* seguimiento del progreso
* sensación de avance
* experiencia estructurada

---

# 4. Propuesta de Valor

TrainoXa proporciona:

### Eficiencia operativa

* reducción de tareas repetitivas
* reutilización de rutinas
* centralización de datos

### Mejora en retención

* seguimiento visible
* historial estructurado
* control de cumplimiento

### Experiencia profesional

* interfaz organizada
* acceso continuo a su plan
* percepción de servicio premium

---

# 5. Alcance del MVP

## Incluye

* autenticación de usuarios
* sistema de roles (trainer / client)
* gestión de clientes
* gestión de ejercicios
* creación de rutinas
* asignación de rutinas
* registro de progreso básico
* dashboard inicial

---

## Excluye

* chat en tiempo real
* pagos y facturación
* inteligencia artificial
* app móvil nativa
* integraciones externas
* gamificación avanzada

---

## Criterio de exclusión

Reducir complejidad inicial para:

* acelerar validación
* evitar sobreingeniería
* mantener control técnico

---

# 6. Módulos del Sistema

## 6.1 Autenticación

* registro
* login
* control de acceso por rol

---

## 6.2 Gestión de Clientes

* creación
* listado
* visualización de detalle

---

## 6.3 Gestión de Ejercicios

* creación de ejercicios
* categorización por grupo muscular

---

## 6.4 Gestión de Rutinas

* creación de planes
* estructuración de ejercicios
* parametrización (sets, reps, notas)

---

## 6.5 Asignación

* vinculación rutina → cliente
* control de estado

---

## 6.6 Seguimiento

* registro de cumplimiento
* registro de cargas (peso, reps)
* historial básico

---

## 6.7 Dashboard

* resumen de clientes
* actividad general
* indicadores básicos

---

# 7. Reglas de Negocio

* un usuario tiene un rol único (trainer o client)
* un entrenador solo accede a sus propios clientes
* un cliente solo accede a su información asignada
* los ejercicios pertenecen a un entrenador
* las rutinas pertenecen a un entrenador
* una rutina puede contener múltiples ejercicios
* un cliente puede tener múltiples asignaciones
* el progreso está ligado a una asignación específica

---

# 8. Arquitectura del Sistema

## Backend

* Node.js + Express
* Prisma ORM
* PostgreSQL

## Frontend

* Next.js
* TypeScript
* Tailwind CSS

---

## Principios arquitectónicos

* separación de capas (routes / controllers / services)
* lógica de negocio aislada en services
* validación explícita de entrada
* estructura modular escalable
* diseño orientado a crecimiento

---

# 9. Modelo de Datos (Conceptual)

## User

* id
* email
* password
* role

---

## TrainerProfile

* id
* userId

---

## ClientProfile

* id
* userId
* trainerId

---

## Exercise

* id
* trainerId
* name
* muscleGroup

---

## WorkoutPlan

* id
* trainerId
* name
* description

---

## WorkoutPlanExercise

* id
* workoutPlanId
* exerciseId
* sets
* reps
* notes

---

## ClientAssignment

* id
* trainerId
* clientId
* workoutPlanId
* active
* startDate

---

## ProgressLog

* id
* assignmentId
* exerciseId
* date
* reps
* weight
* completed

---

# 10. Mapa de Interfaces

## Público

* login
* registro

---

## Entrenador

* dashboard
* lista de clientes
* detalle de cliente
* gestión de ejercicios
* gestión de rutinas
* asignaciones

---

## Cliente

* panel personal
* rutina asignada
* registro de progreso

---

# 11. Relación Módulo / Entidad / API

| Módulo         | Entidad             | Endpoint Base           |
| -------------- | ------------------- | ----------------------- |
| Auth           | User                | /auth                   |
| Clientes       | ClientProfile       | /clients                |
| Ejercicios     | Exercise            | /exercises              |
| Rutinas        | WorkoutPlan         | /workouts               |
| Detalle Rutina | WorkoutPlanExercise | /workouts/:id/exercises |
| Asignación     | ClientAssignment    | /assignments            |
| Progreso       | ProgressLog         | /progress               |
| Dashboard      | múltiples           | /dashboard              |

---

# 12. Roadmap de Desarrollo

| Fase    | Objetivo               |
| ------- | ---------------------- |
| Día 0   | Definición del sistema |
| Día 1   | Setup técnico          |
| Día 2   | Modelo de datos        |
| Día 3   | Autenticación          |
| Día 4   | Clientes               |
| Día 5   | Ejercicios             |
| Día 6   | Rutinas                |
| Día 7   | Asignaciones           |
| Día 8   | Progreso               |
| Día 9   | Dashboard              |
| Día 10+ | Refinamiento           |

---

# 13. Riesgos Identificados

## Técnicos

* mala definición de relaciones
* acoplamiento de lógica
* endpoints inconsistentes

## Producto

* sobrecarga de funcionalidades
* falta de validación con usuarios reales
* UX poco clara

---

# 14. Criterios de Éxito MVP

* entrenador puede crear clientes
* puede asignar rutinas
* cliente puede ver su plan
* cliente puede registrar progreso
* entrenador puede visualizar actividad

---

# 15. Enfoque Estratégico

El objetivo no es construir una app compleja.

Es construir:

* un sistema funcional
* validable con usuarios reales
* base para monetización futura

---

# 🧾 Cierre

Este documento define la base operativa de TrainoXa.

Cualquier desarrollo posterior debe:

* respetar esta estructura
* evitar desviaciones innecesarias
* priorizar funcionalidad sobre complejidad

---

