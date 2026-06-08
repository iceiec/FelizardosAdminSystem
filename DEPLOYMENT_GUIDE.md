# Deployment Guide: Supabase + Vercel

This guide covers deploying the Felizardo Admin System to production using Supabase for PostgreSQL and Vercel for the frontend.

## Table of Contents
1. [Supabase Setup & Database Migration](#supabase-setup--database-migration)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment to Vercel](#frontend-deployment-to-vercel)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment Verification](#post-deployment-verification)

---

## Supabase Setup & Database Migration

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `felizardo-admin`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `ap-southeast-1` for Asia)
4. Click **"Create new project"** and wait for provisioning (~2 min)

### Step 2: Get Supabase Connection Details

1. In Supabase dashboard, go to **Settings > Database**
2. Copy the connection string:
   - **URI format**: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
   - Example: `postgresql://postgres:mypassword@db.xxx.supabase.co:5432/postgres`

3. Also get these for .env later:
   - **Host**: `db.xxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: Your created password

### Step 3: Migrate PostgreSQL Database

#### Option A: Using pgdump (Recommended)

1. **Dump current database**:
   ```bash
   # From your machine (if local PostgreSQL running)
   pg_dump -h localhost -U postgres -d felizardo > backup.sql
   # Enter password when prompted
   ```

2. **Upload to Supabase**:
   ```bash
   # Connect to Supabase and import schema/data
   psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < backup.sql
   ```

#### Option B: Using Supabase Migration Tools (Simpler)

1. In Supabase dashboard, go to **Migrate** (sidebar)
2. Paste your local connection string:
   ```
   postgresql://postgres:[LOCAL_PASSWORD]@localhost:5432/felizardo
   ```
3. Click **"Start Migration"** and wait for completion

#### Option C: Manual Migration (Run migrations on Supabase)

1. Connect to Supabase PostgreSQL:
   ```bash
   psql postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```

2. Run each migration file sequentially:
   ```bash
   \i backend/db/migrations/20260530_create_core_facility_tables.sql
   \i backend/db/migrations/20260531_create_pool_court_booking_tables.sql
   \i backend/db/migrations/20260529_add_booking_fields_pavilion_bookings.sql
   \i backend/db/migrations/20260529_add_client_fields_pavilion_bookings.sql
   \i backend/db/migrations/20260531_fix_users_updated_at.sql
   \i backend/db/migrations/20260531_seed_demo_facility_data.sql
   ```

3. Verify tables created:
   ```bash
   \dt
   ```

---

## Backend Deployment

**Note**: Vercel doesn't support long-running Node servers. Use one of these instead:

### Option 1: Render (Recommended for simplicity)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `felizardo-backend`
   - **Environment**: `Node`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
5. Add environment variables (see [Environment Variables](#environment-variables) section):
   - `DATABASE_URL`: Your Supabase connection string
   - `JWT_SECRET`: Strong random string (generate: `openssl rand -base64 32`)
   - `NODE_ENV`: `production`
6. Click **"Create Web Service"**
7. Get your backend URL (e.g., `https://felizardo-backend.onrender.com`)

### Option 2: Railway

1. Go to [railway.app](https://railway.app) and sign up with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Add Supabase PostgreSQL plugin (optional, or use external Supabase)
5. Set environment variables:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   JWT_SECRET=<generated-secret>
   NODE_ENV=production
   ```
6. Deploy and get backend URL

### Option 3: Vercel (Serverless Functions - requires refactoring)

Only suitable if you refactor backend to use Vercel Functions. For now, skip this.

---

## Frontend Deployment to Vercel

### Step 1: Push to GitHub

```bash
cd d:\projects\felizardosadminsystem
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Select your repository
4. Select **"frontend"** as root directory:
   - Set **Root Directory**: `frontend`
5. Add environment variables:
   ```
   VITE_API_URL=https://felizardo-backend.onrender.com/api
   ```
   (Replace with your backend URL from Render/Railway)
6. Click **"Deploy"**
7. Wait for build to complete (~2-3 min)
8. Get your frontend URL (e.g., `https://felizardo-admin.vercel.app`)

### Step 3: Update Backend CORS

Update `backend/src/app.js` CORS to allow Vercel frontend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://felizardo-admin.vercel.app',  // Add your Vercel URL
  ],
  credentials: true,
}));
```

Redeploy backend after this change.

---

## Environment Variables

### Backend (.env)

```bash
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
DB_HOST=db.xxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=[PASSWORD]

# JWT
JWT_SECRET=your-super-secret-key-generate-with-openssl

# Environment
NODE_ENV=production
PORT=5000
```

### Frontend (.env.production or .env)

```bash
VITE_API_URL=https://felizardo-backend.onrender.com/api
```

---

## Post-Deployment Verification

### Test Backend Connectivity

```bash
curl https://felizardo-backend.onrender.com/api/health
# Should return: {"message":"Server is running","database":"connected"}
```

### Test Frontend

1. Open `https://felizardo-admin.vercel.app` in browser
2. Try logging in with test credentials
3. Navigate to Settings → Add a facility → Verify it saves

### Check Logs

- **Render/Railway**: Dashboard → Logs
- **Vercel**: Dashboard → Deployments → Logs

### Common Issues

| Issue | Solution |
|-------|----------|
| `Error: ECONNREFUSED` | DATABASE_URL incorrect or Supabase firewall blocking |
| `CORS error` | Add frontend URL to backend CORS config |
| `401 Unauthorized` | JWT_SECRET mismatch or token expired |
| `502 Bad Gateway` | Backend not running; check Render/Railway logs |

---

## Rollback / Redeployment

### If something breaks:

1. **Render**: Go to Dashboard → Redeploy from specific commit
2. **Vercel**: Go to Deployments → Click "Redeploy" on previous working build
3. **Database**: Keep daily backups via Supabase (auto-enabled)

---

## Monitoring & Maintenance

### Set up Alerts

- **Render/Railway**: Enable email alerts for deployment failures
- **Vercel**: Enable GitHub notifications for failed deployments
- **Supabase**: Set up backup notifications in Settings

### Regular Backups

1. Supabase automatically backs up daily
2. Download manual backup monthly:
   ```bash
   pg_dump postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres > monthly_backup.sql
   ```

---

## Quick Checklist

- [ ] Supabase project created
- [ ] Database migrated to Supabase
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on all platforms
- [ ] CORS updated on backend
- [ ] Health check passes
- [ ] Login works
- [ ] Facility CRUD works
- [ ] Pricing saves correctly

---

## Support

For issues:
- **Supabase**: https://supabase.com/docs
- **Render**: https://render.com/docs
- **Vercel**: https://vercel.com/docs
