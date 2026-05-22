# Facility Management Dashboard - React + Vite Frontend

A modern React + Vite frontend for managing Pavilion, Pool, Court, and Maintenance operations.

## Features

- **Pavillion Management** - Track events, dates, and client information
- **Pool Management** - Manage pool bookings and maintenance schedules
- **Court Management** - Schedule basketball court bookings with weekly calendar view
- **Maintenance Tracking** - Manage repairs and maintenance activities
- **User Authentication** - Secure login system
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **TypeScript** - Type safety
- **Recharts** - Data visualization

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Create .env file (copy from .env.example)
cp .env.example .env
```

### Development

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3001
```

### Build for Production

```bash
pnpm build
pnpm start
```

## API Integration

The frontend is ready to connect to your Express backend. Here's how to set it up:

### 1. Configure API URL

Update `.env` file with your Express backend URL:

```
VITE_API_URL=http://localhost:5000/api
```

### 2. Update Auth Context

Modify `src/contexts/AuthContext.tsx` to call your actual login endpoint instead of the mock login.

### 3. Replace Mock Data

The app currently uses mock data for testing. To use real data from your backend:

1. In each page component (`PavillionManagementPage`, `PoolManagementPage`, etc.)
2. Replace the mock API calls with actual API calls using `src/services/api.ts`

Example:

```typescript
// Before (mock data)
import { mockPavillionData } from '@/services/mockData'
const data = mockPavillionData

// After (real API)
import { pavillionAPI } from '@/services/api'
const data = await pavillionAPI.getAll()
```

### 4. API Endpoints Expected

Your Express backend should implement these endpoints:

**Authentication**
- `POST /api/auth/login` - Login endpoint

**Pavillion**
- `GET /api/pavillion` - Get all pavilions
- `GET /api/pavillion/:id` - Get single pavilion
- `POST /api/pavillion` - Create pavilion
- `PUT /api/pavillion/:id` - Update pavilion
- `DELETE /api/pavillion/:id` - Delete pavilion

**Pool**
- `GET /api/pool` - Get all pools
- `GET /api/pool/:id` - Get single pool
- `POST /api/pool` - Create pool
- `PUT /api/pool/:id` - Update pool
- `DELETE /api/pool/:id` - Delete pool

**Court**
- `GET /api/court` - Get all courts
- `GET /api/court/:id` - Get single court
- `POST /api/court` - Create court
- `PUT /api/court/:id` - Update court
- `DELETE /api/court/:id` - Delete court

**Maintenance**
- `GET /api/maintenance` - Get all maintenance tasks
- `GET /api/maintenance/:id` - Get single maintenance task
- `POST /api/maintenance` - Create maintenance task
- `PUT /api/maintenance/:id` - Update maintenance task
- `DELETE /api/maintenance/:id` - Delete maintenance task

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx              # Main layout with sidebar
│   └── ui/                     # shadcn UI components
├── contexts/
│   └── AuthContext.tsx         # Authentication state management
├── pages/
│   ├── LoginPage.tsx           # Login page
│   ├── DashboardPage.tsx       # Main dashboard
│   ├── PavillionManagementPage.tsx
│   ├── PoolManagementPage.tsx
│   ├── CourtManagementPage.tsx
│   └── MaintenancePage.tsx
├── services/
│   ├── api.ts                  # Real API calls
│   └── mockData.ts             # Mock data for testing
├── App.tsx                     # Main app component with routing
├── main.tsx                    # Entry point
└── globals.css                 # Global styles
```

## Authentication Flow

1. User enters email and password on login page
2. Frontend calls `/api/auth/login` endpoint
3. Backend returns token and user info
4. Frontend stores token in localStorage
5. Token is included in Authorization header for all API requests

## Testing with Mock Data

The app includes mock data so you can test the UI without a backend. To use mock data:

1. The app uses mock data by default in development
2. Once you set up the API endpoints, simply replace the mock calls with API calls

## Building for Deployment

```bash
# Build the production bundle
pnpm build

# Preview the production build locally
pnpm start
```

The built app will be in the `dist/` directory.

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_API_URL` - Your Express backend API URL (default: http://localhost:5000/api)

## Support

For issues or questions about integrating with your Express backend, check:
- `src/services/api.ts` for API request examples
- `src/contexts/AuthContext.tsx` for authentication patterns
- Individual page components for CRUD examples
