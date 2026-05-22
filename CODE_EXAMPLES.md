# Code Examples & Templates

## Example 1: Express Server Setup (`src/server.js`)

```javascript
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

## Example 2: Express App Setup (`src/app.js`)

```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pavilion', require('./routes/pavilion'));
app.use('/api/pool', require('./routes/pool'));
app.use('/api/court', require('./routes/court'));
app.use('/api/clients', require('./routes/client'));
app.use('/api/maintenance', require('./routes/maintenance'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong',
    message: err.message 
  });
});

module.exports = app;
```

## Example 3: Database Connection (`src/database/connection.js`)

```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // OR individual parameters:
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  // database: process.env.DB_NAME,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

## Example 4: User Model (`src/models/User.js`)

```javascript
const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

class User {
  // Create new user
  static async create(email, password, fullName, role) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    const query = `
      INSERT INTO users (id, email, password_hash, full_name, role, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, email, full_name, role;
    `;
    
    const result = await pool.query(query, [id, email, hashedPassword, fullName, role]);
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users
  static async getAll() {
    const query = 'SELECT id, email, full_name, role, created_at FROM users;';
    const result = await pool.query(query);
    return result.rows;
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = User;
```

## Example 5: Auth Controller (`src/controllers/authController.js`)

```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register user
exports.register = async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user
    const user = await User.create(email, password, fullName, role || 'staff');

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const passwordMatch = await User.verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};
```

## Example 6: Auth Routes (`src/routes/auth.js`)

```javascript
const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
```

## Example 7: .env File Template

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/felizardos_admin_db
# OR
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=felizardos_admin_db

# JWT
JWT_SECRET=your_super_secret_key_change_this_in_production
```

## Example 8: Pavilion Model (`src/models/Pavilion.js`)

```javascript
const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Pavilion {
  // Create pavilion
  static async create(name, capacity, location, hourlyRate) {
    const id = uuidv4();
    const query = `
      INSERT INTO pavilions (id, name, capacity, location, hourly_rate, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *;
    `;
    const result = await pool.query(query, [id, name, capacity, location, hourlyRate]);
    return result.rows[0];
  }

  // Get all pavilions
  static async getAll() {
    const query = 'SELECT * FROM pavilions ORDER BY created_at DESC;';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get pavilion by ID
  static async getById(id) {
    const query = 'SELECT * FROM pavilions WHERE id = $1;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Update pavilion
  static async update(id, name, capacity, location, hourlyRate) {
    const query = `
      UPDATE pavilions 
      SET name = $2, capacity = $3, location = $4, hourly_rate = $5
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id, name, capacity, location, hourlyRate]);
    return result.rows[0];
  }

  // Delete pavilion
  static async delete(id) {
    const query = 'DELETE FROM pavilions WHERE id = $1 RETURNING id;';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Pavilion;
```

## Example 9: Pavilion Controller (`src/controllers/pavilionController.js`)

```javascript
const Pavilion = require('../models/Pavilion');

exports.create = async (req, res) => {
  try {
    const { name, capacity, location, hourlyRate } = req.body;
    
    if (!name || !capacity || !location || !hourlyRate) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const pavilion = await Pavilion.create(name, capacity, location, hourlyRate);
    res.status(201).json({ message: 'Pavilion created', pavilion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const pavilions = await Pavilion.getAll();
    res.json(pavilions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const pavilion = await Pavilion.getById(req.params.id);
    if (!pavilion) {
      return res.status(404).json({ error: 'Pavilion not found' });
    }
    res.json(pavilion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, capacity, location, hourlyRate } = req.body;
    const pavilion = await Pavilion.update(req.params.id, name, capacity, location, hourlyRate);
    if (!pavilion) {
      return res.status(404).json({ error: 'Pavilion not found' });
    }
    res.json({ message: 'Pavilion updated', pavilion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await Pavilion.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Pavilion not found' });
    }
    res.json({ message: 'Pavilion deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

## Example 10: React API Service (`frontend/src/services/pavilionService.js`)

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const pavilionService = {
  getAll: async () => {
    const response = await axios.get(`${API_URL}/pavilion`);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${API_URL}/pavilion/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(`${API_URL}/pavilion`, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`${API_URL}/pavilion/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${API_URL}/pavilion/${id}`);
    return response.data;
  }
};

export default pavilionService;
```

## Example 11: React Component (`frontend/src/pages/PavilionManagement.jsx`)

```javascript
import { useState, useEffect } from 'react';
import pavilionService from '../services/pavilionService';

export default function PavilionManagement() {
  const [pavilions, setPavilions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPavilions();
  }, []);

  const fetchPavilions = async () => {
    try {
      setLoading(true);
      const data = await pavilionService.getAll();
      setPavilions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Pavilion Management</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Hourly Rate</th>
          </tr>
        </thead>
        <tbody>
          {pavilions.map(pavilion => (
            <tr key={pavilion.id}>
              <td>{pavilion.name}</td>
              <td>{pavilion.capacity}</td>
              <td>{pavilion.location}</td>
              <td>${pavilion.hourly_rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Example 12: Database Schema (Part of `database/schema.sql`)

```sql
-- Create UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) CHECK (role IN ('admin', 'staff', 'manager')) DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pavilions table
CREATE TABLE pavilions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  capacity INT NOT NULL,
  location VARCHAR(255),
  hourly_rate DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pavilions_created_at ON pavilions(created_at);
```

---

## Usage Instructions

1. Copy these examples into your project files
2. Modify them according to your needs
3. Install missing packages: `npm install bcrypt jsonwebtoken`
4. Test each endpoint with Postman
5. Come back if you need clarification on any part

**Remember**: These are templates. Adjust them to fit your exact requirements!
