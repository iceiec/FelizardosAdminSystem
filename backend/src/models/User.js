const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
    static async createUser(email, password, fullName, role = 'admin'){
        const id = uuidv4();
        const passwordHash = await bcrypt.hash(password, 10);
        const query = 
            `INSERT INTO users (id, email, password_hash, full_name, role, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING id, email, full_name, role, created_at, updated_at;`;

        const result = await pool.query(query, [id, email, passwordHash, fullName, role]);
        return result.rows[0];
    }

    static async findByEmail(email){
        const query = 'SELECT * from users where email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async verifyPassword(plain, hashed){
        return bcrypt.compare(plain, hashed);
    }
}

module.exports = User;