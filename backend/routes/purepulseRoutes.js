const express = require('express');
const router = express.Router();
const Post = require('../models/postModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Optional auth middleware for the feed
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shuddhudara_temp_secret_for_deployment');
            req.user = await User.findById(decoded.id);
        }
        next();
    } catch (err) {
        next(); // Proceed without user
    }
};

/**
 * @route   GET /api/purepulse/feed
 * @desc    Get PurePulse community feed
 * @access  Public (Optional Auth for liked state)
 */
router.get('/feed', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const posts = await Post.findAll('purepulse', 50, userId);

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
 * @desc    Interact with a post (Breathe Life) - Prevents duplicate point farming
 * @access  Private
 */
router.post('/breathe/:id', protect, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        console.log(`[BREATHE] Post ID: ${postId}, User: ${req.user.username}`);

        // Handle mock posts gracefully (purely for non-DB prototypes)
        if (postId.toString().startsWith('m')) {
            await User.updatePoints(userId, 10);
            const updatedUser = await User.findById(userId);
            return res.json({
                success: true,
                message: 'Impact established via phantom node! +10 Impact Points awarded.',
                user: { points: updatedUser.points }
            });
        }

        // Check if user already liked
        const alreadyLiked = await Post.hasUserLiked(postId, userId);
        let newLikes;
        let pointsAwarded = 0;
        let message = '';

        if (alreadyLiked) {
            // Un-breathe (Toggle off)
            newLikes = await Post.decrementLikes(postId);
            await Post.removeLikeRecord(postId, userId);

            // Deduct points when un-breathing to prevent farming and keep sync
            await User.updatePoints(userId, -10);
            message = 'Connection withdrew. Impact neutralized. (-10 Impact)';
        } else {
            // Breathe (Toggle on)
            newLikes = await Post.incrementLikes(postId);
            await Post.addLikeRecord(postId, userId);

            // Award points for interaction
            await User.updatePoints(userId, 10);
            pointsAwarded = 10;
            message = 'Breathed life into the pulse! +10 Impact Points awarded.';
        }

        const updatedUser = await User.findById(userId);
        console.log(`[BREATHE] User ${req.user.username} now has ${updatedUser.points} points. New likes: ${newLikes}`);

        res.json({
            success: true,
            likes: newLikes,
            liked: !alreadyLiked,
            user: { points: updatedUser.points },
            message
        });
    } catch (error) {
        console.error('[BREATHE] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error interacting with post: ' + error.message
        });
    }
});

/**
 * @route   GET /api/purepulse/guardians
 * @desc    Get top impact guardians
 * @access  Public
 */
router.get('/guardians', async (req, res) => {
    try {
        const guardians = await User.getTopGuardians(10);
        res.json({
            success: true,
            guardians
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching guardians'
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

/**
 * @route   GET /api/purepulse/post/:id/comments
 * @desc    Get comments for a post
 * @access  Public
 */
router.get('/post/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.findByPostId(req.params.id);
        res.json({
            success: true,
            comments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching comments'
        });
    }
});

/**
 * @route   POST /api/purepulse/post/:id/comment
 * @desc    Add a comment to a post
 * @access  Private
 */
router.post('/post/:id/comment', protect, async (req, res) => {
    try {
        const { content } = req.body;
        console.log(`[COMMENT] Post ID: ${req.params.id}, User: ${req.user.username}`);

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Comment content is required'
            });
        }

        const comment = await Comment.create({
            post_id: req.params.id,
            user_id: req.user.id,
            author_name: req.user.username,
            content
        });
        console.log(`[COMMENT] Created comment ID: ${comment.id}`);

        // Award points for social feedback (+10 Impact)
        await User.updatePoints(req.user.id, 10);
        const updatedUser = await User.findById(req.user.id);
        console.log(`[COMMENT] User ${req.user.username} now has ${updatedUser.points} points`);

        res.status(201).json({
            success: true,
            comment,
            user: { points: updatedUser.points },
            message: 'Feedback logged in the Nexus! +10 Impact Points awarded.'
        });
    } catch (error) {
        console.error('[COMMENT] Error:', error);
        res.status(500).json({
            success: false,
            message: 'Error posting comment: ' + error.message
        });
    }
});

module.exports = router;
