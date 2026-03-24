// authController.js - Authentication Logic
// This file contains all the functions for user authentication (register, login, etc.)

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate JWT Token
 * Creates a secure token for authenticated users
 */
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId }, // Payload - user ID
        process.env.JWT_SECRET || 'shuddhudara_temp_secret_for_deployment', // Fallback for stability
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
        const { username, email, password, platform } = req.body;

        // Validate that all fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: username, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.exists(username, email);

        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            return res.status(409).json({
                success: false,
                message: `${field} already in use. Please choose a different one.`
            });
        }

        // Create new user (password hashing is handled in User.create)
        const user = await User.create({
            username,
            email,
            password,
            platform: platform || 'shuddhudara'
        });

        // Generate authentication token
        const token = generateToken(user.id);

        // Send success response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                platform: user.platform,
                points: user.points || 0,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
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

        // Find user
        const user = await User.findByEmail(email);

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Verify password
        const isPasswordCorrect = await User.matchPassword(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login time
        await User.updateLastLogin(user.id);

        // Generate token
        const token = generateToken(user.id);

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                platform: user.platform,
                points: user.points || 0,
                lastLogin: new Date()
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login. Please contact support.'
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
        const user = req.user; // User already retrieved in middleware

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                platform: user.platform,
                points: user.points || 0,
                createdAt: user.created_at,
                lastLogin: user.last_login
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
 * @desc    Initiate password reset
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

        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, you will receive password reset instructions.'
            });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Expiry - 1 hour from now
        const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

        // Save token to DB
        await User.setResetToken(email, resetToken, resetExpires);

        // Construct reset link
        const host = req.get('host');
        const protocol = req.protocol || 'http';
        const resetUrl = `${protocol}://${host}/purepulse/reset-password.html?token=${resetToken}`;

        res.status(200).json({
            success: true,
            message: 'Recovery protocol sent successfully.',
            resetLink: resetUrl // Returned for local testing as requested
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset request'
        });
    }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid new password (min 6 characters)'
            });
        }

        // Find user by valid generic token
        const user = await User.findByResetToken(token);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired recovery token'
            });
        }

        // Update password
        await User.updatePassword(user.id, newPassword);

        res.status(200).json({
            success: true,
            message: 'Identity credentials successfully updated. You may now Initialize Session.'
        });

    } catch (error) {
        console.error('Reset Password Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset process'
        });
    }
};
