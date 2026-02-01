const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel');
const { protect } = require('../middleware/authMiddleware');

/**
 * @route   GET /api/purepulse/feed
 * @desc    Get PurePulse community feed
 * @access  Public
 */
router.get('/feed', async (req, res) => {
    try {
        const posts = await Post.findAll('purepulse', 50);

        res.json({
            success: true,
            posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feed'
        });
    }
});

/**
 * @route   POST /api/purepulse/post
 * @desc    Create a new PurePulse post
 * @access  Private
 */
router.post('/post', protect, async (req, res) => {
    try {
        const { content, tags, image_url } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        const post = await Post.create({
            user_id: req.user.id,
            author_name: req.user.username,
            content,
            tags,
            image_url,
            platform: 'purepulse'
        });

        // Award impact points for posting (+50 Impact)
        await User.updatePoints(req.user.id, 50);

        res.status(201).json({
            success: true,
            post,
            message: 'Pulse shared successfully! +50 Impact Points awarded.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating post'
        });
    }
});

/**
 * @route   POST /api/purepulse/breathe/:id
 * @desc    Interact with a post (Breathe Life)
 * @access  Private
 */
router.post('/breathe/:id', protect, async (req, res) => {
    try {
        const postId = req.params.id;

        // Handle mock posts gracefully (purely for non-DB prototypes)
        if (postId.toString().startsWith('m')) {
            await User.updatePoints(req.user.id, 10);
            return res.json({
                success: true,
                message: 'Impact established via phantom node! +10 Impact Points awarded.'
            });
        }

        const newLikes = await Post.incrementLikes(postId);

        if (newLikes === null) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        // Award points for interaction (+10 Impact)
        await User.updatePoints(req.user.id, 10);

        res.json({
            success: true,
            likes: newLikes,
            message: 'Breathed life into the pulse! +10 Impact Points awarded.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error interacting with post'
        });
    }
});

/**
 * @route   PUT /api/purepulse/post/:id
 * @desc    Update a PurePulse post
 * @access  Private
 */
router.put('/post/:id', protect, async (req, res) => {
    try {
        const { content, image_url } = req.body;
        const post = await Post.update(req.params.id, req.user.id, { content, image_url });

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        res.json({
            success: true,
            post,
            message: 'Pulse updated successfully!'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating pulse'
        });
    }
});

/**
 * @route   DELETE /api/purepulse/post/:id
 * @desc    Delete a PurePulse post
 * @access  Private
 */
router.delete('/post/:id', protect, async (req, res) => {
    try {
        const post = await Post.delete(req.params.id, req.user.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or unauthorized'
            });
        }

        res.json({
            success: true,
            message: 'Pulse deleted from Nexus'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting pulse'
        });
    }
});

module.exports = router;
