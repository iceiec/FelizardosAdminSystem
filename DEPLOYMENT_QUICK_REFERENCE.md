# Deployment Quick Reference

## 🚀 30-Minute Deployment Checklist

### Supabase Setup (5 min)
- [ ] Sign up at supabase.com
- [ ] Create new project → save password
- [ ] Copy Connection URL from Settings → Database
- [ ] Optional: Run migrations (Option C in DEPLOYMENT_GUIDE.md)

### Backend Deployment (10 min)
- [ ] Sign up at render.com (or railway.app)
- [ ] Connect GitHub repo
- [ ] Create Web Service
- [ ] Set environment variables:
  ```
  DATABASE_URL = <your-supabase-url>
  JWT_SECRET = <run: openssl rand -base64 32>
  NODE_ENV = production
  FRONTEND_URL = <will-get-after-vercel>
  ```
- [ ] Deploy (wait ~5 min)
- [ ] Copy backend URL (e.g., https://felizardo-backend.onrender.com)

### Frontend Deployment (10 min)
- [ ] Push code: `git push`
- [ ] Sign up at vercel.com with GitHub
- [ ] Import project
- [ ] Set root directory: `frontend`
- [ ] Set environment variable:
  ```
  VITE_API_URL = https://felizardo-backend.onrender.com/api
  ```
- [ ] Deploy (wait ~3 min)
- [ ] Copy frontend URL

### Update CORS (2 min)
- [ ] Go back to Render/Railway backend
- [ ] Update `FRONTEND_URL` with Vercel URL
- [ ] Redeploy backend

### Test (3 min)
- [ ] Open Vercel URL in browser
- [ ] Login with test credentials
- [ ] Add facility → Should save
- [ ] Check Render logs for errors

---

## 📊 Environment Variables

### Backend (Render/Railway)
| Variable | Example | Source |
|----------|---------|--------|
| `DATABASE_URL` | `postgresql://...@supabase.co:5432/postgres` | Supabase Settings → Database |
| `JWT_SECRET` | `a3f5k9...` | `openssl rand -base64 32` |
| `NODE_ENV` | `production` | Hardcode |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Vercel deployment |
| `PORT` | `5000` | Keep default |

### Frontend (Vercel)
| Variable | Example |
|----------|---------|
| `VITE_API_URL` | `https://felizardo-backend.onrender.com/api` |

---

## 🔗 Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## ⚠️ Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `CORS error` | Add FRONTEND_URL to backend .env and redeploy |
| `Connection refused` | Check DATABASE_URL in Render settings |
| `401 Unauthorized` | JWT_SECRET might be missing or different |
| `Build failed on Vercel` | Check `frontend/.env` has VITE_API_URL |
| `502 Bad Gateway` | Backend crashed; check Render logs |

---

## 🔄 After Deployment

### Monitor
- Render: Dashboard → Logs
- Vercel: Deployments → Recent builds

### Scale (if needed)
- Render: Change instance type for more power
- Vercel: Auto-scales, no config needed

### Update Code
```bash
git push → Auto-deploys to Render + Vercel
```

---

## 🆘 Need Help?

1. Check [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed steps
2. See vendor docs:
   - Supabase: https://supabase.com/docs
   - Render: https://render.com/docs
   - Vercel: https://vercel.com/docs
3. Check backend logs in Render dashboard
4. Check frontend logs in Vercel deployments tab
