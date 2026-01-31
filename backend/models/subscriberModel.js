const db = require('../config/database');

class Subscriber {
    /**
     * Initialize the Subscribers table
     */
    static async init() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(255) UNIQUE NOT NULL,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);
            console.log('✅ Subscribers table initialized');
        } catch (err) {
            console.error('❌ Error initializing Subscribers table:', err);
        }
    }

    /**
     * Add a new subscriber
     */
    static async create({ name, email }) {
        const query = `
      INSERT INTO subscribers (name, email)
      VALUES ($1, $2)
      RETURNING id, name, email, joined_at
    `;
        const values = [name, email];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    /**
     * Get total count of subscribers
     */
    static async count() {
        const query = 'SELECT COUNT(*) FROM subscribers';
        const { rows } = await db.query(query);
        return parseInt(rows[0].count);
    }

    /**
     * Check if email exists
     */
    static async exists(email) {
        const query = 'SELECT * FROM subscribers WHERE email = $1';
        const { rows } = await db.query(query, [email]);
        return rows[0];
    }
}

module.exports = Subscriber;
