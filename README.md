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
```

## License
MIT
