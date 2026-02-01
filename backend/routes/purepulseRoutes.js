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
                    id: 'welcome',
                    author_name: 'Aarushi Chatterjee',
                    content: 'Welcome to the PurePulse Nexus! 🌿 I am beyond excited to see this guardian community grow. Today, I personally oversaw the restoration of 5 hectares of wetlands in the south sector. Every breath matters—share your impact and let\'s inspire the world together! #FirstPulse #PurePulseNexus',
                    likes: 542,
                    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80',
                    created_at: new Date(Date.now() - 600000)
                },
                {
                    id: 'm1',
                    author_name: 'EcoNexus_Alpha',
                    content: 'Just successfully deployed 50 urban filters in the central sector. Global air quality up by 0.2%! 🌬️ #ActionRecord',
                    likes: 124,
                    image_url: null,
                    created_at: new Date(Date.now() - 3600000)
                },
                {
                    id: 'm2',
                    author_name: 'Guardian_Sarah',
                    content: 'Participated in the community re-wilding project today. 500 saplings planted! 🌱',
                    likes: 89,
                    image_url: 'https://images.unsplash.com/photo-1576085898323-218117f310f8?auto=format&fit=crop&w=1000&q=80',
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

        // Handle mock posts gracefully
        if (postId.toString().startsWith('m') || postId.toString() === 'welcome') {
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
