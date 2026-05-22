# FelizardosAdminSystem - Development Guide
*A comprehensive guide for building a full-stack portfolio project*

---

## 1. PROJECT OVERVIEW

### What You're Building
A comprehensive management system for three venue types (Pavilion, Pool, Court) with a unified maintenance module.

### Why This is a Strong Portfolio Project
- ✅ Uses modern tech stack (React + Express + PostgreSQL)
- ✅ Multiple interconnected modules showing architectural thinking
- ✅ Real-world business logic (scheduling, client management, maintenance)
- ✅ Opportunity to showcase database design skills
- ✅ Demonstrates full-stack capabilities
- ✅ Scalable structure that employers recognize

---

## 2. TECH STACK EXPLANATION

### Frontend: React
- **Why**: Industry standard, large community, great for dashboards/admin systems
- **Learning benefit**: Most in-demand skill; perfect for portfolio
- **Setup**: Vite (faster than CRA), TypeScript (shows professionalism)

### Backend: Express.js
- **Why**: Lightweight, flexible, perfect for learning backend architecture
- **Learning benefit**: Not opinionated; teaches you proper REST API design
- **Setup**: Node.js with npm/yarn

### Database: PostgreSQL
- **Why**: Powerful relational database; handles complex queries well
- **Learning benefit**: You already know Firebase/Supabase; PostgreSQL shows deeper SQL knowledge
- **Difference from Supabase**: You'll manage the database yourself (learning experience!)
- **Setup**: Local installation or cloud (Render, Railway, Neon - free tiers available)

### Additional Tools
- **Git/GitHub**: Version control (essential for portfolio)
- **Postman/Thunder Client**: Test APIs
- **pgAdmin**: GUI for PostgreSQL management
- **Docker** (optional): Shows DevOps knowledge

---

## 3. PROJECT STRUCTURE

```
FelizardosAdminSystem/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components (Pavilion, Pool, Court, Maintenance)
│   │   ├── services/        # API calls to backend
│   │   ├── context/         # Global state management (or Redux)
│   │   ├── styles/          # CSS/Tailwind styles
│   │   ├── utils/           # Helper functions
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express.js application
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── controllers/      # Business logic
│   │   ├── models/          # Database models (database access layer)
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── database/        # Database connection, migrations
│   │   ├── config/          # Configuration files
│   │   └── app.js           # Express app setup
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── server.js            # Entry point
│
├── database/                 # PostgreSQL setup
│   ├── schema.sql           # Database schema (all tables)
│   ├── migrations/          # Database migrations (optional but good practice)
│   └── seed.sql             # Sample data for testing
│
├── docs/                     # Documentation
│   ├── API_ENDPOINTS.md     # All API routes
│   ├── DATABASE_DESIGN.md   # Database schema explanation
│   └── SETUP_INSTRUCTIONS.md
│
└── README.md
```

---

## 4. DATABASE DESIGN (PostgreSQL)

### Core Tables

#### 1. **Users Table** (Role-based authentication)
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,
  full_name VARCHAR,
  role ENUM ('admin', 'staff', 'manager'),
  created_at TIMESTAMP
)
```

#### 2. **Clients Table** (Shared across all venues)
```sql
clients (
  id UUID PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  address VARCHAR,
  created_at TIMESTAMP
)
```

#### 3. **Pavilion Management**
```sql
pavilions (
  id UUID PRIMARY KEY,
  name VARCHAR,
  capacity INT,
  location VARCHAR,
  hourly_rate DECIMAL,
  created_at TIMESTAMP
)

pavilion_bookings (
  id UUID PRIMARY KEY,
  pavilion_id UUID FOREIGN KEY,
  client_id UUID FOREIGN KEY,
  event_type VARCHAR (birthday, wedding, corporate, etc.),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  total_price DECIMAL,
  status ENUM ('pending', 'confirmed', 'completed', 'cancelled'),
  created_at TIMESTAMP
)
```

#### 4. **Pool Management**
```sql
pools (
  id UUID PRIMARY KEY,
  name VARCHAR,
  capacity INT,
  location VARCHAR,
  hourly_rate DECIMAL,
  depth_feet DECIMAL,
  created_at TIMESTAMP
)

pool_bookings (
  id UUID PRIMARY KEY,
  pool_id UUID FOREIGN KEY,
  client_id UUID FOREIGN KEY,
  service_type VARCHAR (lap_swimming, party, lessons, etc.),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  total_price DECIMAL,
  status ENUM ('pending', 'confirmed', 'completed', 'cancelled'),
  created_at TIMESTAMP
)
```

#### 5. **Court Management**
```sql
courts (
  id UUID PRIMARY KEY,
  name VARCHAR,
  sport_type VARCHAR (basketball, tennis, badminton),
  location VARCHAR,
  hourly_rate DECIMAL,
  created_at TIMESTAMP
)

court_schedules (
  id UUID PRIMARY KEY,
  court_id UUID FOREIGN KEY,
  client_id UUID FOREIGN KEY,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  status ENUM ('available', 'booked', 'maintenance'),
  total_price DECIMAL,
  created_at TIMESTAMP
)
```

#### 6. **Maintenance Module** (Unified)
```sql
maintenance_requests (
  id UUID PRIMARY KEY,
  venue_type ENUM ('pavilion', 'pool', 'court'),
  venue_id UUID,
  issue_description TEXT,
  priority ENUM ('low', 'medium', 'high'),
  status ENUM ('open', 'in_progress', 'completed', 'cancelled'),
  assigned_to UUID FOREIGN KEY (users.id),
  created_at TIMESTAMP,
  completed_at TIMESTAMP
)

maintenance_history (
  id UUID PRIMARY KEY,
  maintenance_request_id UUID FOREIGN KEY,
  notes TEXT,
  status_change VARCHAR,
  changed_at TIMESTAMP
)
```

---

## 5. STEP-BY-STEP SETUP INSTRUCTIONS

### Phase 1: Project Initialization (Backend First)

#### Step 1.1: Create Backend Project
```bash
# Create project folders
mkdir FelizardosAdminSystem
cd FelizardosAdminSystem
mkdir backend

# Initialize Node.js project
cd backend
npm init -y
```

#### Step 1.2: Install Backend Dependencies
```bash
npm install express cors dotenv pg uuid
npm install -D nodemon
```

#### Step 1.3: Setup Express Server Structure
- Create `src/app.js` - Express app configuration
- Create `src/server.js` - Server entry point
- Create `.env` - Environment variables
- Create `src/database/connection.js` - PostgreSQL connection

#### Step 1.4: Create Frontend Project
```bash
cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
```

#### Step 1.5: Setup PostgreSQL Database
- Install PostgreSQL locally OR use cloud services (Neon, Railway, Render)
- Create database: `felizardos_admin_db`
- Run schema.sql to create all tables

---

### Phase 2: Backend Development (Module by Module)

#### Step 2.1: Authentication Module
- Create `src/models/User.js` - Database queries for users
- Create `src/controllers/authController.js` - Login/Register logic
- Create `src/routes/auth.js` - Auth endpoints
- Implement JWT tokens for security

#### Step 2.2: Pavilion Management Module
- Create `src/models/Pavilion.js` - Database queries
- Create `src/controllers/pavilionController.js` - CRUD logic
- Create `src/routes/pavilion.js` - API endpoints
- Test with Postman

#### Step 2.3: Pool Management Module
- Follow same pattern as Pavilion
- Create models, controllers, routes

#### Step 2.4: Court Management Module
- Follow same pattern as Pavilion
- Create models, controllers, routes

#### Step 2.5: Maintenance Module
- Create `src/models/Maintenance.js`
- Create `src/controllers/maintenanceController.js`
- Connect to all venue types

#### Step 2.6: Client Management Module
- Centralized client database accessible by all modules

---

### Phase 3: Frontend Development

#### Step 3.1: Setup React Router
- Create pages for each module
- Setup navigation/sidebar

#### Step 3.2: Build Components
- Create reusable components (Buttons, Forms, Tables, Modals)
- Build dashboard page

#### Step 3.3: Implement Module Pages
- Pavilion Management page
- Pool Management page
- Court Management page
- Maintenance page
- Client Management page

#### Step 3.4: API Integration
- Create `src/services/api.js` - Axios instance
- Create service files for each module (pavilionService.js, etc.)

---

## 6. IMPLEMENTATION ROADMAP

### Week 1: Foundation
- ✅ Setup project structure
- ✅ Configure PostgreSQL
- ✅ Create database schema
- ✅ Setup Express server with basic routing

### Week 2: Backend - Core APIs
- ✅ Authentication system
- ✅ Pavilion CRUD APIs
- ✅ Pool CRUD APIs
- ✅ Client management APIs

### Week 3: Backend - Advanced
- ✅ Court scheduling logic
- ✅ Maintenance workflow
- ✅ Error handling & validation
- ✅ Database transactions

### Week 4: Frontend - UI
- ✅ Setup React routing
- ✅ Build reusable components
- ✅ Create page layouts

### Week 5: Frontend - Integration
- ✅ Connect to backend APIs
- ✅ Implement CRUD operations
- ✅ Add form validation

### Week 6: Polish & Deployment
- ✅ Error handling
- ✅ Loading states
- ✅ Test all features
- ✅ Deploy to hosting (Vercel, Render)

---

## 7. BEST PRACTICES FOR PORTFOLIO

### Code Quality
- Use consistent naming conventions
- Write meaningful commit messages
- Comment complex logic
- Use environment variables for secrets
- Handle errors gracefully

### Security
- Hash passwords (bcrypt)
- Use JWT for authentication
- Validate all inputs
- Use CORS properly
- Never commit .env files

### Performance
- Use database indexes
- Implement pagination for lists
- Optimize queries
- Use lazy loading in React

### Documentation
- Keep README updated
- Document API endpoints (use Swagger optional)
- Explain database design
- Include setup instructions

### Version Control
- Create meaningful branches
- Write clear commit messages
- Use .gitignore properly
- Regular commits (don't do one giant commit)

---

## 8. COMMON PITFALLS TO AVOID

❌ **Don't**: Write frontend and backend simultaneously
✅ **Do**: Complete backend APIs first, test with Postman

❌ **Don't**: Skip database planning
✅ **Do**: Design schema carefully before coding

❌ **Don't**: Hardcode API URLs
✅ **Do**: Use environment variables

❌ **Don't**: Mix business logic with routes
✅ **Do**: Use controllers for business logic

❌ **Don't**: Forget error handling
✅ **Do**: Return meaningful error messages

❌ **Don't**: Deploy without testing
✅ **Do**: Test thoroughly before deployment

---

## 9. LEARNING RESOURCES

### PostgreSQL
- Official Docs: postgresql.org
- SQL Tutorial: Mode Analytics SQL Tutorial
- GUI Tool: pgAdmin (included with PostgreSQL)

### Express.js
- Official Docs: expressjs.com
- Architecture: Model-View-Controller (MVC) pattern

### React
- Hooks documentation
- React Router for navigation
- State management with Context API (or Redux for larger projects)

### Full-Stack
- RESTful API design principles
- Database relationships (one-to-many, many-to-many)
- JWT authentication flow

---

## 10. DEPLOYMENT CHECKLIST

### Backend
- [ ] All environment variables configured
- [ ] Database migrations ready
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Deploy to Render, Railway, or Heroku

### Frontend
- [ ] Environment variables for API URL
- [ ] All APIs tested
- [ ] Responsive design checked
- [ ] Deploy to Vercel or Netlify

---

## NEXT STEPS

1. **Start with backend folder setup** (Section 5, Phase 1)
2. **Create PostgreSQL database** with schema
3. **Build authentication first** (most critical)
4. **Then each management module** (Pavilion → Pool → Court)
5. **Add frontend piece by piece** connected to backend

---

## Questions to Ask Me As You Build

- "I'm confused about the database schema for pavilion bookings"
- "How do I structure my controller for handling complex queries?"
- "Show me the proper error handling pattern"
- "How do I validate form inputs on backend?"
- "Should I use transactions for this operation?"

**I'm here to guide you through each step. Let's build something awesome! 🚀**
