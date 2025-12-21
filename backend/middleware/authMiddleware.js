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

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'shuddhudara_temp_secret_for_deployment');


            // Get user from database (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            // Check if user still exists
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            // Call next middleware/route handler
            next();

        } catch (error) {
            // Token is invalid or expired
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please login again.'
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
