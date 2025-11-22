// authController.js - Authentication Logic
// This file contains all the functions for user authentication (register, login, etc.)

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * Creates a secure token for authenticated users
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId }, // Payload - user ID
        process.env.JWT_SECRET, // Secret key
        { expiresIn: process.env.JWT_EXPIRE || '7d' } // Expiration time
    );
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        // Extract user data from request body
        const { username, email, password } = req.body;

        // Validate that all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: username, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            return res.status(409).json({
                success: false,
                message: `${field} already in use. Please choose a different one.`
            });
        }

        // Create new user (password will be hashed automatically by the model)
        const user = await User.create({
            username,
            email,
            password
        });

        // Generate authentication token
        const token = generateToken(user._id);

        // Send success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration. Please try again later.'
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        // Extract login credentials
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password (normally excluded)
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login time
        await user.updateLastLogin();

        // Generate token
        const token = generateToken(user._id);

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login. Please try again later.'
        });
    }
};

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user is set by the auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving profile'
        });
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side should remove token)
 * @access  Private
 */
exports.logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Logged out successfully. Please remove the token from client storage.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during logout'
        });
    }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset (placeholder for now)
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email address'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            // For security, don't reveal if email exists or not
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive password reset instructions.'
            });
        }

        // TODO: Implement actual password reset logic
        // This would typically involve:
        // 1. Generate a reset token
        // 2. Save it to the database with expiration
        // 3. Send email with reset link

        res.status(200).json({
            success: true,
            message: 'Password reset functionality will be implemented. Please contact support for now.'
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset request'
        });
    }
};
