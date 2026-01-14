const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

/**
 * @route   POST /api/points/update
 * @desc    Update user points
 * @access  Public (Should be protected in production)
 */
router.post('/update', async (req, res) => {
    try {
        const { userId, amount } = req.body;

        if (!userId || amount === undefined) {
            return res.status(400).json({ success: false, message: 'Missing userId or amount' });
        }

        const newPoints = await User.updatePoints(userId, amount);

        res.json({
            success: true,
            message: 'Points updated successfully',
            points: newPoints
        });
    } catch (error) {
        console.error('Points Update Error:', error);
        res.status(500).json({ success: false, message: 'Server error updating points' });
    }
});

module.exports = router;
