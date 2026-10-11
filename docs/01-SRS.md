# Software Requirements Specification (SRS)
## SprintDesk — Project & Sprint Management Web Application

---

## 1. Document Control

| Property | Details |
| :--- | :--- |
| **Project Name** | SprintDesk |
| **Document Purpose** | Formal Software Requirements Specification defining functional and non-functional requirements, data flows, business rules, and acceptance criteria for the SprintDesk MERN application. |
| **Version** | `1.0.0` |
| **Last Updated** | October 2026 |
| **Document Status** | Approved Baseline Specification |
| **Target Audience** | Software Engineers, Technical Evaluators, Code Reviewers, QA Engineers, and AI Coding Agents |
| **Assessment Context** | StartupMeu Software Engineer Intern Technical Assessment |

---

## 2. Product Overview

### 2.1 Problem Statement
Modern agile squads and software development teams frequently face friction with enterprise-tier project management suites (e.g., Jira, Monday.com, ClickUp). These platforms often suffer from high configuration overhead, complex permission hierarchies, slow initial load times, and cluttered user interfaces. On the other end of the spectrum, standard to-do applications lack relational hierarchies between strategic initiatives (projects) and tactical execution units (tasks/sprints), offering zero visibility into project-level completion velocity, overdue milestones, or priority queues.

### 2.2 Proposed Solution
**SprintDesk** is a streamlined, responsive, full-stack MERN (MongoDB, Express, React, Node.js) web application designed specifically for sprint tracking, project organization, and task execution. SprintDesk provides:
- High-efficiency workspace navigation with an intuitive dark-navy and indigo SaaS aesthetic.
- Relational integrity linking tasks strictly to parent projects.
- Immediate visual indicators for task lifecycle states (`todo`, `in_progress`, `in_review`, `done`) and priorities (`low`, `medium`, `high`).
- Automated, deterministic project completion progress tracking ($0\% - 100\%$).
- An aggregated dashboard revealing key performance indicators (active tasks, overdue alerts, completion distribution) without UI lag.

### 2.3 Product Vision
To serve as a developer-first, visually compelling, and architecturally resilient task-and-sprint management system that balances speed of interaction with enterprise-grade data consistency.

### 2.4 Primary Users
1. **Software Engineering Interns & Developers**: Need to quickly view assigned tasks, update work statuses across lifecycle columns, check impending deadlines, and manage task backlogs without cognitive overload.
2. **Scrum Masters & Engineering Leads**: Need to establish projects, monitor overall completion progress, evaluate workload distribution by priority, and identify bottlenecked or overdue work items.
3. **Technical Evaluators & Hiring Assessors**: Require a clean, idiomatic, fully functional, maintainable, and thoroughly tested codebase demonstrating senior-level architectural discipline.

### 2.5 Scope of the Assessment
The scope of this technical assessment covers:
- Core Workspace Dashboard with aggregate analytical KPIs.
- Complete CRUD operations for Projects.
- Complete CRUD operations for Tasks linked relationally to Projects.
- Interactive status transitions, priority tagging, and due-date scheduling.
- Client-side and server-side search, multi-criteria filtering, sorting, and pagination.
- Comprehensive UI state handling (loading skeletons, empty states, validation feedback, error banners).
- Express REST API with input validation, sanitization, centralized error handling, and rate limiting.
- MongoDB Atlas database schemas with Mongoose models, index optimization, and cascade deletion rules.

### 2.6 Assumptions and Constraints
- **Runtime Environment**: Node.js `v22.x` LTS and NPM `10.x`.
- **Database**: MongoDB Atlas cloud cluster (or local MongoDB replica/standalone) managed via Mongoose ODM.
- **Frontend Framework**: React 19 Single Page Application (SPA) bundled via Vite with ES Modules.
- **Client Form Factor**: Responsive web design targeting desktop screens ($1440\text{px}+$, $1024\text{px}$), tablets ($768\text{px}$), and mobile viewports ($375\text{px}$).
- **Single-Workspace Execution**: During the primary assessment (Phases 1–11), the application operates in single-workspace mode without requiring login barriers, enabling instant evaluation. User authentication and tenant isolation are architected for Phase 12.

---

## 3. Product Goals

| Goal ID | Category | Objective | Measurable Success Metric |
| :--- | :--- | :--- | :--- |
| **G-01** | Project Management | Seamless project lifecycle creation, tracking, editing, and deletion. | Project creation to dashboard visibility in $< 200\text{ms}$ client render time. |
| **G-02** | Task Management | Granular task assignment, priority tagging, status progression, and editing. | $100\%$ schema validation compliance; zero orphaned tasks. |
| **G-03** | Progress Visibility | Instant, accurate calculation of project completion rates and overdue counts. | Dynamic progress percentage updates reflecting exact DB status formula. |
| **G-04** | Ease of Use | Frictionless UI with keyboard navigation, clear states, and responsive layout. | Accessibility compliance with WCAG 2.1 AA standards; zero modal focus trapping bugs. |
| **G-05** | Data Integrity | Strict referential consistency between tasks and parent projects. | Enforced MongoDB ObjectIds; verified cascade deletion behavior. |
| **G-06** | Testability & Quality | Modular decoupled codebase with reproducible verification scripts. | $100\%$ route coverage in integration tests; reproducible production build. |

---

## 4. Functional Requirements

### 4.1 Requirement Classification
- **Must Have (M)**: Core capabilities required to fulfill the assessment baseline.
- **Should Have (S)**: High-value capabilities expected in modern production SaaS tools.
- **Could Have (C)**: Value-add features reserved for subsequent iterations.

---

### FR-001: Dashboard Overview and Workspace Metrics
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Backend server and database are operational.
- **Description**: The application must display an overview dashboard presenting high-level workspace analytics.
- **Expected Behavior**: Upon navigation to `/` or `/dashboard`, the UI renders summary stat cards displaying Total Projects, Active Projects, Total Tasks, Completed Tasks, and Overdue Tasks, accompanied by status distribution charts and recent task items.
- **Acceptance Criteria**:
  1. Displays 4+ key metric cards reflecting live database aggregations.
  2. Displays an Overdue Tasks metric card highlighting tasks past due date whose status is not `done`.
  3. Provides a visual status breakdown (e.g., Donut or Bar chart using Recharts).
  4. Renders a loading skeleton during data acquisition and an error banner with a retry button on network failure.
- **Dependencies**: FR-019, FR-020, API Endpoint `GET /api/dashboard/summary`.

---

### FR-002: Project Creation
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: User is in the Projects view or clicks "New Project" in the shell.
- **Description**: The user must be able to create a new project with a name, description, status, accent color, start date, and target due date.
- **Expected Behavior**: Submitting the project modal sends a payload to `POST /api/projects`. Upon a `201 Created` response, the modal closes, a success toast appears, and the project cache refreshes automatically.
- **Acceptance Criteria**:
  1. Name is mandatory (3–100 characters, trimmed).
  2. Accent color defaults to `#6366F1` if unspecified.
  3. Status defaults to `active` (`planned`, `active`, `completed`, `on_hold` allowed).
  4. Submitting invalid inputs displays clear inline validation errors without closing the modal.
  5. The creation request handles loading states by disabling the submit button.
- **Dependencies**: API Endpoint `POST /api/projects`, Mongoose `Project` model.

---

### FR-003: Project Listing and Overview
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Projects exist or empty state is reached.
- **Description**: The user must be able to view a grid or list of all existing projects with high-level summary cards.
- **Expected Behavior**: Navigating to `/projects` fetches paginated/filtered projects. Each card shows the project name, description preview, status badge, completion progress bar, task count, and target due date.
- **Acceptance Criteria**:
  1. Renders project cards with accurate progress percentage ($0\% - 100\%$).
  2. Includes quick action buttons: View Details, Edit, Delete.
  3. Displays an intuitive Empty State illustration with a "Create Project" action button when zero projects exist.
- **Dependencies**: API Endpoint `GET /api/projects`.

---

### FR-004: Project Details View
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Project exists in database.
- **Description**: Navigating to `/projects/:id` must display comprehensive metadata for the project, its aggregate metrics, and all associated tasks.
- **Expected Behavior**: Displays project header (name, dates, status, color badge, progress bar) alongside a tabbed or structured view of project tasks (List/Table view and Kanban view).
- **Acceptance Criteria**:
  1. Returns `404 Not Found` UI if the project ID does not exist or is invalid.
  2. Displays calculated progress based strictly on the project's own tasks.
  3. Allows triggering "Create Task" pre-assigned to this specific project ID.
- **Dependencies**: API Endpoint `GET /api/projects/:id`, `GET /api/tasks?projectId=:id`.

---

### FR-005: Project Editing
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Target project exists.
- **Description**: The user must be able to modify project metadata (name, description, status, color, dates).
- **Expected Behavior**: Clicking "Edit" opens a pre-populated form modal. Submitting dispatches `PATCH /api/projects/:id`.
- **Acceptance Criteria**:
  1. Existing field values populate the form fields accurately.
  2. Partial updates are supported (only modified fields need to be updated).
  3. Optimistic or immediate TanStack Query cache invalidation updates the UI.
- **Dependencies**: API Endpoint `PATCH /api/projects/:id`.

---

### FR-006: Project Deletion & Task Cascade Policy
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Target project exists.
- **Description**: The user must be able to delete a project, with explicit confirmation and predictable task cleanup.
- **Expected Behavior**: Triggering delete opens a destructive confirmation modal stating that deleting the project will remove all associated tasks.
- **Acceptance Criteria**:
  1. Requires explicit confirmation before issuing `DELETE /api/projects/:id?cascade=true`.
  2. Cascade deletion cleans up all tasks referencing `projectId` within an atomic or sequential server operation.
  3. UI redirects to `/projects` with a success toast.
  4. Non-existent project deletion returns `404 Not Found`.
- **Dependencies**: API Endpoint `DELETE /api/projects/:id`, Database cascade deletion logic.

---

### FR-007: Task Creation within Project
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: At least one project exists in the database.
- **Description**: The user must be able to create tasks associated with an existing project.
- **Expected Behavior**: Task modal allows inputting title, description, project selector, status, priority, assignee name, labels, and due date. Dispatches `POST /api/tasks`.
- **Acceptance Criteria**:
  1. Title is required (3–150 characters).
  2. Project selection is mandatory and must be a valid existing MongoDB ObjectId.
  3. Status defaults to `todo` (`todo`, `in_progress`, `in_review`, `done`).
  4. Priority defaults to `medium` (`low`, `medium`, `high`).
  5. Upon success, parent project completion progress updates dynamically.
- **Dependencies**: API Endpoint `POST /api/tasks`, Mongoose `Task` model.

---

### FR-008: Task Listing, Filtering, and Views
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Database is accessible.
- **Description**: Global `/tasks` and project-scoped task views must provide flexible display formats (Table and Board/Kanban views).
- **Expected Behavior**: Lists tasks with columns for Title, Project, Status, Priority, Assignee, Due Date, and Actions.
- **Acceptance Criteria**:
  1. Supports toggle between Table View and Kanban Board View.
  2. Shows color-coded badges for status and priority.
  3. Overdue tasks display clear warning visual cues (red text/calendar icon).
- **Dependencies**: API Endpoint `GET /api/tasks`.

---

### FR-009: Task Details View
- **Priority**: Should Have (S)
- **Status**: Planned
- **Preconditions**: Task exists in database.
- **Description**: Clicking a task row or card opens a detail slide-over drawer or modal.
- **Expected Behavior**: Displays complete task description, parent project link, status history, labels, assignee, created/updated timestamps, and completion timestamp.
- **Acceptance Criteria**:
  1. Displays clickable link to parent project.
  2. Enables direct inline status or priority switching from the detail view.
- **Dependencies**: API Endpoint `GET /api/tasks/:id`.

---

### FR-010: Task Editing and Updating
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Target task exists.
- **Description**: Users can modify task title, description, priority, assignee, labels, due date, or move it to a different project.
- **Expected Behavior**: Modal pre-fills with current task data and dispatches `PATCH /api/tasks/:id`.
- **Acceptance Criteria**:
  1. Updates are verified against Zod validator schemas.
  2. Setting status to `done` automatically stamps `completedAt` timestamp on the server.
  3. Changing status back to active clears `completedAt`.
- **Dependencies**: API Endpoint `PATCH /api/tasks/:id`.

---

### FR-011: Task Status Lifecycle Transitions
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Task exists.
- **Description**: Seamlessly update task status across the standardized 4-state lifecycle: `todo` $\rightarrow$ `in_progress` $\rightarrow$ `in_review` $\rightarrow$ `done`.
- **Expected Behavior**: Quick status dropdown on task table or drag-and-drop / column buttons on Kanban board dispatch an immediate `PATCH /api/tasks/:id` with `{ status: newStatus }`.
- **Acceptance Criteria**:
  1. Accepts only enumerated status values: `todo`, `in_progress`, `in_review`, `done`.
  2. Updates parent project completion progress instantly in the UI.
- **Dependencies**: API Endpoint `PATCH /api/tasks/:id`.

---

### FR-012: Task Priority and Due Date Management
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Task creation or editing.
- **Description**: Tasks support explicit priority stratification (`low`, `medium`, `high`) and ISO 8601 calendar due dates.
- **Expected Behavior**: Priority dictates sorting order and visual urgency indicators; due dates drive the "Overdue" status calculation.
- **Acceptance Criteria**:
  1. Only valid priority enums accepted.
  2. Due dates are stored as ISO UTC dates.
  3. UI highlights overdue tasks when `dueDate < currentTimestamp` and `status !== 'done'`.
- **Dependencies**: Model constraints and helper utility functions.

---

### FR-013: Task Deletion
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Task exists.
- **Description**: User can remove a task permanently.
- **Expected Behavior**: Destructive action triggers confirmation dialog, executes `DELETE /api/tasks/:id`, and refreshes project progress and task lists.
- **Acceptance Criteria**:
  1. Removes document from database.
  2. Recalculates dashboard metrics and project completion rates.
  3. Returns `200 OK` or `204 No Content` with success response.
- **Dependencies**: API Endpoint `DELETE /api/tasks/:id`.

---

### FR-014: Relational Project-Task Integrity
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Database operations involving projects or tasks.
- **Description**: The system must enforce relational integrity such that tasks cannot be orphaned or attached to non-existent project IDs.
- **Expected Behavior**: Creating or updating a task validates that the referenced `projectId` exists in the database.
- **Acceptance Criteria**:
  1. Submitting an invalid or non-existent `projectId` yields a `400 Bad Request` or `404 Not Found` with a specific error message.
  2. Deleting a project triggers cascade task deletion so orphaned documents never persist in MongoDB.
- **Dependencies**: Database middleware and service-level validation.

---

### FR-015: Search across Projects and Tasks
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: List pages rendered.
- **Description**: User can filter projects and tasks by text search queries.
- **Expected Behavior**: Text input debounces ($300\text{ms}$) and filters client list or passes `?search=query` parameter to backend queries.
- **Acceptance Criteria**:
  1. Matches case-insensitively against project `name` and `description`.
  2. Matches case-insensitively against task `title`, `description`, and `assignee`.
- **Dependencies**: Frontend debounce hook and backend regex/text query handler.

---

### FR-016: Multi-Criteria Filtering
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Project and task lists rendered.
- **Description**: Users can filter tasks by Status (`todo`, `in_progress`, `in_review`, `done`), Priority (`low`, `medium`, `high`), and Project ID.
- **Expected Behavior**: Selecting filter pills or dropdowns updates query parameters and filters rendered datasets.
- **Acceptance Criteria**:
  1. Multiple filters can be combined (e.g., High Priority AND In Progress).
  2. Clear Filters button restores default view.
- **Dependencies**: React state / URL search params and Express query parser.

---

### FR-017: Sorting and Ordering
- **Priority**: Should Have (S)
- **Status**: Planned
- **Preconditions**: Data lists rendered.
- **Description**: Enable sorting by due date (ascending/descending), priority, creation date, and alphabetical title/name.
- **Expected Behavior**: Clicking table column headers or selecting a sort dropdown updates query ordering (`?sort=-createdAt` or `?sort=dueDate`).
- **Acceptance Criteria**:
  1. Defaults to latest created (`-createdAt`).
  2. Sorting by due date correctly handles null/undefined due dates (placed at end).
- **Dependencies**: Mongoose query sort operators.

---

### FR-018: Pagination Controls
- **Priority**: Should Have (S)
- **Status**: Planned
- **Preconditions**: Dataset exceeds page limit (e.g., $> 10$ records).
- **Description**: Provide paginated query responses and UI navigation controls (Previous, Next, Page Numbers, Items per Page).
- **Expected Behavior**: API accepts `?page=1&limit=10` and returns metadata envelope `{ total, page, limit, totalPages, data }`.
- **Acceptance Criteria**:
  1. Navigation buttons disable when at boundary pages ($1$ or $totalPages$).
  2. Changing page triggers instant cache fetch.
- **Dependencies**: Express pagination middleware/utility.

---

### FR-019: Dashboard Key Performance Indicators (KPIs)
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Workspace data exists.
- **Description**: Server aggregates high-level metrics for rapid single-call dashboard rendering.
- **Expected Behavior**: Dedicated endpoint `GET /api/dashboard/summary` computes metrics via MongoDB aggregation.
- **Acceptance Criteria**:
  1. Returns `totalProjects`, `activeProjects`, `totalTasks`, `completedTasks`, `activeTasks`, `overdueTasks`.
  2. Returns distribution of tasks by status and priority.
  3. Returns 5 most recently created/updated tasks.
- **Dependencies**: API Endpoint `GET /api/dashboard/summary`.

---

### FR-020: Project Progress Calculation
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Project contains zero or more tasks.
- **Description**: The system must compute project progress deterministically.
- **Expected Behavior**: Formula:
  $$\text{Progress \%} = \begin{cases} 0 & \text{if Total Tasks} = 0 \\ \operatorname{round}\left(\frac{\text{Completed Tasks}}{\text{Total Tasks}} \times 100\right) & \text{if Total Tasks} > 0 \end{cases}$$
- **Acceptance Criteria**:
  1. Clamped strictly between $0$ and $100$.
  2. A completed task is strictly defined as `status === 'done'`.
  3. Displays a visual progress bar with accessible `aria-valuenow` attributes.
- **Dependencies**: Backend aggregation helper and frontend progress component.

---

### FR-021: Visual State Handling (Loading, Empty, Success, Error)
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Any user interaction or asynchronous network request.
- **Description**: Every view and interactive element must explicitly communicate operational state.
- **Expected Behavior**:
  - Loading: Animated skeleton cards/rows (never a raw blank screen).
  - Empty: Semantic illustration, informative copy, and primary action button.
  - Error: Informative error card with retry mechanism; inline field validation errors.
  - Success: Temporary non-intrusive toast notifications ($3000\text{ms}$).
- **Acceptance Criteria**:
  1. Zero layout shift when transitioning from skeleton to content.
  2. Actionable error messages that avoid leaking database internals or stack traces.
- **Dependencies**: UI components (`Skeleton`, `EmptyState`, `ToastContext`, `ErrorBanner`).

---

### FR-022: Responsive Navigation and Application Shell
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Client application loaded in browser.
- **Description**: Provide a persistent application shell with a Dark Navy sidebar (`#0F172A`), Light Slate workspace background (`#F8FAFC`), Topbar with global search and quick actions, and responsive mobile drawer.
- **Expected Behavior**:
  - Desktop ($> 1024\text{px}$): Fixed or collapsible sidebar.
  - Mobile/Tablet ($< 1024\text{px}$): Hamburger button toggles accessible off-canvas drawer with backdrop blur.
- **Acceptance Criteria**:
  1. Active route highlighted with Indigo accent (`#6366F1`).
  2. Focus properly trapped inside mobile drawer when open; Esc key closes drawer.
- **Dependencies**: Layout components (`AppShell`, `Sidebar`, `Topbar`).

---

### FR-023: Input Validation and Safe Error Propagation
- **Priority**: Must Have (M)
- **Status**: Planned
- **Preconditions**: Client dispatches mutation request to API.
- **Description**: Both frontend and backend validate input schemas. Express passes request bodies through Zod schemas before controllers execute.
- **Expected Behavior**: Failed validation returns `400 Bad Request` with structured field errors: `{ success: false, error: { code: 'VALIDATION_ERROR', message: '...', details: [{ field: 'title', message: '...' }] } }`.
- **Acceptance Criteria**:
  1. No unvalidated payload reaches database queries.
  2. Unhandled server exceptions return generic `500 Internal Server Error` without exposing stack traces.
- **Dependencies**: Zod schemas, validation middleware, centralized error handler.

---

### FR-024: User Authentication and Tenant Isolation (Future Scope)
- **Priority**: Could Have (C)
- **Status**: Planned (Phase 12)
- **Preconditions**: Phases 1–11 completed and verified.
- **Description**: Add JWT or session-based authentication to secure endpoints and isolate project/task data per user.
- **Expected Behavior**: Protected routes verify bearer tokens; all queries scope with `{ userId: req.user._id }`.
- **Acceptance Criteria**:
  1. Passwords hashed via bcrypt.
  2. Strict tenant isolation: User A cannot read, modify, or delete User B's projects or tasks.
- **Dependencies**: Phase 12 implementation, `User` model, auth middleware.

---

## 5. Non-Functional Requirements (NFRs)

### 5.1 Performance Goals
- **NFR-01 (API Latency)**: $95\%$ of read requests (`GET /api/projects`, `GET /api/tasks`, `GET /api/dashboard/summary`) respond in $< 200\text{ms}$ under typical assessment loads.
- **NFR-02 (Frontend Web Vitals)**:
  - First Contentful Paint (FCP): $< 1.2\text{s}$
  - Largest Contentful Paint (LCP): $< 2.0\text{s}$
  - Cumulative Layout Shift (CLS): $< 0.05$
- **NFR-03 (Bundle Size)**: Production client bundle gzipped $< 300\text{kB}$ (initial JS chunk $< 150\text{kB}$).

### 5.2 Security Standards
- **NFR-04 (HTTP Security Headers)**: Helmet middleware configured on Express to enforce secure headers (HSTS, X-Content-Type-Options, X-Frame-Options).
- **NFR-05 (CORS Restrictions)**: CORS middleware restricted to designated `CLIENT_URL` (e.g., `http://localhost:5173`).
- **NFR-06 (Rate Limiting)**: `express-rate-limit` enforces maximum $100$ requests per $15$-minute window per IP for standard API routes.
- **NFR-07 (Injection & Query Safety)**: Mongoose queries must never accept unsanitized arbitrary objects directly into filter conditions; strict schema typing prevents NoSQL injection.
- **NFR-08 (Zero Secret Exposure)**: Passwords, tokens, and database connection URIs must never be committed to Git or output in client bundles or log files.

### 5.3 Reliability and Availability
- **NFR-09 (Database Resilience)**: Mongoose connection includes auto-reconnect logic and event listeners (`connected`, `error`, `disconnected`).
- **NFR-10 (Unhandled Errors)**: Zero unhandled promise rejections or uncaught exceptions leading to silent process failure; graceful shutdown on `SIGTERM` / `SIGINT`.

### 5.4 Accessibility (a11y)
- **NFR-11 (WCAG Compliance)**: Color contrast for text and interactive elements meets WCAG 2.1 AA standard ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large text).
- **NFR-12 (Keyboard Navigability)**: All interactive elements (buttons, inputs, modal dialogs, status badges) navigable via `Tab`, `Enter`, `Space`, and `Escape`.
- **NFR-13 (Screen Reader Support)**: Semantic HTML (`<main>`, `<nav>`, `<aside>`, `<header>`, `<table>`) with appropriate ARIA attributes (`aria-expanded`, `aria-modal`, `aria-valuenow`).

### 5.5 Maintainability and Code Quality
- **NFR-14 (Modular Architecture)**: Strict separation of concerns: Route $\rightarrow$ Validator $\rightarrow$ Controller $\rightarrow$ Service $\rightarrow$ Model.
- **NFR-15 (Component Sizing)**: React components kept modular (target $< 250$ lines of code per component file).
- **NFR-16 (ESLint & Static Analysis)**: Zero ESLint syntax errors or unhandled warnings in client and server codebases.

---

## 6. Business Rules

| Rule ID | Rule Statement | Enforcement Layer | Failure Action |
| :--- | :--- | :--- | :--- |
| **BR-001** | Every task must belong to an existing, valid project. | Mongoose Model & Zod Validator | Reject with `400 Bad Request` or `404 Not Found`. |
| **BR-002** | All database identifiers must be valid 24-character hexadecimal MongoDB ObjectIds. | Express Middleware (`validateObjectId`) | Immediate `400 Bad Request` (`"Invalid resource identifier format"`). |
| **BR-003** | Task status must strictly be one of: `todo`, `in_progress`, `in_review`, `done`. | Zod & Mongoose Enum | Validation rejection `400 Bad Request`. |
| **BR-004** | Task priority must strictly be one of: `low`, `medium`, `high`. | Zod & Mongoose Enum | Validation rejection `400 Bad Request`. |
| **BR-005** | Project status must strictly be one of: `planned`, `active`, `completed`, `on_hold`. | Zod & Mongoose Enum | Validation rejection `400 Bad Request`. |
| **BR-006** | Project progress must always be an integer bounded between $0$ and $100$. | Service Aggregation Logic | Normalized and clamped: $\min(100, \max(0, \text{value}))$. |
| **BR-007** | A task is defined as "Overdue" if and only if `dueDate < now` AND `status !== 'done'`. | Dashboard Service & Client Helpers | Flagged in UI with overdue visual indicator; counted in dashboard metrics. |
| **BR-008** | Setting a task status to `done` sets `completedAt` to current timestamp; transitioning away from `done` clears `completedAt` to `null`. | Mongoose Pre-Save / Service Layer | Automated timestamp management. |
| **BR-009** | Deleting a project triggers cascade deletion of all child tasks. Orphaned tasks are strictly prohibited. | Project Service & Mongoose Middleware | Child tasks deleted atomically alongside parent project. |
| **BR-010** | Empty or whitespace-only project names or task titles are invalid. Leading and trailing whitespace must be trimmed. | Zod Pre-transforms & Mongoose Trim | Trimmed automatically; rejected if length $< 3$. |

---

## 7. Step-by-Step User Workflows

### 7.1 Workflow 1: Creating a Project
1. User navigates to `/projects` or clicks the global "New Project" button in the Topbar.
2. An accessible modal opens, setting initial focus to the Project Name input.
3. User enters project details:
   - Name: `"Mobile App Redesign"` (required, 3–100 chars).
   - Description: `"Refactoring navigation and core screens"` (optional).
   - Status: Selects `"active"` (defaults to `active`).
   - Accent Color: Chooses from preset palette or custom hex (defaults to `#6366F1`).
   - Target Due Date: Selects date from datepicker.
4. User clicks "Create Project".
5. Client runs local validation. If invalid, field displays red border and helper message.
6. Client dispatches `POST /api/projects`.
7. Server validates payload via Zod and writes to MongoDB.
8. Server responds with `201 Created` and project document.
9. Frontend closes modal, emits success toast notification, and updates TanStack Query cache.
10. The new project card appears instantly at the top of the grid.

### 7.2 Workflow 2: Creating a Task Within a Project
1. User views Project Details page (`/projects/:id`) and clicks "Add Task".
2. Task Creation Modal opens with the project dropdown pre-selected and locked to the current project.
3. User enters:
   - Title: `"Implement Bottom Navigation"` (required).
   - Description: `"Wire React Router routes with Lucide icons"`.
   - Priority: `"high"`.
   - Status: `"todo"`.
   - Assignee: `"Alex Doe"`.
   - Due Date: Future calendar date.
4. User clicks "Save Task".
5. Request dispatched to `POST /api/tasks`.
6. Server verifies `projectId` exists in database and creates the task document.
7. Server responds with `201 Created`.
8. UI updates the task list/board and recalculates the parent project completion percentage.

### 7.3 Workflow 3: Transitioning Task Status across Lifecycle
1. User navigates to Task Board / Kanban view or Task Table.
2. User drags task card from `todo` column to `in_progress` column (or selects dropdown on table row).
3. Client fires optimistic UI update and dispatches `PATCH /api/tasks/:id` with `{ status: "in_progress" }`.
4. If the status transitions to `done`, server automatically sets `completedAt = new Date()`.
5. Server persists change and responds with `200 OK`.
6. Project progress indicator and dashboard metrics refresh.
7. If network fails, UI rolls back optimistic update and displays an error toast.

### 7.4 Workflow 4: Finding and Resolving Overdue Tasks
1. User arrives at the Dashboard and notices the "Overdue Tasks" stat card indicates 3 overdue items.
2. User clicks the Overdue stat card, navigating to `/tasks?filter=overdue`.
3. The Task view renders only tasks matching `dueDate < today` and `status != done`, styled with red warning badges.
4. User reviews the first overdue task, opens the Quick Edit dialog, and either:
   - Updates the Due Date to a future sprint milestone, OR
   - Changes status to `done` if work was finalized.
5. Saving updates the record, immediately decrementing the Overdue count on the Dashboard.

### 7.5 Workflow 5: Deleting a Project with Cascade Safety
1. User clicks the "Delete" action on a Project Card or Project Details Header.
2. A Confirmation Dialog appears displaying a warning:
   > *"Are you sure you want to delete 'Mobile App Redesign'? This will permanently delete the project and all 14 associated tasks. This action cannot be undone."*
3. User confirms by clicking "Delete Project".
4. Client dispatches `DELETE /api/projects/:id?cascade=true`.
5. Server initiates a deletion workflow:
   - Deletes all tasks matching `{ projectId: id }`.
   - Deletes the project document itself.
6. Server responds with `200 OK` `{ success: true, message: "Project and 14 associated tasks deleted." }`.
7. UI updates cache, removes project and child tasks from local state, and navigates to `/projects` with a success toast.

---

## 8. Out-of-Scope Features (Assessment Baseline)

The following capabilities are deliberately excluded from the initial assessment baseline to maintain architectural focus and delivery quality:
- **Real-Time Collaboration via WebSockets**: No Socket.io or peer-to-peer live cursor sync (polling and TanStack Query revalidation suffice).
- **Payment Processing & Subscriptions**: No Stripe, LemonSqueezy, or billing webhooks.
- **Email / SMS Notification Services**: No SendGrid, Nodemailer, or external SMS APIs.
- **Complex Multi-Tenant RBAC**: No organization switching, team permissions, or granular role policies (admin/editor/viewer) prior to Phase 12.
- **Binary File Storage / Cloud Uploads**: No AWS S3, Cloudinary, or multi-part attachment uploads (tasks support rich text descriptions and external URLs).
- **Internationalization (i18n)**: Single locale (English) during initial phases.

---

## 9. Requirements Traceability Matrix (RTM)

| Req ID | Requirement Description | UI Component | API Route | DB Model / Entity | Test Scenario | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-001** | Dashboard Workspace Overview | `DashboardPage`, `StatCard` | `GET /api/dashboard/summary` | `Project`, `Task` | Verify KPI aggregations match DB count | Planned |
| **FR-002** | Project Creation | `ProjectFormModal` | `POST /api/projects` | `Project` | Valid creation returns 201; invalid returns 400 | Planned |
| **FR-003** | Project Listing | `ProjectsPage`, `ProjectCard` | `GET /api/projects` | `Project` | Returns list with progress calculation | Planned |
| **FR-004** | Project Details View | `ProjectDetailsPage` | `GET /api/projects/:id` | `Project`, `Task` | Invalid ID returns 404; valid returns project + tasks | Planned |
| **FR-005** | Project Editing | `ProjectFormModal` | `PATCH /api/projects/:id` | `Project` | Partial updates persist correctly | Planned |
| **FR-006** | Project Deletion & Cascade | `ConfirmDialog` | `DELETE /api/projects/:id` | `Project`, `Task` | Verifies parent + child tasks deleted | Planned |
| **FR-007** | Task Creation within Project | `TaskFormModal` | `POST /api/tasks` | `Task`, `Project` | Reject invalid projectId; create task | Planned |
| **FR-008** | Task Listing & Kanban | `TaskTable`, `KanbanBoard` | `GET /api/tasks` | `Task` | Filters by status and project correctly | Planned |
| **FR-009** | Task Details View | `TaskDetailDrawer` | `GET /api/tasks/:id` | `Task` | Displays full metadata and parent project | Planned |
| **FR-010** | Task Editing | `TaskFormModal` | `PATCH /api/tasks/:id` | `Task` | Updates title, priority, assignee | Planned |
| **FR-011** | Status Lifecycle Transitions | `TaskStatusBadge`, `KanbanColumn` | `PATCH /api/tasks/:id` | `Task` | Transitioning to done sets completedAt | Planned |
| **FR-012** | Priority & Due Dates | `Badge`, `DatePicker` | `POST/PATCH /api/tasks` | `Task` | Validates enums; identifies overdue items | Planned |
| **FR-013** | Task Deletion | `ConfirmDialog` | `DELETE /api/tasks/:id` | `Task` | Deletes task document and recalculates progress | Planned |
| **FR-014** | Relational Integrity | Forms & Service Layer | All task endpoints | `Task.projectId` | Cannot create task with missing project | Planned |
| **FR-015** | Global & Scoped Search | `SearchInput` | Query params `?search=` | `Project`, `Task` | Case-insensitive substring matching | Planned |
| **FR-016** | Multi-Criteria Filtering | `FilterBar` | Query params `?status=&priority=` | `Task` | Filters combined with logical AND | Planned |
| **FR-017** | Sorting and Ordering | `TableSortHeader` | Query params `?sort=` | `Project`, `Task` | Sorts ascending and descending | Planned |
| **FR-018** | Pagination Controls | `PaginationControls` | Query params `?page=&limit=` | `Project`, `Task` | Boundary conditions respected | Planned |
| **FR-019** | Aggregated Dashboard KPIs | `StatCardGrid`, `ChartCard` | `GET /api/dashboard/summary` | Aggregation Pipeline | Accurate active, completed, overdue counts | Planned |
| **FR-020** | Progress Calculation | `ProgressBar` | Service & UI Helper | Computed Field | Clamped 0–100; handles 0 tasks gracefully | Planned |
| **FR-021** | Visual State Handling | `Skeleton`, `EmptyState`, `Toast` | UI Client Layer | N/A | Skeletons on fetch; toasts on mutate | Planned |
| **FR-022** | Responsive App Shell | `Sidebar`, `Topbar`, `AppShell` | Client Layout | N/A | Mobile drawer operable; focus trapped | Planned |
| **FR-023** | Validation & Error Handling | `FormError`, `ErrorBanner` | Express Error Middleware | Zod Schemas | Field-level error messages returned | Planned |
| **FR-024** | Auth & Tenant Isolation | `AuthModal`, Protected Routes | `/api/auth/*` | `User` | User A cannot access User B resources | Planned (Phase 12) |
