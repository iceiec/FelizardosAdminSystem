# Quick Start Checklist

## Before You Begin
- [ ] Download and install PostgreSQL (https://www.postgresql.org/download/)
- [ ] Install pgAdmin (comes with PostgreSQL) for database management
- [ ] Install Node.js LTS (https://nodejs.org/)
- [ ] Install Git (https://git-scm.com/)
- [ ] Create GitHub repository for this project
- [ ] Install a code editor (VS Code recommended)

## Day 1: Project Setup
- [ ] Create `/backend` folder
- [ ] Run `npm init -y` in backend
- [ ] Install dependencies: `npm install express cors dotenv pg uuid`
- [ ] Install dev dependency: `npm install -D nodemon`
- [ ] Create `src/app.js` with basic Express setup
- [ ] Create `src/server.js` as entry point
- [ ] Create `.env` with DATABASE_URL and PORT
- [ ] Test: `npm start` should show "Server running on port 5000"

## Day 2: Database Setup
- [ ] Create PostgreSQL database: `felizardos_admin_db`
- [ ] Copy the schema from DEVELOPMENT_GUIDE.md section 4
- [ ] Create `database/schema.sql` with all tables
- [ ] Run schema in pgAdmin or CLI
- [ ] Verify all tables created: `\dt` in psql

## Day 3: Backend Architecture
- [ ] Create folder structure: `src/models/`, `src/controllers/`, `src/routes/`, `src/middleware/`
- [ ] Create `src/database/connection.js` to connect PostgreSQL
- [ ] Test database connection from Node.js
- [ ] Create first model: `src/models/User.js`
- [ ] Create first controller: `src/controllers/authController.js`

## Day 4: First API Endpoint
- [ ] Create authentication route: `src/routes/auth.js`
- [ ] Implement user registration endpoint
- [ ] Test with Postman: POST `/api/auth/register`
- [ ] Fix any errors

## Day 5-6: Complete Backend APIs
- [ ] Pavilion CRUD: Create, Read, Update, Delete
- [ ] Pool CRUD
- [ ] Court scheduling
- [ ] Client management
- [ ] Maintenance tracking

## Day 7: Frontend Setup
- [ ] Create React app: `npm create vite@latest frontend -- --template react`
- [ ] Install dependencies: `npm install axios react-router-dom`
- [ ] Create page components for each module
- [ ] Setup React Router

## Day 8+: Frontend Integration & Polish
- [ ] Create API service layer
- [ ] Connect components to backend
- [ ] Style with CSS or Tailwind
- [ ] Test all features
- [ ] Deploy!

## How to Use This Checklist
- Print it or keep it open
- Check off items as you complete them
- Don't skip items even if they seem small
- Come back to me when you get stuck on any step

**Pro tip**: Commit to GitHub after completing each day! This builds your commit history for the portfolio. 💪
