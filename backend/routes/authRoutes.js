// authRoutes.js - Authentication API Routes
// This file defines all the API endpoints for authentication

const express = require('express');
const router = express.Router();

// Import controller functions
const {
    register,
    login,
    getProfile,
    logout,
    forgotPassword
} = require('../controllers/authController');

// Import authentication middleware
const { protect } = require('../middleware/authMiddleware');

/**
 * Public Routes (no authentication required)
 */

// @route   POST /api/auth/register
// @desc    Register a new user account
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login and receive JWT token
// @access  Public
router.post('/login', login);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', forgotPassword);

/**
 * Protected Routes (authentication required)
 * These routes use the 'protect' middleware to verify JWT token
 */

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// Export router
module.exports = router;
