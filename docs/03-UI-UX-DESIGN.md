# UI Design and UX Decisions Specification
## SprintDesk — Project & Sprint Management Web Application

---

## 1. Visual Direction & Design Principles

SprintDesk follows a modern, developer-centric, premium B2B SaaS visual design language. The approved design direction pairs a structured **Dark Navy Sidebar** with an open, high-readability **Light Slate Workspace**, unified by crisp **Indigo accents**, white card surfaces, subtle borders, and smooth micro-interactions.

```
+---------------------------------------------------------------------------------------+
|  SPRINTDESK APPLICATION SHELL                                                        |
+-------------------+-------------------------------------------------------------------+
|  DARK NAVY        |  TOPBAR: Breadcrumbs | Search | New Task Button | Workspace Profile  |
|  SIDEBAR          +-------------------------------------------------------------------+
|  #0F172A          |  LIGHT WORKSPACE CANVAS: #F8FAFC                                  |
|                   |                                                                   |
|  [Logo]           |  +--------------+  +--------------+  +--------------+             |
|  SprintDesk       |  |  StatCard 1  |  |  StatCard 2  |  |  StatCard 3  |             |
|                   |  +--------------+  +--------------+  +--------------+             |
|  Nav Items:       |                                                                   |
|  - Dashboard      |  +-------------------------------------------------------------+  |
|  - Projects       |  |  WHITE SURFACE CARDS (#FFFFFF)                              |  |
|  - Tasks          |  |  Project Grid / Kanban Board / Task Table                    |  |
|  - Analytics      |  |  Subtle borders (#E2E8F0) & soft shadows (shadow-sm)        |  |
|  - Settings       |  +-------------------------------------------------------------+  |
+-------------------+-------------------------------------------------------------------+
```

### 1.1 Core Principles
1. **Consistency**: Visual elements, tokens, iconography, and interaction patterns remain identical across all views.
2. **Clarity & Minimal Cognitive Load**: Key sprint metrics (progress, overdue tasks, priority) stand out without visual clutter.
3. **Immediate Operational Feedback**: Every action provides deterministic visual feedback (active loading spinners, optimistic state transitions, non-intrusive toast alerts).
4. **Predictable Navigation**: Persistent application shell with clear breadcrumbs and active route indicators prevents disorientation.
5. **Universal Accessibility**: Strict adherence to WCAG 2.1 AA contrast requirements, keyboard focus rings, and screen-reader semantics.

---

## 2. Design Tokens

### 2.1 Color Palette
The color tokens are structured into semantic categories to ensure cohesive styling across the application.

| Semantic Token | Hex Code | Tailwind Equivalent | Role & Context |
| :--- | :--- | :--- | :--- |
| **brand-primary** | `#6366F1` | `indigo-500` | Primary brand accent, primary CTA buttons, active route highlights |
| **brand-primary-hover** | `#4F46E5` | `indigo-600` | Hover state for primary buttons and interactive highlights |
| **brand-primary-light** | `#EEF2FF` | `indigo-50` | Active tab background, selected pill background, subtle badges |
| **sidebar-bg** | `#0F172A` | `slate-900` | Persistent sidebar background (dark navy aesthetic) |
| **sidebar-surface** | `#1E293B` | `slate-800` | Sidebar hover items, active sidebar link container |
| **sidebar-text** | `#94A3B8` | `slate-400` | Inactive sidebar menu labels and icons |
| **sidebar-text-active**| `#FFFFFF` | `white` | Active sidebar menu label and selected icon |
| **workspace-bg** | `#F8FAFC` | `slate-50` | Primary application canvas background |
| **surface-card** | `#FFFFFF` | `white` | Cards, tables, modals, dialog surfaces |
| **text-primary** | `#0F172A` | `slate-900` | Primary headings, table text, high-emphasis copy |
| **text-secondary** | `#64748B` | `slate-500` | Subheadings, metadata labels, placeholder text |
| **border-subtle** | `#E2E8F0` | `slate-200` | Card borders, table dividers, input borders |
| **border-focus** | `#6366F1` | `indigo-500` | 2px accessible focus ring on interactive inputs |

### 2.2 Status & Priority Color Tokens

| Entity | Value | Badge Background | Badge Text | Badge Border | Visual Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Task Status** | `todo` | `#F1F5F9` (`slate-100`) | `#475569` (`slate-600`) | `#CBD5E1` (`slate-300`) | Backlog / Unstarted work |
| **Task Status** | `in_progress` | `#EFF6FF` (`blue-50`) | `#1D4ED8` (`blue-700`) | `#BFDBFE` (`blue-200`) | Actively underway |
| **Task Status** | `in_review` | `#FEF3C7` (`amber-50`) | `#B45309` (`amber-700`) | `#FDE68A` (`amber-200`) | Pending review or QA testing |
| **Task Status** | `done` | `#ECFDF5` (`emerald-50`) | `#047857` (`emerald-700`)| `#A7F3D0` (`emerald-200`)| Finalized & accepted |
| **Priority** | `low` | `#F8FAFC` (`slate-50`) | `#64748B` (`slate-500`) | `#E2E8F0` (`slate-200`) | Low operational urgency |
| **Priority** | `medium` | `#EFF6FF` (`blue-50`) | `#2563EB` (`blue-600`) | `#BFDBFE` (`blue-200`) | Standard sprint priority |
| **Priority** | `high` | `#FEF2F2` (`red-50`) | `#DC2626` (`red-600`) | `#FECACA` (`red-200`) | Critical path / Urgent blocker |
| **Due Date** | Overdue | `#FEF2F2` (`red-50`) | `#B91C1C` (`red-700`) | `#FCA5A5` (`red-300`) | Deadline exceeded |

### 2.3 Typography Scale
SprintDesk uses system sans-serif font fallbacks (`Inter`, `system-ui`, `-apple-system`, `sans-serif`) for optimal cross-platform legibility.

| Level | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1 (`h1`)** | `28px` (`1.75rem`) | `700` (Bold) | `36px` (`2.25rem`) | Page titles (Dashboard, Projects, Tasks) |
| **Heading 2 (`h2`)** | `20px` (`1.25rem`) | `600` (Semibold) | `28px` (`1.75rem`) | Section titles, modal headers |
| **Heading 3 (`h3`)** | `16px` (`1.0rem`) | `600` (Semibold) | `24px` (`1.5rem`) | Card headers, table group labels |
| **Body (`p`, `span`)**| `14px` (`0.875rem`)| `400` (Regular) | `20px` (`1.25rem`) | Standard UI copy, table cells |
| **Body Semibold** | `14px` (`0.875rem`)| `600` (Semibold) | `20px` (`1.25rem`) | Interactive button labels, active tab text |
| **Caption / Badge** | `12px` (`0.75rem`) | `500` (Medium) | `16px` (`1.0rem`) | Status badges, timestamps, helper copy |

### 2.4 Spacing, Radii, Shadows, and Breakpoints
- **Spacing**: 4px scale (`p-1` = 4px, `p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
- **Border Radii**: Cards and modals use `rounded-xl` (12px); buttons, badges, and form controls use `rounded-lg` (8px); circular avatars use `rounded-full`.
- **Shadows**: Cards use `shadow-sm` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`); floating modals and dropdowns use `shadow-lg` (`0 10px 15px -3px rgb(0 0 0 / 0.1)`).
- **Breakpoints**: Mobile (`sm: 640px`), Tablet (`md: 768px`), Desktop (`lg: 1024px`), Wide Desktop (`xl: 1280px`, `2xl: 1536px`).

---

## 3. Application Shell

### 3.1 Sidebar (Navigation Drawer)
- **Width**: `260px` fixed width on desktop viewports ($\ge 1024\text{px}$).
- **Background**: Dark Navy (`#0F172A`).
- **Brand Header**: SprintDesk logo mark (Indigo lightning/sprint glyph) with white bold brand title.
- **Navigation Links**:
  - `Dashboard` (Icon: `LayoutDashboard`, route: `/`)
  - `Projects` (Icon: `FolderGit2`, route: `/projects`)
  - `Tasks` (Icon: `CheckSquare`, route: `/tasks`)
  - `Analytics` (Icon: `BarChart3`, route: `/analytics` - placeholder)
  - `Settings` (Icon: `Settings`, route: `/settings` - placeholder)
- **Active State**: White text, `#1E293B` background container, with a 3px Indigo vertical accent bar on the left edge.
- **Mobile Behavior**: Collapses completely on screens $< 1024\text{px}$. Replaced by an accessible off-canvas drawer toggled via the Topbar hamburger button.

### 3.2 Topbar
- **Height**: `64px` fixed height, sticky at the top of the viewport (`sticky top-0 z-20`).
- **Background**: White (`#FFFFFF`) with subtle bottom border (`border-b border-slate-200`).
- **Left**: Mobile hamburger button (`< 1024px`) and Breadcrumb path (e.g., `Projects / Mobile App Redesign`).
- **Center**: Global Search Input (`320px` width) with search icon and keyboard shortcut badge (`Ctrl + K`).
- **Right**:
  - Quick Action Button: `+ New Task` (Indigo CTA).
  - Notification Bell icon with active unread badge.
  - Workspace Avatar & Dropdown (`StartupMeu Workspace`).

---

## 4. Page Specifications

### 4.1 Page 1: Dashboard (`/` or `/dashboard`)
- **Purpose**: High-level workspace overview aggregating sprint metrics, project velocity, and recent task activity.
- **Layout**:
  - Top: 4 StatCards across a responsive grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`).
  - Middle: Two-column split (`lg:grid-cols-3`): Left 2/3 shows Project Progress & Task Status Chart; Right 1/3 shows Overdue Task alerts.
  - Bottom: Recent Activity & Tasks Table.
- **Components**: `StatCard`, `TaskStatusDistributionChart` (Recharts), `OverdueAlertCard`, `RecentTasksTable`.
- **States**:
  - *Loading*: 4 skeleton stat cards + 2 skeleton chart blocks.
  - *Empty*: Prompt: "Welcome to SprintDesk! Create your first project to view workspace velocity."
  - *Error*: Centered error card with retry button.

### 4.2 Page 2: Projects List (`/projects`)
- **Purpose**: Catalog and monitor all projects with progress indicators and management actions.
- **Layout**:
  - Header: Title, Search bar, Status filter dropdown, "New Project" button.
  - Body: Responsive grid of Project Cards (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`).
  - Footer: Pagination controls.
- **Components**: `ProjectCard`, `ProjectFormModal`, `FilterBar`, `SearchInput`, `EmptyState`.
- **States**:
  - *Loading*: 6 pulsing card skeletons.
  - *Empty*: Illustrated card with "No projects found" copy and "Create Project" button.
  - *Error*: Red banner with error message and "Reload Projects" action.

### 4.3 Page 3: Project Details (`/projects/:id`)
- **Purpose**: Deep-dive into a single project, its completion rate, milestones, and associated tasks.
- **Layout**:
  - Header: Project accent color bar, project name, status badge, dates, progress percentage bar, Edit and Delete buttons.
  - Tabs: "Tasks" (default), "Board / Kanban", "Overview".
  - Body: Tab-dependent view containing project-scoped tasks with an "Add Task" CTA button.
- **Components**: `ProjectHeader`, `ProgressBar`, `TaskTable`, `KanbanBoard`, `TaskFormModal`.
- **States**:
  - *Loading*: Header skeleton + table row skeletons.
  - *Empty*: "No tasks in this project yet. Add your first task above."
  - *Error*: 404 error page if ID is invalid, with "Back to Projects" button.

### 4.4 Page 4: Global Task Management (`/tasks`)
- **Purpose**: Comprehensive view of all tasks across projects with sorting, multi-filtering, and board switching.
- **Layout**:
  - Header: View toggle buttons (Table View vs. Kanban Board View), Search, Project Filter, Status Filter, Priority Filter, "New Task" button.
  - Body: Task Table OR Kanban 4-column Board (`todo`, `in_progress`, `in_review`, `done`).
- **Components**: `TaskTable`, `KanbanBoard`, `TaskCard`, `FilterBar`, `PaginationControls`.
- **States**:
  - *Loading*: Shimmer table rows or column skeletons.
  - *Empty*: "No tasks match your filter criteria. Reset filters."

### 4.5 Modals: Task & Project Form Modals
- **Task Creation / Edit Modal**:
  - Fields: Title (text), Project (select), Description (textarea), Priority (segmented pill select), Status (select), Assignee (text), Due Date (date picker).
  - Validation: Inline error messages below input fields in red text.
  - Actions: Secondary "Cancel" button, Primary "Save Task" / "Create Task" button with loading spinner when submitting.
- **Project Creation / Edit Modal**:
  - Fields: Project Name (text), Description (textarea), Status (select), Accent Color (preset color circles), Start Date & Due Date.
  - Actions: "Cancel" and "Save Project" buttons.

---

## 5. Reusable Component Specifications

| Component Name | Status | Purpose & Role | Key Props |
| :--- | :--- | :--- | :--- |
| **`Sidebar`** | Planned | Persistent navigation drawer | `isOpen`, `onClose` |
| **`Topbar`** | Planned | Header with search and quick actions | `onMenuToggle`, `onNewTaskClick` |
| **`StatCard`** | Planned | Displays single KPI metric with icon and change indicator | `title`, `value`, `icon`, `trend`, `colorVariant` |
| **`ProjectCard`** | Planned | Summary card for a project in the projects grid | `project`, `onEdit`, `onDelete` |
| **`ProgressBar`** | Planned | Visual 0–100% completion bar | `progress`, `color`, `showLabel`, `size` |
| **`TaskTable`** | Planned | Data table displaying tasks with sortable headers | `tasks`, `onStatusChange`, `onEdit`, `onDelete` |
| **`KanbanBoard`** | Planned | 4-column board for visual task lifecycle management | `tasks`, `onTaskMove`, `onTaskClick` |
| **`TaskCard`** | Planned | Card item used inside Kanban board columns | `task`, `onEdit`, `onDelete` |
| **`Badge`** | Planned | Status, priority, and metadata badge pill | `variant`, `children`, `size` |
| **`Modal`** | Planned | Accessible dialog overlay with backdrop and focus trap | `isOpen`, `onClose`, `title`, `children` |
| **`ConfirmDialog`** | Planned | Destructive action confirmation dialog | `isOpen`, `onConfirm`, `onCancel`, `title`, `message` |
| **`Toast`** | Planned | Ephemeral notification banner | `type` (`success`/`error`/`info`), `message`, `onClose` |
| **`Skeleton`** | Planned | Content placeholder animation | `variant` (`card`/`row`/`text`), `count` |
| **`EmptyState`** | Planned | Empty data illustration with call-to-action button | `title`, `description`, `icon`, `actionLabel`, `onAction` |

---

## 6. Interaction Specifications

1. **Destructive Actions**: Deleting a project or task must always open a `ConfirmDialog`. The confirmation button must be styled with a red destructive variant (`bg-red-600 hover:bg-red-700`).
2. **Form Submissions**: When a form is submitted, the submit button is disabled and displays a spinning indicator to prevent duplicate submissions.
3. **Optimistic Updates**: Task status transitions update the client UI immediately. If the server rejects the update, the UI reverts to the previous status and shows an error toast.
4. **Debounced Search**: Search inputs debounce keyboard events by $300\text{ms}$ to eliminate unnecessary network requests.
5. **Keyboard Shortcuts**:
   - `Escape`: Closes open modals, drawers, and confirmation dialogs.
   - `Enter`: Submits active forms.
   - `Tab`: Navigates through interactive controls sequentially.

---

## 7. Accessibility (a11y) Standards

- **Semantic HTML**: Utilize `<nav>`, `<main>`, `<header>`, `<section>`, `<table>`, and `<button>` elements.
- **Color Contrast**: All text elements adhere to WCAG 2.1 AA ratios ($\ge 4.5:1$ against their respective backgrounds).
- **Focus Rings**: All interactive elements display a visible $2\text{px}$ Indigo focus ring (`focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`).
- **Screen Reader Support**:
  - Modal components include `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
  - Progress bars include `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
  - Icon-only buttons include `aria-label` attributes (e.g., `aria-label="Delete project"`).

---

## 8. UX Decisions and Rationale

| UX Decision | Alternative Considered | Selected Rationale | Trade-offs | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Dark Navy Sidebar + Light Workspace** | All-dark mode or All-light mode | Provides visual anchor and high contrast while maximizing data readability on dense tables and cards. | Requires managing two distinct color token sets. | Approved |
| **Modal Form for Task Creation** | Inline editable table row | Modals allow rich descriptions, project selectors, and due dates without breaking table layout. | Slight interruption to page context; mitigated by fast load times. | Approved |
| **Dual View: Table & Kanban** | Table only or Kanban only | Developers prefer Kanban boards for quick status transitions; managers prefer tables for dense sorting and scanning. | Additional UI components to maintain; shared state keeps logic synchronized. | Approved |
| **Toast Notifications for Feedback** | In-page static alert banners | Toasts provide clear success confirmation without shifting page layout or requiring manual dismissal. | Can be missed if auto-dismiss is too quick; set to $3.5\text{s}$ with hover pause. | Approved |
| **Single-Page Application Shell** | Multi-page traditional routing | Instant page transitions with cached data via TanStack Query; no white-screen flashes. | Initial JS bundle must be kept small ($< 150\text{kB}$). | Approved |
