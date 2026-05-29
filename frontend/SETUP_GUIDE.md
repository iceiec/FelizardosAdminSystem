# Express Backend Integration Guide

This guide will help you connect your React frontend to your Express backend.

## Step 1: Verify Backend Requirements

Ensure your Express backend has these endpoints ready:

### 1. Authentication Endpoint

```javascript
POST /api/auth/login
Request Body: { email, password }
Response: { token, user: { id, email, name } }
```

### 2. CRUD Endpoints for Each Module

Each module needs these 5 endpoints:

```
GET    /api/{module}           - Get all records
GET    /api/{module}/:id       - Get single record
POST   /api/{module}           - Create record
PUT    /api/{module}/:id       - Update record
DELETE /api/{module}/:id       - Delete record
```

Where `{module}` is: `pavilion`, `pool`, `court`, or `maintenance`

## Step 2: Configure Frontend

### 2.1 Set Environment Variables

Create a `.env` file in the project root:

```bash
VITE_API_URL=http://localhost:5000/api
```

If your backend runs on a different port or domain, update accordingly.

### 2.2 Handle CORS in Express Backend

If your frontend and backend run on different ports (common in development), add CORS:

```javascript
// In your Express app
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3001', // Your frontend URL
  credentials: true
}));
```

## Step 3: Replace Mock Login with Real Login

Edit `src/contexts/AuthContext.tsx`:

```typescript
// Change from:
// Simulate API call
await new Promise((resolve) => setTimeout(resolve, 500))
const mockUser = { ... }

// To:
// Call your real API
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
const data = await response.json()
```

## Step 4: Use Real API Calls in Pages

For each page component, replace mock data with API calls:

### Pavilion Page Example

**Before (src/pages/PavilionManagementPage.tsx):**

```typescript
import { mockPavilionData } from '@/services/mockData'

// In useEffect:
const data = mockPavilionData
setPavilion(data)
```

**After:**

```typescript
import { pavilionAPI } from '@/services/api'

// In useEffect:
const data = await pavilionAPI.getAll()
setPavilion(data)
```

### Do this for all pages:
-- `src/pages/PavilionManagementPage.tsx` - Replace with `pavilionAPI`
- `src/pages/PoolManagementPage.tsx` - Replace with `poolAPI`
- `src/pages/CourtManagementPage.tsx` - Replace with `courtAPI`
- `src/pages/MaintenancePage.tsx` - Replace with `maintenanceAPI`

## Step 5: Test Integration

### 5.1 Start Both Services

Terminal 1 - Express backend:
```bash
npm start  # or your backend start command
```

Terminal 2 - React frontend:
```bash
pnpm dev
```

### 5.2 Test Login

1. Go to http://localhost:3001
2. Try logging in with your test credentials
3. Check browser DevTools Network tab to verify API calls

### 5.3 Test Data Loading

1. After login, navigate to each module (Pavilion, Pool, Court, Maintenance)
2. Verify data loads from your backend
3. Check Network tab to confirm API endpoints are being called

## Step 6: Handle Errors Gracefully

The API service includes error handling. To customize error messages:

**src/services/api.ts** - Update error messages:

```typescript
if (!response.ok) {
  const error = await response.json()
  throw new Error(error.message || 'API request failed')
}
```

## Step 7: Add Form Validation and Submission

Create modal/form for adding/editing records:

```typescript
const handleCreate = async (formData) => {
  try {
    const result = await pavilionAPI.create(formData)
    setPavilion([...pavilion, result])
    toast.success('Created successfully!')
  } catch (error) {
    toast.error(error.message)
  }
}
```

## Common Issues

### 1. CORS Errors
- **Error**: "Access to XMLHttpRequest... blocked by CORS policy"
- **Solution**: Add CORS middleware to Express backend

### 2. 401 Unauthorized
- **Error**: "401 Unauthorized" on API calls after login
- **Solution**: Verify token is being sent in Authorization header
  - Check `getAuthHeaders()` function in `src/services/api.ts`
  - Ensure token is stored in localStorage after login

### 3. API URL Not Found
- **Error**: "Failed to fetch from /api/..."
- **Solution**: 
  - Check `VITE_API_URL` in `.env` file
  - Ensure backend is running on specified port
  - Verify Express routes match expected endpoints

### 4. Network Errors
- **Error**: "NetworkError: Failed to fetch"
- **Solution**:
  - Verify backend is running
  - Check if port is correct
  - Try adding `--host 0.0.0.0` to Vite if using Docker/VM

## Advanced: Using Refresh Token for Session Management

For better security, implement refresh tokens:

```typescript
// Store both access and refresh tokens
localStorage.setItem('access_token', data.accessToken)
localStorage.setItem('refresh_token', data.refreshToken)

// Implement token refresh logic when token expires
```

## Database Schema Requirements

Ensure your Express backend database has these tables:

### Pavilion Table
- id (primary key)
- name (string)
- capacity (number)
- location (string)
- status (string)
- events (number)
- lastEvent (date)

### Pool Table
- id (primary key)
- name (string)
- size (string)
- depth (string)
- capacity (number)
- status (string)
- temperature (number)
- lastCleaned (date)

### Court Table
- id (primary key)
- name (string)
- surface (string)
- status (string)
- nextBooking (datetime)

### Maintenance Table
- id (primary key)
- title (string)
- location (string)
- priority (string)
- status (string)
- assignee (string)
- dueDate (date)

## Next Steps

1. Implement the required API endpoints in your Express backend
2. Test each endpoint with Postman or similar tool
3. Follow the integration steps above
4. Deploy to production when ready

## Support Resources

- React Router: https://reactrouter.com/
- Vite: https://vitejs.dev/
- API Service Examples: `src/services/api.ts`
- Mock Data Reference: `src/services/mockData.ts`
