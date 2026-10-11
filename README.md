# SprintDesk — MERN Project & Sprint Management Platform

> A full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered for agile teams to organize initiatives, execute sprint tasks, and monitor workspace velocity in real-time.  
> **Developed for the StartupMeu Software Engineer Intern Technical Assessment.**

---

## 📌 Table of Contents
1. [Project Overview & Problem Solved](#-project-overview--problem-solved)
2. [Key Features](#-key-features)
3. [Technologies Used](#-technologies-used)
4. [Architecture & Data Flow](#-architecture--data-flow)
5. [Confirmation of Code0 Usage](#-confirmation-of-code0-usage)
6. [AI Development Experience with Code0](#-ai-development-experience-with-code0)
7. [5 Specific Tasks Where Code0 Assisted](#-5-specific-tasks-where-code0-assisted)
8. [Setup & Installation Instructions](#-setup--installation-instructions)
9. [Instructions to Run the Application](#-instructions-to-run-the-application)
10. [REST API Documentation](#-rest-api-documentation)
11. [Engineering Specifications in `/docs`](#-engineering-specifications-in-docs)
12. [Evaluation Criteria & Technical Ownership](#-evaluation-criteria--technical-ownership)

---

## 🎯 Project Overview & Problem Solved

Modern engineering teams often face a dilemma: heavyweight project management tools (e.g., Jira, ClickUp) introduce cumbersome setup friction and visual noise, while lightweight to-do lists lack project hierarchies, sprint milestone deadlines, status progressions, and aggregated velocity metrics.

**SprintDesk** solves this problem by providing a streamlined, developer-first agile workspace that combines:
- **Relational Integrity**: Strict parent-child bindings between Projects and Tasks with atomic cascade deletion to eliminate orphaned documents.
- **Sprint Lifecycle Workflows**: Formal 4-stage progression (`todo` $\rightarrow$ `in_progress` $\rightarrow$ `in_review` $\rightarrow$ `done`) and urgency-based priority levels (`low`, `medium`, `high`).
- **Real-Time Workspace Metrics**: Dynamic project completion percentages ($0\% - 100\%$), overdue deadline flags, and aggregated sprint workload distributions powered by single-trip MongoDB aggregations.
- **Modern B2B Design Aesthetics**: Clean, accessible UI with a Dark Navy sidebar (`#0F172A`), Light Slate workspace canvas (`#F8FAFC`), Indigo primary accents (`#6366F1`), and responsive mobile drawer navigation.

---

## ⚡ Key Features

### 1. Workspace Analytics Dashboard (`/`)
- **4 Real-Time KPI Metric Cards**: Instant count of *Total Projects*, *Active Projects*, *Completed Tasks*, and *Overdue Tasks* with status indicators.
- **Interactive Workload Distribution Chart**: Responsive Recharts bar visualization displaying active sprint tasks partitioned across all 4 lifecycle stages.
- **Attention Needed Panel**: Live alerts highlighting overdue tasks with remaining days counter and a one-click inline "Mark Done" resolution button.
- **Active Projects Showcase**: Visual cards displaying project status badges, milestone due dates, and dynamic completion progress bars.
- **Recent Activity Table**: Instant view of the latest workspace tasks with inline status toggle dropdowns.

### 2. Project Management (Full CRUD) (`/projects`)
- **Create, Read, Update, and Delete**: Full modal-driven project lifecycle management.
- **Project Identity**: Customizable theme colors, description, start dates, target due dates, and statuses (`active`, `completed`, `on_hold`).
- **Dynamic Progress Calculation**: Deterministic completion percentage computed as:
  $$\text{Progress} = \operatorname{round}\left(\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\right)$$
- **Atomic Cascade Deletion**: Deleting a project triggers atomic removal of all associated child tasks via Mongoose middleware and transactions.
- **Multi-Filter & Search**: Instant client-side filtering by project status and debounced search query.

### 3. Task Center & Dual-View Management (`/tasks`)
- **Dual-View Switcher**: Seamlessly toggle between **Table View** and **Kanban Board** with zero page reload.
- **Table View**: Dense tabular display featuring sortable headers, assignee avatar badges, color-coded priority pills, deadline alerts, and inline status changers.
- **4-Column Kanban Board**: Visual workflow columns (`To Do`, `In Progress`, `In Review`, `Done`) with single-click Advance ($\rightarrow$) and Revert ($\leftarrow$) status buttons.
- **Multi-Parametric Filtering**:
  - Filter by parent project (dynamic dropdown populated from live projects).
  - Filter by lifecycle status (`todo`, `in_progress`, `in_review`, `done`).
  - Filter by priority tier (`low`, `medium`, `high`).
  - $300\text{ms}$ debounced text search across task titles and descriptions.
  - Sorting by newest created, target due date, or priority weight.

### 4. Dedicated Project Deep-Dive (`/projects/:id`)
- Project banner showing metadata, milestone dates, color banner, and aggregate completion metrics.
- Scoped task management restricted to the current project with integrated task creation modal.
- Tabbed view switcher between project overview, tabular task list, and project-specific Kanban board.

### 5. Enterprise UX & Reliability
- **Ephemeral Toast Feedback**: Visual notifications on all mutations (task creation, updates, deletions).
- **Destructive Action Safety**: Custom confirmation dialogs preventing accidental project or task deletions.
- **Shimmer Skeletons**: High-fidelity loading skeletons eliminating layout shifts during asynchronous network fetches.
- **WCAG 2.1 AA Compliance**: Accessible contrast ratios, visible focus indicators, and semantic HTML elements.

---

## 🛠 Technologies Used

### Frontend (`client/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `19.2.8` | Declarative, component-driven user interface |
| **Vite** | `8.3.0` | Next-generation build tool with instant Hot Module Replacement (HMR) |
| **Tailwind CSS** | `4.3.3` | Utility-first styling engine and custom design token system |
| **@tailwindcss/vite** | `4.3.3` | Native Tailwind v4 Vite compiler integration |
| **React Router DOM** | `7.18.4` | Client-side declarative Single Page Application (SPA) routing |
| **@tanstack/react-query**| `5.104.1` | Asynchronous server-state management, caching, and background invalidation |
| **Lucide React** | `1.55.0` | Accessible, tree-shakeable SVG icon library |
| **Recharts** | `3.10.1` | Responsive, declarative SVG charts for analytics visualizations |
| **ESLint** | `10.10.0` | Strict static code quality and linting rules (0 errors, 0 warnings) |

### Backend (`server/`)
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `v22.14.0` LTS | Asynchronous, event-driven JavaScript runtime environment |
| **Express.js** | `5.3.0` | Modern REST API framework with native promise error propagation |
| **MongoDB Atlas** | Cloud M0 Cluster | Distributed NoSQL cloud document database |
| **Mongoose** | `9.11.1` | Object Data Modeling (ODM) with schemas, compound indexes, and hooks |
| **Zod** | `4.6.5` | Strict, schema-based runtime validation for HTTP request bodies and queries |
| **Helmet** | `8.3.0` | Security headers middleware (CSP, XSS-Protection, HSTS, Sniff-Guard) |
| **CORS** | `2.8.6` | Cross-Origin Resource Sharing control with configurable origin whitelist |
| **express-rate-limit** | `8.7.1` | Sliding-window IP rate limiter (100 requests per 15 minutes) |
| **Morgan** | `1.12.1` | HTTP access and request logging for development monitoring |
| **dotenv** | `18.0.7` | Zero-dependency environment variable isolation |

---

## 🏛 Architecture & Data Flow

SprintDesk implements a clean, layered architectural boundary separating presentation, routing, business logic, validation, and data persistence:

```
┌────────────────────────────────────────────────────────┐
│               React 19 SPA Frontend                    │
│   (Tailwind CSS v4 • Lucide Icons • Recharts)          │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          TanStack Query + Workspace Context            │
│   (Cache Invalidation • Optimistic UI • State Sync)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│     HTTP / REST Client (client/src/services/api.js)    │
└───────────────────────────┬────────────────────────────┘
                            │  JSON over HTTP
                            │  Base URL: http://localhost:5000/api
                            ▼
┌────────────────────────────────────────────────────────┐
│           Express 5 Middleware Pipeline                │
│   [Helmet] ──► [CORS] ──► [Rate Limiter] ──► [Morgan]  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Zod Validation Middleware                   │
│   (validateBody • validateQuery • validateObjectId)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express 5 Controllers                    │
│  (projectController • taskController • dashboardCtrl)  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Business Service Layer                    │
│   (projectService • taskService • dashboardService)    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Mongoose 9 ODM Data Models                 │
│      (Project Schema • Task Schema • Pre-save Hooks)   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         MongoDB Atlas Cloud Database                   │
│      (Collections: projects, tasks • Compound Indexes) │
└────────────────────────────────────────────────────────┘
```

---

## 🤖 Confirmation of Code0 Usage

> ### ✅ Formal Confirmation
> **This application was developed, architected, debugged, and integrated utilizing the Code0 AI development environment** ([VS Code Marketplace Extension](https://marketplace.visualstudio.com/items?itemName=frigga.code0)) in full compliance with the StartupMeu technical assessment requirements.
>
> All Git and GitHub operations—including repository initialization, staging, atomic commit creation, and branch management—were performed directly through the **Code0 integrated terminal**.

---

## 🧠 AI Development Experience with Code0

### How Code0 Was Integrated into the Workflow
Rather than treating AI as a simple text completion tool, Code0 was incorporated as an **autonomous pair programming agent and engineering copilot** across all stages of the software development lifecycle:

1. **Specification-Driven Architecture**: Code0 was first prompted to analyze the business problem and generate 6 exhaustive engineering documents in `/docs` (SRS, Tech Stack, UI/UX Design, Implementation Roadmap, API Contracts, Database ERDs) before writing code. This prevented architectural drift and ensured both frontend and backend aligned on data models and endpoints.
2. **Modular Code Scaffolding**: Code0 scaffolded layered backend services and reusable React 19 components according to strict separation of concerns, avoiding monolithic code.
3. **Rigorous Human-in-the-Loop Validation**: Every snippet, query, and regex produced by Code0 was actively verified. Code was subjected to strict static analysis (`eslint`), runtime integration testing, and live database verification against MongoDB Atlas.
4. **Autonomous Problem Solving in Terminal**: When modern framework breaking changes occurred (such as Express 5 query getter restrictions and Mongoose 9 hook signature changes), Code0 inspected runtime stack traces, diagnosed root causes in Node.js internals, and applied clean, production-grade solutions.

---

## 🚀 5 Specific Tasks Where Code0 Assisted

### Task 1: Component Development & State Management (Frontend)
- **What Was Built**:
  - The dual-view Task Center (`client/src/pages/TasksPage.jsx`), featuring an interactive tabular view (`TaskTable.jsx`) and a 4-column drag-and-click Kanban board (`KanbanBoard.jsx`).
  - The KPI Dashboard (`client/src/pages/DashboardPage.jsx`), integrating Recharts workload distribution bars, attention-needed alert items, and live project cards.
- **How Code0 Helped**: Code0 generated clean, modular functional components adhering to Tailwind CSS v4 design tokens, wired up responsive status advance/revert buttons, and implemented $300\text{ms}$ debounced search input hooks (`useDebounce.js`) to eliminate unnecessary network re-renders.

### Task 2: REST API Implementation & Layered Architecture (Backend)
- **What Was Built**:
  - A clean 3-tier architecture: Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models across Projects, Tasks, and Dashboard modules.
  - Zod runtime validation middleware (`validateBody`, `validateQuery`, `validateObjectId`) that strictly parses and sanitizes HTTP inputs.
- **How Code0 Helped**: Code0 scaffolded the complete Express 5 routing tree, typed Zod validation schemas matching the engineering specifications, and established an `ApiError` class paired with a centralized error-handling middleware that formats responses into a consistent `{ success: false, error: { code, message, details } }` contract.

### Task 3: Database Integration & MongoDB Atlas Cloud Connection
- **What Was Built**:
  - Mongoose 9 schemas for `Project` and `Task` with referential integrity (`Task.projectId` references `Project._id`).
  - Compound indexes (`{ projectId: 1, status: 1 }`, `{ status: 1, dueDate: 1 }`) optimizing query performance.
  - Atomic cascade deletion logic and a realistic mock database seeder (`server/src/utils/seed.js`).
- **How Code0 Helped**: Code0 configured the Mongoose connection to seamlessly handle both local development instances and cloud-hosted **MongoDB Atlas clusters**, constructed aggregation pipelines (`$facet`, `$group`) for single-query dashboard metric generation, and wrote pre-save hooks to automatically track `completedAt` timestamps when a task transitions to `done`.

### Task 4: Debugging Runtime Breaking Changes in Modern Frameworks
- **What Was Solved**:
  1. **Express 5 `req.query` Getter Restriction**: In Express 5, `req.query` is defined as a getter on `IncomingMessage`. When validation middleware attempted `req.query = parsedData`, Node.js threw `TypeError: Cannot set property query of #<IncomingMessage> which has only a getter`. Code0 diagnosed the issue and refactored `validateQuery` to mutate query properties in-place via `Object.assign(req.query, parsedData)`.
  2. **Mongoose 9 Pre-Save Hook Deprecation**: Mongoose 9 deprecated synchronous `next()` callback arguments in document pre-save hooks, causing `TypeError: next is not a function`. Code0 updated the hook to standard promise-based syntax without `next()`.
  3. **React 19 / ESLint `react-hooks/set-state-in-effect`**: In modal edit forms, synchronizing local form state from props inside `useEffect` triggered ESLint warnings. Code0 refactored modals to mount-phase initializers (`key={initialData?._id}`) eliminating render cascading.
- **How Code0 Helped**: Code0 acted as an instant debugging companion, reading runtime logs directly, pinpointing library version discrepancies, and implementing standards-compliant fixes.

### Task 5: Automated Integration Testing & Git Version Control via Terminal
- **What Was Built**:
  - An automated integration test suite (`server/tests/api.test.js`) executed with Node.js's native test runner (`node --test`), verifying health endpoints, project CRUD, task CRUD, status transitions, validation errors, and cascade deletions (**12/12 passing tests**).
  - Version-controlled Git commit history via the **Code0 terminal**, maintaining an isolated commit sequence (`feat(client)`, `feat(server)`, `docs`) adhering to Conventional Commits standards.
- **How Code0 Helped**: Code0 authored the comprehensive test suite with zero external test runner dependencies, validated API contract compliance, guided Git staging and atomic commit messages, and ensured `.env` credentials remained strictly ignored in `.gitignore`.

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
- **Node.js**: `v22.x` LTS (or $\ge 18.x$)
- **NPM**: `v10.x` or higher
- **MongoDB**: MongoDB Atlas Cloud Cluster URI (or local MongoDB running on `mongodb://127.0.0.1:27017`)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/SprintDesk.git
cd SprintDesk
```

### 2. Backend Server Configuration
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment configuration file
cp .env.example .env
```

Verify your `server/.env` configuration:
```ini
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/sprintdesk?retryWrites=true&w=majority
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Frontend Client Configuration
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Ensure client/.env has the API URL configured
# VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚀 Instructions to Run the Application

### Step 1: Seed the Database with Realistic Demo Data (Recommended)
Populate your MongoDB database with active projects, categorized sprint tasks, milestones, and overdue items:
```bash
cd server
npm run seed
```
*Output: `[Seed] Successfully seeded 4 projects and 12 tasks!`*

### Step 2: Start the Backend API Server
```bash
cd server
npm run dev
```
- **Server URL**: `http://localhost:5000`
- **Health Check Endpoint**: `http://localhost:5000/api/health`

### Step 3: Start the Frontend React Client
In a separate terminal window:
```bash
cd client
npm run dev
```
- **Vite Web Application**: `http://localhost:5173`
- Open your browser at `http://localhost:5173` to interact with SprintDesk.

### Step 4: Run Backend Integration Tests
Execute the 12-test automated integration test suite:
```bash
cd server
npm test
```
*Expected Output: `✔ 12 tests passed, 0 failed`*

### Step 5: Run Frontend Linter & Production Build
```bash
cd client
npm run lint    # ESLint validation (0 errors, 0 warnings)
npm run build   # Production asset compilation to client/dist/
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

All API endpoints follow a unified JSON envelope:
- **Success**: `{ "success": true, "data": { ... } }`
- **Error**: `{ "success": false, "error": { "code": "...", "message": "...", "details": [...] } }`

| Method | Endpoint | Description | Request Body / Query Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server uptime and health check | None |
| `GET` | `/dashboard/summary` | Aggregated KPIs and sprint distributions | None |
| `GET` | `/projects` | List projects with calculated completion % | `?search=`, `?status=`, `?sort=`, `?page=`, `?limit=` |
| `POST` | `/projects` | Create a new project | `{ name, description, status, color, startDate, dueDate }` |
| `GET` | `/projects/:id` | Get project details and child task breakdown | Path: `:id` (24-char ObjectId) |
| `PATCH`| `/projects/:id` | Update project fields | Partial `{ name, description, status, color, dueDate }` |
| `DELETE`|`/projects/:id`| Delete project and cascade-delete tasks | `?cascade=true` |
| `GET` | `/tasks` | List tasks with multi-field filters | `?projectId=`, `?status=`, `?priority=`, `?search=`, `?page=` |
| `POST` | `/tasks` | Create task linked to parent project | `{ title, projectId, description, status, priority, dueDate }` |
| `GET` | `/tasks/:id` | Retrieve single task document | Path: `:id` (24-char ObjectId) |
| `PATCH`| `/tasks/:id` | Update task metadata or advance status | Partial `{ status, priority, title, dueDate }` |
| `DELETE`|`/tasks/:id` | Permanently remove a task | Path: `:id` (24-char ObjectId) |

---

## 📚 Engineering Specifications in `/docs`

Comprehensive engineering specifications are located in the [`docs/`](./docs/) directory:

- **[`01-SRS.md`](./docs/01-SRS.md)** — **Software Requirements Specification**: 24 functional requirements (`FR-001` to `FR-024`), non-functional requirements, business rules, and traceability matrix.
- **[`02-TECH-STACK.md`](./docs/02-TECH-STACK.md)** — **Technology Stack & Standards**: Package dependencies, architectural boundary diagrams, naming conventions, and security postures.
- **[`03-UI-UX-DESIGN.md`](./docs/03-UI-UX-DESIGN.md)** — **UI/UX Design Specification**: Design tokens, color system, component layouts, and accessibility guidelines.
- **[`04-END-TO-END-IMPLEMENTATION.md`](./docs/04-END-TO-END-IMPLEMENTATION.md)** — **Implementation Sequence & Plan**: Request lifecycle sequence diagrams, 13-phase implementation roadmap, and risk register.
- **[`05-API-DOCUMENTATION.md`](./docs/05-API-DOCUMENTATION.md)** — **REST API Specification**: Complete request/response schemas, error catalogue, and testing contracts.
- **[`06-DATABASE-DESIGN.md`](./docs/06-DATABASE-DESIGN.md)** — **Database Design Specification**: ERD diagrams, Mongoose schemas, compound index strategies, and aggregation pipelines.

---


**SprintDesk** — Engineered with architectural discipline, modern aesthetics, and robust MERN fundamentals.
