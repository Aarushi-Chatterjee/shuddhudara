// authController.js - Authentication Logic
// This file contains all the functions for user authentication (register, login, etc.)

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Resend } = require('resend');

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY);

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

        // Build reset URL — uses FRONTEND_URL in production (Vercel), fallbacks to localhost
        const baseUrl = process.env.FRONTEND_URL || `http://localhost:${process.env.PORT || 3000}`;
        const resetUrl = `${baseUrl}/purepulse/reset-password.html?token=${resetToken}`;

        // Send email via Resend
        const { error: emailError } = await resend.emails.send({
            from: 'PurePulse <noreply@purepulse.eco>',
            to: email,
            subject: '🌿 PurePulse — Identity Recovery Protocol',
            html: `
                <div style="font-family: 'Inter', Arial, sans-serif; background: #0a0a0a; color: #e0e0e0; padding: 40px; border-radius: 12px; max-width: 520px; margin: auto;">
                    <h1 style="color: #00ff94; font-size: 1.8rem; margin-bottom: 0.25rem;">PurePulse</h1>
                    <p style="color: #888; font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Environmental Impact HUB</p>
                    <hr style="border-color: #1a1a1a; margin: 24px 0;">
                    <h2 style="font-size: 1.2rem; color: #fff;">Identity Recovery Protocol</h2>
                    <p style="color: #aaa; line-height: 1.7;">We received a request to reset the password for the Guardian account linked to <strong style="color: #fff;">${email}</strong>.</p>
                    <p style="color: #aaa; line-height: 1.7;">Click the button below to set a new Security Protocol. This link expires in <strong style="color: #fff;">1 hour</strong>.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: #00ff94; color: #000; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 0.95rem; letter-spacing: 0.5px;">Reset Identity Credentials</a>
                    </div>
                    <p style="color: #666; font-size: 0.8rem;">If you did not request a reset, please ignore this message — your credentials remain unchanged.</p>
                    <hr style="border-color: #1a1a1a; margin: 24px 0;">
                    <p style="color: #444; font-size: 0.75rem; text-align: center;">PurePulse &mdash; Tech-Eco Environmental Platform</p>
                </div>
            `
        });

        if (emailError) {
            console.error('Resend Email Error:', emailError);
            return res.status(500).json({
                success: false,
                message: 'Failed to send recovery email. Please try again later.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recovery protocol dispatched. Check your secure inbox.'
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
