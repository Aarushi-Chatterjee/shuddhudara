const db = require('../config/database');

class Comment {
    /**
     * Initialize the Comments table
     */
    static async init() {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);
            console.log('✅ Comments table initialized');
        } catch (err) {
            console.error('❌ Error initializing Comments table:', err);
        }
    }

    /**
     * Create a new comment
     */
    static async create({ post_id, user_id, author_name, content }) {
        const query = `
      INSERT INTO comments (post_id, user_id, author_name, content)
      VALUES ($1, $2, $3, $4)
      RETURNING id, post_id, author_name, content, created_at
    `;
        const values = [post_id, user_id, author_name, content];

        const { rows } = await db.query(query, values);
        return rows[0];
    }

    /**
     * Get comments for a post
     */
    static async findByPostId(postId) {
        const query = `
            SELECT * FROM comments 
            WHERE post_id = $1
            ORDER BY created_at ASC
        `;
        const { rows } = await db.query(query, [postId]);
        return rows;
    }

    /**
     * Delete a comment
     */
    static async delete(id, userId) {
        const query = 'DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING id';
        const { rows } = await db.query(query, [id, userId]);
        return rows[0];
    }
}

module.exports = Comment;
