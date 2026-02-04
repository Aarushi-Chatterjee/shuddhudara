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
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
        try {
            await db.query(createTableQuery);

            // Migration: Ensure columns exist
            await db.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url TEXT');
            await db.query("ALTER TABLE posts ADD COLUMN IF NOT EXISTS platform TEXT DEFAULT 'shuddhudara'");
            await db.query('ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT FALSE');

            // Create post_likes table to prevent duplicate point farming
            const createLikesTableQuery = `
              CREATE TABLE IF NOT EXISTS post_likes (
                id SERIAL PRIMARY KEY,
                post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(post_id, user_id)
              );
            `;
            await db.query(createLikesTableQuery);

            // Seed Welcome Post if missing
            // Seed/Restore Welcome Post (Force Update to ensure correct text)
            const welcomeText = `Establishing the Root System. 🌱

Welcome to PurePulse. Today, we transition from passive observation to active guardianship. Our platform is now synchronized to track the breath of our city. Small acts—planting, protecting, and purifying—are the data points that will save us.

Why are we here? Because for too long, environmental change felt like a giant problem for 'someone else' to fix. PurePulse changes that. We believe that every time you choose a sustainable path, you aren't just one person—you are a node in a massive, living network of recovery.

How to Pulse:

1. Planting: Share a photo of your indoor garden or a community sapling. These are our 'Oxygen Anchors.'
2. Protecting: Log an action where you saved a resource or reduced waste. This is 'Data Shielding.'
3. Purifying: Verify local air quality or use the 'Breathe Life' button on a fellow Guardian's post. This 'Positive Feedback Loop' strengthens our collective impact.

Let’s make our impact visible. What’s your first pulse?

Impact: +50 IMP (Breathe Life Protocol)`;

            const { rows } = await db.query("SELECT * FROM posts WHERE is_pinned = TRUE AND platform = 'purepulse' LIMIT 1");

            if (rows.length === 0) {
                // Insert if missing
                await db.query(`
                    INSERT INTO posts (author_name, content, likes, image_url, platform, is_pinned)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, ['Aarushi Chatterjee', welcomeText, 10, 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80', 'purepulse', true]);
                console.log('✅ Welcome post seeded');
            } else {
                // RESTORE/UPDATE existing pinned post to original text
                await db.query(`
                    UPDATE posts 
                    SET content = $1, likes = 10 
                    WHERE is_pinned = TRUE AND platform = 'purepulse'
                `, [welcomeText]);
                console.log('✅ Welcome post restored to original');
            }

            console.log('✅ Posts table initialized and seeded');
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
            ORDER BY is_pinned DESC, created_at DESC 
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

    /**
     * Check if a user has liked a post
     */
    static async hasUserLiked(postId, userId) {
        const query = 'SELECT id FROM post_likes WHERE post_id = $1 AND user_id = $2';
        const { rows } = await db.query(query, [postId, userId]);
        return rows.length > 0;
    }

    /**
     * Internal method to add a like record
     */
    static async addLikeRecord(postId, userId) {
        const query = 'INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING';
        await db.query(query, [postId, userId]);
    }

    /**
     * Internal method to remove a like record
     */
    static async removeLikeRecord(postId, userId) {
        const query = 'DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2';
        await db.query(query, [postId, userId]);
    }

    /**
     * Decrement likes count
     */
    static async decrementLikes(id) {
        const query = 'UPDATE posts SET likes = GREATEST(0, likes - 1) WHERE id = $1 RETURNING likes';
        const { rows } = await db.query(query, [id]);
        return rows[0] ? rows[0].likes : null;
    }
}

module.exports = Post;
