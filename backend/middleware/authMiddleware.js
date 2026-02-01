// authMiddleware.js - JWT Authentication Middleware
// This file protects routes by verifying JWT tokens

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Protect Routes Middleware
 * Verifies JWT token and authenticates users
 * Add this middleware to any route that requires authentication
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check if authorization header exists and starts with 'Bearer'
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Extract token from header
            // Format: "Bearer TOKEN_HERE"
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please login to access this resource.'
            });
        }

        let decoded;
        try {
            // Verify token
            console.log('[AUTH] Verifying token...');
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'shuddhudara_temp_secret_for_deployment');
            console.log('[AUTH] Token decoded successfully, user ID:', decoded.id);
        } catch (error) {
            console.error('[AUTH] Token verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
            });
        }

        try {
            // Get user from database
            req.user = await User.findById(decoded.id);
            console.log('[AUTH] User found:', req.user ? req.user.username : 'null');

            // Check if user still exists
            if (!req.user) {
                console.log('[AUTH] User not found in database');
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            console.log('[AUTH] Authentication successful for user:', req.user.username);
            next();
        } catch (error) {
            console.error('[AUTH] Database error during user lookup:', error);
            // Return 500 for database errors instead of 401
            return res.status(500).json({
                success: false,
                message: 'Server error check database connection'
            });
        }

    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

module.exports = { protect };
