const db = require('../config/database');

class Post {
    /**
     * Initialize the Posts table
     */
    static async init() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        tags VARCHAR(100),
        image_url TEXT,
        platform TEXT DEFAULT 'shuddhudara',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);

            // Migration: Ensure image_url and platform exist for existing tables
            await db.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT');
            await db.query("ALTER TABLE posts ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'shuddhudara'");

            console.log('✅ Posts table initialized');
        } catch (err) {
            console.error('❌ Error initializing Posts table:', err);
        }
    }

    /**
     * Create a new post
     */
    static async create({ user_id, author_name, content, tags, image_url, platform = 'shuddhudara' }) {
        const query = `
      INSERT INTO posts (user_id, author_name, content, tags, image_url, platform)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, author_name, content, likes, tags, image_url, platform, created_at
    `;
        const values = [user_id, author_name, content, tags || 'General', image_url || null, platform];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    /**
     * Find all posts (Limit 50 typically)
     */
    static async findAll(platform = 'shuddhudara', limit = 50) {
        const query = `
            SELECT * FROM posts 
            WHERE platform = $1
            ORDER BY created_at DESC 
            LIMIT $2
        `;
        const { rows } = await db.query(query, [platform, limit]);
        return rows;
    }

    /**
     * Like a post
     */
    static async incrementLikes(id) {
        const query = 'UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING likes';
        const { rows } = await db.query(query, [id]);
        return rows[0] ? rows[0].likes : null;
    }

    /**
     * Update a post
     */
    static async update(id, userId, { content, image_url }) {
        const query = `
            UPDATE posts 
            SET content = $1, image_url = $2 
            WHERE id = $3 AND user_id = $4 
            RETURNING *
        `;
        const { rows } = await db.query(query, [content, image_url || null, id, userId]);
        return rows[0];
    }

    /**
     * Delete a post
     */
    static async delete(id, userId) {
        const query = 'DELETE FROM posts WHERE id = $1 AND user_id = $2 RETURNING id';
        const { rows } = await db.query(query, [id, userId]);
        return rows[0];
    }
}

module.exports = Post;
