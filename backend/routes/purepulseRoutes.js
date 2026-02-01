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
        let posts = await Post.findAll('purepulse', 50);

        // Seed mock data if empty for "Wow" factor
        if (posts.length === 0) {
            posts = [
                {
                    id: 'm1',
                    author_name: 'EcoNexus_Alpha',
                    content: 'Just successfully deployed 50 urban filters in the central sector. Global air quality up by 0.2%! 🌬️ #ActionRecord',
                    likes: 124,
                    created_at: new Date(Date.now() - 3600000)
                },
                {
                    id: 'm2',
                    author_name: 'Guardian_Sarah',
                    content: 'Participated in the community re-wilding project today. 500 saplings planted! 🌱',
                    likes: 89,
                    created_at: new Date(Date.now() - 7200000)
                }
            ];
        }

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
        const { content, tags } = req.body;

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

        // Handle mock posts gracefully
        if (postId.toString().startsWith('m')) {
            await User.updatePoints(req.user.id, 10);
            return res.json({
                success: true,
                message: 'Impact established via mock node! +10 Impact Points awarded.'
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

module.exports = router;
