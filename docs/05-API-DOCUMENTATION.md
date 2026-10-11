# REST API Documentation & Contract Specification
## SprintDesk — Project & Sprint Management Web Application

---

## 1. API Conventions and Architecture

SprintDesk provides a stateless, version-resilient RESTful HTTP API following standard JSON-over-HTTP design patterns.

### 1.1 Base Configuration & URL Structure
- **Base URL**: `http://localhost:5000/api`
- **Content Type**: `application/json` for all request bodies and responses.
- **Character Encoding**: `UTF-8`.
- **Resource Naming**: Pluralized, lower-case resource identifiers (e.g., `/projects`, `/tasks`).

### 1.2 Response Envelope Format
All API responses use a standard response envelope to simplify client deserialization:

#### Standard Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

#### Paginated Success Response
```json
{
  "success": true,
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  },
  "data": [ ... ]
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": [
      {
        "field": "title",
        "message": "Title must be at least 3 characters long."
      }
    ]
  }
}
```

### 1.3 HTTP Methods & Status Codes
- `GET`: Safe, idempotent read operations. Returns `200 OK`.
- `POST`: Create a new resource. Returns `201 Created`.
- `PATCH`: Apply partial modifications to a resource. Returns `200 OK`.
- `DELETE`: Remove a resource. Returns `200 OK` or `204 No Content`.
- `400 Bad Request`: Malformed payload, invalid ObjectId format, or Zod validation errors.
- `401 Unauthorized`: Missing or invalid authentication token (Phase 12).
- `403 Forbidden`: Authenticated user lacks permission to access target resource (Phase 12).
- `404 Not Found`: Target resource does not exist in the database.
- `409 Conflict`: Conflicting operation (e.g., trying to delete a project with child tasks without cascade flag).
- `429 Too Many Requests`: Rate limit threshold exceeded.
- `500 Internal Server Error`: Unhandled server exception.

### 1.4 Identifier Validation
All path parameters representing resource IDs (e.g., `:id`, `:projectId`) must conform to the 24-character hexadecimal MongoDB ObjectId standard. The `validateObjectId` middleware intercepts malformed identifiers prior to controller execution, returning `400 Bad Request`.

---

## 2. API Status Overview

| Endpoint | Method | Planned / Implemented | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Planned (Phase 1) | System health check and uptime |
| `/api/projects` | `GET` | Planned (Phase 4) | List projects with filtering and pagination |
| `/api/projects` | `POST` | Planned (Phase 4) | Create a new project |
| `/api/projects/:id` | `GET` | Planned (Phase 4) | Retrieve project details and progress |
| `/api/projects/:id` | `PATCH` | Planned (Phase 4) | Update project metadata |
| `/api/projects/:id` | `DELETE` | Planned (Phase 4) | Delete project (with cascade task cleanup) |
| `/api/tasks` | `GET` | Planned (Phase 5) | List tasks with multi-filtering and pagination |
| `/api/tasks` | `POST` | Planned (Phase 5) | Create a task linked to a project |
| `/api/tasks/:id` | `GET` | Planned (Phase 5) | Retrieve task details |
| `/api/tasks/:id` | `PATCH` | Planned (Phase 5) | Update task metadata or status |
| `/api/tasks/:id` | `DELETE` | Planned (Phase 5) | Delete a task document |
| `/api/dashboard/summary` | `GET` | Planned (Phase 9) | Aggregate workspace metrics and KPIs |

---

## 3. System Health Endpoint

### `GET /api/health`
- **Purpose**: Verifies that the Express API is running and operational.
- **Authentication**: None.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "status": "ok",
      "timestamp": "2026-10-12T02:00:00.000Z",
      "uptime": 128.45
    }
  }
  ```
- **Example Curl**:
  ```bash
  curl -X GET http://localhost:5000/api/health
  ```

---

## 4. Project Endpoints

### 4.1 `GET /api/projects`
- **Purpose**: Retrieve a paginated list of projects with completion progress percentages.
- **Authentication**: None (Phase 1–11) / Bearer token (Phase 12).
- **Query Parameters**:
  - `search` (string, optional): Case-insensitive match on `name` or `description`.
  - `status` (string, optional): Filter by `planned`, `active`, `completed`, `on_hold`.
  - `sort` (string, optional): Sort field (default `-createdAt`, supports `name`, `dueDate`).
  - `page` (number, optional, default `1`): Page number.
  - `limit` (number, optional, default `10`): Items per page (max `50`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "meta": {
      "total": 2,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    },
    "data": [
      {
        "_id": "670891a2e4b0123456789abc",
        "name": "Mobile App Redesign",
        "description": "Refactoring navigation and core screens",
        "status": "active",
        "color": "#6366F1",
        "startDate": "2026-10-01T00:00:00.000Z",
        "dueDate": "2026-11-15T00:00:00.000Z",
        "taskCount": 10,
        "completedTaskCount": 4,
        "progress": 40,
        "createdAt": "2026-10-10T14:00:00.000Z",
        "updatedAt": "2026-10-11T09:30:00.000Z"
      }
    ]
  }
  ```

---

### 4.2 `POST /api/projects`
- **Purpose**: Create a new project.
- **Request Body Schema**:
  ```json
  {
    "name": "Mobile App Redesign",
    "description": "Refactoring navigation and core screens",
    "status": "active",
    "color": "#6366F1",
    "startDate": "2026-10-01T00:00:00.000Z",
    "dueDate": "2026-11-15T00:00:00.000Z"
  }
  ```
- **Validation Rules**:
  - `name`: String, required, trimmed, min 3 chars, max 100 chars.
  - `description`: String, optional, max 500 chars.
  - `status`: Enum (`planned`, `active`, `completed`, `on_hold`), default `active`.
  - `color`: Hex color string, optional, default `#6366F1`.
  - `startDate`: Valid ISO 8601 date, optional.
  - `dueDate`: Valid ISO 8601 date, optional.
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "670891a2e4b0123456789abc",
      "name": "Mobile App Redesign",
      "description": "Refactoring navigation and core screens",
      "status": "active",
      "color": "#6366F1",
      "startDate": "2026-10-01T00:00:00.000Z",
      "dueDate": "2026-11-15T00:00:00.000Z",
      "progress": 0,
      "createdAt": "2026-10-12T02:00:00.000Z",
      "updatedAt": "2026-10-12T02:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Validation failure on name or dates.

---

### 4.3 `GET /api/projects/:id`
- **Purpose**: Retrieve complete details of a specific project, including aggregated task counts and progress.
- **Path Parameters**: `id` (24-char MongoDB ObjectId).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "670891a2e4b0123456789abc",
      "name": "Mobile App Redesign",
      "description": "Refactoring navigation and core screens",
      "status": "active",
      "color": "#6366F1",
      "startDate": "2026-10-01T00:00:00.000Z",
      "dueDate": "2026-11-15T00:00:00.000Z",
      "taskCount": 10,
      "completedTaskCount": 4,
      "progress": 40,
      "createdAt": "2026-10-10T14:00:00.000Z",
      "updatedAt": "2026-10-11T09:30:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Malformed ID parameter.
  - `404 Not Found`: Project does not exist.

---

### 4.4 `PATCH /api/projects/:id`
- **Purpose**: Partially update project fields.
- **Path Parameters**: `id` (24-char MongoDB ObjectId).
- **Request Body Schema**: Accepts any subset of project fields (`name`, `description`, `status`, `color`, `startDate`, `dueDate`).
- **Success Response (`200 OK`)**: Returns updated project document in standard envelope.
- **Error Responses**:
  - `400 Bad Request`: Validation error on provided fields.
  - `404 Not Found`: Project not found.

---

### 4.5 `DELETE /api/projects/:id`
- **Purpose**: Permanently delete a project and clean up all associated child tasks.
- **Path Parameters**: `id` (24-char MongoDB ObjectId).
- **Query Parameters**:
  - `cascade` (boolean, optional, default `true`): Explicit confirmation to delete child tasks.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Project and 10 associated tasks deleted successfully.",
    "data": {
      "deletedProjectId": "670891a2e4b0123456789abc",
      "deletedTasksCount": 10
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Project not found.

---

## 5. Task Endpoints

### 5.1 `GET /api/tasks`
- **Purpose**: Retrieve a paginated list of tasks matching filter criteria.
- **Query Parameters**:
  - `projectId` (string, optional): Filter by parent project ObjectId.
  - `status` (string, optional): Filter by `todo`, `in_progress`, `in_review`, `done`.
  - `priority` (string, optional): Filter by `low`, `medium`, `high`.
  - `search` (string, optional): Case-insensitive match on `title`, `description`, `assignee`.
  - `sort` (string, optional): Sort field (default `-createdAt`, supports `dueDate`, `priority`).
  - `page` (number, optional, default `1`).
  - `limit` (number, optional, default `10`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    },
    "data": [
      {
        "_id": "670895f3e4b0123456789def",
        "title": "Implement Bottom Navigation",
        "description": "Wire React Router routes with Lucide icons",
        "projectId": "670891a2e4b0123456789abc",
        "project": {
          "_id": "670891a2e4b0123456789abc",
          "name": "Mobile App Redesign",
          "color": "#6366F1"
        },
        "status": "in_progress",
        "priority": "high",
        "assignee": "Alex Doe",
        "labels": ["frontend", "ui"],
        "dueDate": "2026-10-20T00:00:00.000Z",
        "isOverdue": false,
        "completedAt": null,
        "createdAt": "2026-10-10T15:00:00.000Z",
        "updatedAt": "2026-10-11T10:00:00.000Z"
      }
    ]
  }
  ```

---

### 5.2 `POST /api/tasks`
- **Purpose**: Create a new task linked to an existing project.
- **Request Body Schema**:
  ```json
  {
    "title": "Implement Bottom Navigation",
    "description": "Wire React Router routes with Lucide icons",
    "projectId": "670891a2e4b0123456789abc",
    "status": "todo",
    "priority": "high",
    "assignee": "Alex Doe",
    "labels": ["frontend", "ui"],
    "dueDate": "2026-10-20T00:00:00.000Z"
  }
  ```
- **Validation Rules**:
  - `title`: String, required, trimmed, min 3 chars, max 150 chars.
  - `projectId`: Valid 24-char ObjectId, required (must exist in database).
  - `description`: String, optional, max 1000 chars.
  - `status`: Enum (`todo`, `in_progress`, `in_review`, `done`), default `todo`.
  - `priority`: Enum (`low`, `medium`, `high`), default `medium`.
  - `assignee`: String, optional, max 50 chars.
  - `labels`: Array of strings, optional.
  - `dueDate`: Valid ISO 8601 date, optional.
- **Success Response (`201 Created`)**: Returns created task document.
- **Error Responses**:
  - `400 Bad Request`: Validation failure.
  - `404 Not Found`: Referenced `projectId` does not exist.

---

### 5.3 `GET /api/tasks/:id`
- **Purpose**: Retrieve details of a single task document.
- **Path Parameters**: `id` (24-char MongoDB ObjectId).
- **Success Response (`200 OK`)**: Returns task document with populated project details.
- **Error Responses**:
  - `404 Not Found`: Task not found.

---

### 5.4 `PATCH /api/tasks/:id` (Unified Update & Status Transition)
- **Purpose**: Modify task metadata or advance status in the workflow.
- **Design Decision**: A unified `PATCH /api/tasks/:id` endpoint is used for both general field edits and status/priority changes. This avoids endpoint proliferation while providing atomic partial updates.
- **Lifecycle Logic**:
  - Transitioning status to `done` sets `completedAt = new Date()`.
  - Transitioning away from `done` resets `completedAt = null`.
- **Request Body Example (Status Transition)**:
  ```json
  {
    "status": "done"
  }
  ```
- **Success Response (`200 OK`)**: Returns updated task document with `completedAt` populated.
- **Error Responses**:
  - `400 Bad Request`: Invalid status or priority value.
  - `404 Not Found`: Task not found.

---

### 5.5 `DELETE /api/tasks/:id`
- **Purpose**: Remove a task document.
- **Path Parameters**: `id` (24-char MongoDB ObjectId).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully.",
    "data": {
      "deletedTaskId": "670895f3e4b0123456789def"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Task not found.

---

## 6. Dashboard Aggregation Endpoint

### `GET /api/dashboard/summary`
- **Purpose**: Deliver all high-level workspace metrics in a single round-trip.
- **Design Rationale**: A dedicated aggregation endpoint prevents multiple round-trips from the frontend and uses an optimized MongoDB aggregation pipeline.
- **Metric Definitions**:
  - `totalProjects`: Total number of projects.
  - `activeProjects`: Projects with status `active`.
  - `totalTasks`: Total number of tasks.
  - `completedTasks`: Tasks with status `done`.
  - `activeTasks`: Tasks with status in `['todo', 'in_progress', 'in_review']`.
  - `overdueTasks`: Tasks where `dueDate < new Date()` AND `status !== 'done'`.
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "metrics": {
        "totalProjects": 4,
        "activeProjects": 3,
        "totalTasks": 28,
        "completedTasks": 12,
        "activeTasks": 16,
        "overdueTasks": 3
      },
      "statusDistribution": {
        "todo": 6,
        "in_progress": 7,
        "in_review": 3,
        "done": 12
      },
      "priorityDistribution": {
        "low": 5,
        "medium": 15,
        "high": 8
      },
      "recentTasks": [
        {
          "_id": "670895f3e4b0123456789def",
          "title": "Implement Bottom Navigation",
          "projectName": "Mobile App Redesign",
          "status": "in_progress",
          "priority": "high",
          "dueDate": "2026-10-20T00:00:00.000Z"
        }
      ]
    }
  }
  ```

---

## 7. Error Catalogue

| Status Code | Error Code | Trigger Condition | Example Client Error Message |
| :--- | :--- | :--- | :--- |
| **`400`** | `VALIDATION_ERROR` | Request body fails Zod schema | `"Title must be between 3 and 150 characters."` |
| **`400`** | `INVALID_ID` | Path param is not a valid 24-char ObjectId | `"Invalid resource identifier format."` |
| **`401`** | `UNAUTHORIZED` | Missing or expired auth token (Phase 12) | `"Authentication required. Please sign in."` |
| **`403`** | `FORBIDDEN` | Accessing resource owned by another tenant (Phase 12) | `"You do not have permission to access this resource."` |
| **`404`** | `NOT_FOUND` | Project or Task ID not found in database | `"Project not found with the requested ID."` |
| **`409`** | `CONFLICT` | Deleting project with active tasks without cascade | `"Cannot delete project with active tasks. Pass cascade=true."` |
| **`429`** | `RATE_LIMIT_EXCEEDED` | Client exceeds 100 requests / 15 minutes | `"Too many requests. Please try again later."` |
| **`500`** | `INTERNAL_SERVER_ERROR`| Unhandled server exception | `"An unexpected error occurred. Please try again later."` |

---

## 8. API Testing Matrix

| Endpoint | Test Case Description | Input Data | Expected Status | Expected Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/health` | Health Check | None | `200 OK` | Returns `status: "ok"` |
| `POST /api/projects` | Valid Project Creation | Full valid project object | `201 Created` | Document persisted in DB |
| `POST /api/projects` | Missing Name | `{ "description": "..." }` | `400 Bad Request` | Zod field error for `name` |
| `GET /api/projects/:id` | Invalid ObjectId Format | `id = "invalid-id"` | `400 Bad Request` | Returns `INVALID_ID` error |
| `GET /api/projects/:id` | Non-Existent ID | `id = 24-char dummy hex` | `404 Not Found` | Returns `NOT_FOUND` error |
| `POST /api/tasks` | Missing Project ID | Valid task without `projectId` | `400 Bad Request` | Zod field error for `projectId` |
| `POST /api/tasks` | Non-Existent Project ID | Valid task with non-existent `projectId` | `404 Not Found` | Project referential check fails |
| `PATCH /api/tasks/:id` | Complete Task Status | `{ "status": "done" }` | `200 OK` | `completedAt` timestamp set |
| `PATCH /api/tasks/:id` | Invalid Status Value | `{ "status": "archived" }` | `400 Bad Request` | Enum validation fails |
| `DELETE /api/projects/:id` | Cascade Delete Project | `cascade = true` | `200 OK` | Deletes project and all child tasks |
| `GET /api/dashboard/summary`| Dashboard Aggregation | None | `200 OK` | Aggregates accurate metrics |
