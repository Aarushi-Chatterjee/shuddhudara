const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Initialize the Users table
     */
    static async init() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        points INTEGER DEFAULT 0,
        impact_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);
            console.log('✅ Users table initialized');
        } catch (err) {
            console.error('❌ Error initializing Users table:', err);
        }
    }

    /**
     * Create a new user
     */
    static async create({ username, email, password }) {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at
    `;
        const values = [username, email, hashedPassword];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }

    /**
     * Find user by ID with points
     */
    static async findById(id) {
        const query = 'SELECT id, username, email, points, impact_score, created_at, last_login FROM users WHERE id = $1';
        const { rows } = await db.query(query, [id]);
        return rows[0];
    }

    /**
     * Add/Update points for a user
     */
    static async updatePoints(id, amount) {
        const query = 'UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points';
        const { rows } = await db.query(query, [amount, id]);
        return rows[0].points;
    }

    /**
     * Check if username or email exists
     */
    static async exists(username, email) {
        const query = 'SELECT * FROM users WHERE username = $1 OR email = $2';
        const { rows } = await db.query(query, [username, email]);
        return rows[0]; // Returns the user if found
    }

    /**
     * Verify password
     */
    static async matchPassword(enteredPassword, storedHash) {
        return await bcrypt.compare(enteredPassword, storedHash);
    }

    /**
     * Update last login
     */
    static async updateLastLogin(id) {
        const query = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1';
        await db.query(query, [id]);
    }
}

// Initialize the table when this module is loaded (or called separately)
// We will call User.init() explicitly in server.js to ensure it completes before requests
// setTimeout(() => User.init(), 1000); 

module.exports = User;

