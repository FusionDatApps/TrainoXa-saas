# TrainoXa SaaS

TrainoXa is a full-stack SaaS platform for fitness coaches to manage clients, workout plans, assignments, and progress from a centralized digital system.

The project is designed to replace fragmented workflows based on WhatsApp, PDFs, and spreadsheets with a structured, scalable, and professional software solution.

---

## Project Vision

TrainoXa helps fitness coaches operate like a real digital business instead of manually managing routines, follow-ups, and client progress across disconnected tools.

The platform aims to improve:

- operational efficiency
- client retention
- service quality
- scalability for independent coaches and small fitness businesses

---

## Core Problem

Many coaches currently work with:

- WhatsApp for communication
- PDF files for workout delivery
- Excel or manual notes for tracking progress

This creates several problems:

- repetitive manual work
- poor visibility of client progress
- inconsistent service delivery
- limited capacity to scale
- lower retention over time

TrainoXa solves this by centralizing the operation in one platform.

---

## MVP Scope

### Included in MVP
- user authentication
- role-based access
- client management
- exercise management
- workout plan creation
- workout assignment to clients
- progress tracking
- basic dashboard

### Excluded from MVP
- payments
- real-time chat
- AI features
- wearable integrations
- native mobile app
- advanced gamification
- external integrations

The initial goal is to validate the product with a clean and controlled core system before adding complexity.

---

## User Roles

### Trainer
A coach who can:

- register and log in
- create and manage clients
- create exercises
- build workout plans
- assign workout plans
- monitor client progress

### Client
An end user who can:

- log in
- view assigned workout plans
- track workout completion
- register basic progress

---

## Planned Modules

- Authentication
- Client Management
- Exercise Management
- Workout Plan Management
- Assignment Management
- Progress Tracking
- Dashboard

---

## Tech Stack

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT
- Zod

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

---

## Initial Architecture

TrainoXa follows a modular full-stack structure.

### Backend layers
- routes
- controllers
- services
- database access via Prisma

### Frontend approach
- Next.js App Router
- modular UI structure
- scalable feature-based growth

---

## Project Structure

```text
trainoxa-saas/
├── backend/
│   ├── prisma/
│   ├── src/
│   └── package.json
├── frontend/
│   ├── app/
│   ├── public/
│   └── package.json
├── docs/
│   └── MASTER.md
└── README.md