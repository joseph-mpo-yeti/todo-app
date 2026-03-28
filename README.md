# Todo App

A minimal full‑stack Todo application demonstrating a simple Node.js HTTP backend with an in‑memory data store and a React 18 + Vite frontend.

## Features
- Create, read, update, delete Todo items via a REST API.
- Drag‑and‑drop reordering in the UI.
- Live reload during development (Vite dev server proxies `/api/*` to the backend).

## Getting Started
```bash
# Install frontend dependencies
cd frontend && npm install

# Start the backend (default port 4000)
node ../backend/server.js

# In another terminal, run the Vite dev server
npm run dev
```

Open http://localhost:5173 in your browser. The app will communicate with the backend at http://localhost:4000.

## Running Tests
```bash
npm i -D jest supertest   # install test deps (if not already installed)
npx jest backend/tests/api.test.js
```

## Build
```bash
npm run build   # creates a production bundle in frontend/dist

## Docker

The application can be containerized with Docker. Build and run both services using:
```bash
docker compose up --build
```
- Backend runs on port 4000 (`http://localhost:4000/api/todos`).
- Frontend is served by Nginx on port 5173 (`http://localhost:5173`).

Make sure Docker is installed and the current directory contains `docker-compose.yml`, `backend/Dockerfile`, and `frontend/Dockerfile`.

```

## License
MIT
