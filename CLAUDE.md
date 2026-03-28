# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

| Area | Command | Description |
|------|---------|-------------|
| **Frontend (React + Vite)** | `cd frontend && npm install` | Install JavaScript dependencies. |
| | `npm run dev` | Start the Vite development server (http://localhost:5173). The Vite config proxies `/api/*` requests to the backend at `http://localhost:4000`. |
| | `npm run build` | Produce a production‑ready static bundle in `frontend/dist`. |
| | `npm run preview` | Serve the built bundle locally for a quick production preview. |

## Docker

- Build and run both services:
```bash
docker compose up --build
```
- Backend runs on port 4000 (`http://localhost:4000/api/todos`).
- Frontend is served by Nginx on port 5173 (`http://localhost:5173`).

Make sure Docker is installed and the repository contains `docker-compose.yml`, `backend/Dockerfile`, and `frontend/Dockerfile`.

| **Backend (Node HTTP server)** | `node backend/server.js` | Launch the backend API server on the port defined by `PORT` (default 4000). |
| **Tests** | `npm i -D jest supertest` *(run once in the repository root or in `backend` if you prefer a separate `package.json`)* | Install the test runner and HTTP‑request helper. |
| | `npx jest backend/tests/api.test.js` | Execute the API test suite. Use `npx jest` with a path pattern to run a specific test file. |
| **Single Test** | `npx jest backend/tests/api.test.js -t "POST /api/todos creates a todo"` | Run only the test whose description matches the given string (replace with any test name you need). |

> **Note:** The repo does not currently include a root `package.json` or scripts for the backend. The commands above assume you run the backend directly with Node and install test tools manually.

## High‑Level Architecture Overview

```
+-------------------+          HTTP API          +-------------------+
|   Frontend (Vite) |  <--- /api/...  --->  |   Backend (Node) |
|   React app       |  (proxy via vite.config) |   http server   |
+-------------------+                           |
        |                                         |
        | uses                                   | uses
        v                                         v
+-------------------+                    +-------------------+
|  src/api.js       |  fetch /api/todos  |  backend/models/ |
|  (fetch wrappers) | -----------------> |  todo.js (in‑mem) |
+-------------------+                    +-------------------+

```

* **Backend** (`backend/`):
  * `server.js` – a plain Node `http` server exposing a REST API under `/api/todos`. Handles CORS, parses JSON bodies, and delegates CRUD operations to the `todo` model.
  * `models/todo.js` – simple in‑memory store (`todos` array) with helper functions: `getAll`, `create`, `find`, `update`, `remove`. No persistence; data is lost on server restart.
  * **Tests** (`backend/tests/api.test.js`) use `supertest` to exercise the full HTTP lifecycle (POST, GET, PUT, DELETE).

* **Frontend** (`frontend/`):
  * Built with **React 18** and **Vite** (see `package.json` scripts). The Vite dev server proxies any request to `/api/*` to the backend (`localhost:4000`), allowing the frontend to call the API without CORS issues.
  * `src/main.jsx` – entry point that mounts `<App />`.
  * `src/App.jsx` – main component managing global state (`todos`, edit modal, error handling). Fetches the todo list on mount, provides handlers for add, update, delete, and reorder actions.
  * `src/api.js` – thin wrapper around `fetch` that throws on non‑2xx responses and returns parsed JSON. Exposes `fetchTodos`, `createTodo`, `updateTodo`, `deleteTodo`.
  * UI components:
    * `TodoForm` – input fields for creating a new todo.
    * `TodoList` – renders a list of `TodoItem`s, implements drag‑and‑drop reordering (holds a timer to distinguish tap from drag).
    * `TodoItem` – displays a single todo with Edit/Delete buttons; visual drag classes applied during reordering.
    * `EditTodoModal` – modal dialog for editing an existing todo; closes on Escape or outside click (unless a save is in progress).
  * Styling is assumed to be provided via a CSS file (`index.css`) imported in `main.jsx`.

* **Development Workflow**:
  1. Install frontend deps (`npm install` in `frontend`).
  2. Start the backend (`node backend/server.js`).
  3. Run the Vite dev server (`npm run dev`); the app will be reachable at `http://localhost:5173` and will automatically proxy API calls.
  4. Run the test suite with Jest (`npx jest …`) to verify backend behavior.

* **Key Design Decisions**:
  * **In‑memory data store** – suitable for a demo / learning project, but not for production. Swapping to a persistent DB would involve replacing `models/todo.js` with a proper data‑access layer.
  * **Separate server processes** – frontend and backend run independently; Vite’s proxy removes the need for CORS configuration in production if a reverse proxy is used.
  * **Drag‑and‑drop** implementation uses native HTML5 drag events with a “hold‑to‑drag” timer to avoid accidental reordering on touch devices.

---

Feel free to adjust scripts or add a root `package.json` if you want unified npm commands for both frontend and backend. The above information gives Claude Code the context needed to navigate, build, run, and test this repository efficiently.