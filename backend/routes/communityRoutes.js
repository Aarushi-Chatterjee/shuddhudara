const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
// Middleware to check auth would be here, assuming open for now or simple user_id passing
// In a real app, use authMiddleware

// GET /api/community/posts - Get recent posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error fetching posts' });
    }
});

// POST /api/community/posts - Create a post
router.post('/posts', async (req, res) => {
    try {
        const { user_id, author_name, content, tags } = req.body;

        if (!content || !author_name) {
            return res.status(400).json({ message: 'Content and Author Name are required' });
        }

        const newPost = await Post.create({
            user_id: user_id || null, // Allow anon if user_id not provided
            author_name,
            content,
            tags
        });

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error creating post' });
    }
});

// POST /api/community/posts/:id/like - Like a post
router.post('/posts/:id/like', async (req, res) => {
    try {
        const likes = await Post.incrementLikes(req.params.id);
        if (likes === null) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ likes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error liking post' });
    }
});

module.exports = router;
