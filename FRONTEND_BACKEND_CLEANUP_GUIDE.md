# Frontend Cleanup Guide

Use this short checklist to clean the Vite frontend and connect it to the Express backend.

## 1. Keep the two apps separate

- Keep the backend in [backend](backend).
- Keep the frontend in [frontend](frontend).
- Run them in separate terminals.

## 2. What to keep and what to delete

Keep these because they are part of the real frontend source:

- [frontend/src](frontend/src)
- [frontend/public](frontend/public)
- [frontend/index.html](frontend/index.html)
- [frontend/vite.config.ts](frontend/vite.config.ts)
- [frontend/package.json](frontend/package.json)
- [frontend/.env.example](frontend/.env.example)

Delete or ignore these because they are generated or not needed for editing:

- [frontend/dist](frontend/dist)
- `node_modules` if it was copied into the folder
- any extra export or temp folders

So yes: keep the source files, delete the unnecessary generated files.

## 3. Set the API URL

Create [frontend/.env](frontend/.env) from [frontend/.env.example](frontend/.env.example) and keep this value:

```bash
VITE_API_URL=http://localhost:5000/api
```

## 4. Connect frontend to backend

- Use [frontend/src/services/api.ts](frontend/src/services/api.ts) for all backend requests.
- Use [frontend/src/contexts/AuthContext.tsx](frontend/src/contexts/AuthContext.tsx) for login/logout.
- Keep page components focused on showing data and calling the service functions.

## 5. Build the backend routes to match

Right now the backend only has a health route in [backend/src/app.js](backend/src/app.js), so the frontend will not fully work yet.

The frontend expects routes like:

- `POST /api/auth/login`
- `GET /api/pavillion`
- `GET /api/pool`
- `GET /api/court`
- `GET /api/maintenance`

## 6. Work in this order

1. Make login work first.
2. Connect one page, like Dashboard.
3. Connect one CRUD section, like Pavillion.
4. Repeat for Pool, Court, and Maintenance.

## 7. Keep the code clean while learning

- Remove mock data after the real API works.
- Remove unused imports and unused files.
- Keep API calls in one place.
- Keep components small and simple.

## 8. Test it simply

1. Start the backend.
2. Check `/api/health`.
3. Start the frontend.
4. Try login.
5. Open one data page and confirm it loads from the backend.