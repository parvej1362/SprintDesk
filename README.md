# SprintDesk

> A modern, responsive MERN-stack project and sprint management web application engineered for high-velocity software engineering teams. Developed for the StartupMeu Software Engineer Intern technical assessment.

---

## 📚 Engineering Documentation

Comprehensive architecture, requirements, UI/UX designs, APIs, database models, and phased implementation guides are documented in the [`docs/`](./docs/) directory:

1. **[01-SRS.md](./docs/01-SRS.md)** — **Software Requirements Specification**
   *Problem statement, user roles, functional requirements (FR-001 to FR-024), non-functional requirements, business rules, workflows, and traceability matrix.*

2. **[02-TECH-STACK.md](./docs/02-TECH-STACK.md)** — **Technology Stack & Engineering Standards**
   *Dependency inventory, architecture diagrams, boundary responsibilities, coding conventions, environment setup, and security standards.*

3. **[03-UI-UX-DESIGN.md](./docs/03-UI-UX-DESIGN.md)** — **UI Design & UX Decisions**
   *Design principles, Dark Navy & Indigo design tokens, application shell layout, page specifications, reusable components, and accessibility guidelines.*

4. **[04-END-TO-END-IMPLEMENTATION.md](./docs/04-END-TO-END-IMPLEMENTATION.md)** — **End-to-End Implementation Plan**
   *Repository audit, complete request lifecycles, 13-phase implementation sequence, testing strategy, Definition of Done, and AI coding agent guidelines.*

5. **[05-API-DOCUMENTATION.md](./docs/05-API-DOCUMENTATION.md)** — **REST API Specification**
   *API conventions, standard response envelopes, Project endpoints, Task endpoints, Dashboard summary aggregations, error catalogue, and testing matrix.*

6. **[06-DATABASE-DESIGN.md](./docs/06-DATABASE-DESIGN.md)** — **Database Design & MongoDB Schemas**
   *Entity relationship diagrams, Mongoose schemas for Projects and Tasks, indexing strategy, atomic cascade deletion policies, and query patterns.*

---

## 🛠 Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS v4, React Router DOM v7, TanStack Query v5, Lucide React, Recharts.
- **Backend**: Node.js 22 LTS, Express 5, Mongoose 9, Zod, Helmet, Morgan, CORS, express-rate-limit.
- **Database**: MongoDB Atlas.

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- Node.js `v22.x` LTS
- NPM `10.x`
- MongoDB instance (MongoDB Atlas URI or local instance)

### 2. Client Setup
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
# Running on http://localhost:5173
```

### 3. Server Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev
# Running on http://localhost:5000
```

---

## 📋 Implementation Status

| Component | Status | Next Milestone |
| :--- | :--- | :--- |
| **Engineering Specifications** | Completed | 6 formal specifications in `docs/` |
| **Backend Scaffolding** | Partially Implemented | Phase 1: Bootstrapper & Health Endpoint |
| **Frontend Scaffolding** | Partially Implemented | Phase 2: Tailwind Integration & App Shell |
| **Database & API Implementation** | Planned | Phases 3–5: Models & CRUD Endpoints |
