const db = require('../config/database');

class Post {
    /**
     * Initialize the Posts table
     */
    static async init() {
        // Drop table if schema changes needed during dev (Toggle comment)
        // const dropQuery = 'DROP TABLE IF EXISTS posts';
        // await db.query(dropQuery);

        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        tags VARCHAR(100),
        platform TEXT DEFAULT 'shuddhudara',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);
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
}

module.exports = Post;
