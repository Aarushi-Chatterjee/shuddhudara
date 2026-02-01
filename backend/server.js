// server.js - Main Express Server
// This is the entry point for the SHUDDHUDARA backend application

// Load environment variables from .env file (Must be first)
require('dotenv').config();

// Import required packages
const express = require('express');
// const dotenv = require('dotenv'); // Already loaded
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const pointsRoutes = require('./routes/pointsRoutes');
const User = require('./models/userModel');
const Subscriber = require('./models/subscriberModel');
const newsletterRoutes = require('./routes/newsletterRoutes'); // Import here
const Post = require('./models/postModel');
const communityRoutes = require('./routes/communityRoutes');
const purepulseRoutes = require('./routes/purepulseRoutes');




// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: '*', // In production, replace with your frontend URL
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serverless Initialization Middleware with better error catching
let isInitialized = false;
let initPromise = null;

const initializeApp = async () => {
    try {
        await User.init();
        await Post.init();
        await Subscriber.init();
        console.log('✅ Services initialized');
    } catch (error) {
        console.error('❌ Service initialization error:', error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    // Skip init for health checks or if already done
    if (isInitialized) return next();

    // Ensure only one initialization runs at a time
    if (!initPromise) {
        initPromise = initializeApp().then(() => {
            isInitialized = true;
            initPromise = null;
        });
    }

    try {
        await initPromise;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});




// Serve Static Frontend Files
// Path leads to the 'frontend' directory (sibling of 'backend')
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// Request logging middleware (for development)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});


// ============================================
// API ROUTES
// ============================================

// Health check endpoint (can still be used for monitoring)
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '🌱 SHUDDHUDARA API is healthy',
        status: 'UP'
    });
});

// Serve Home Page on Root
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'home', 'index.html'));
});

// Authentication// Routes
// app.use('api/v1/auth', authRoutes) -- Example
// app.use('/api/auth', authRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/points', pointsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/purepulse', purepulseRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res, next) => {
    // If it's an API request, return JSON
    if (req.originalUrl.startsWith('/api')) {
        return res.status(404).json({
            success: false,
            message: `API Route ${req.originalUrl} not found`
        });
    }

    // Otherwise, redirect to home or show a custom 404 page
    // For now, let's just go back to home
    res.redirect('/');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ============================================
// START SERVER
// ============================================

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Connect to database and start server
const startServer = async () => {
    try {
        // Initialize Database Tables
        // The User model init is called automatically on require, but we can ensure DB check here
        // db.pool.connect() is enough to test
        console.log('✅ Connected to Neon PostgreSQL successfully');

        // Ensure Users table exists
        await User.init();
        await Subscriber.init();

        // Start listening for requests ONLY if running directly

        if (require.main === module) {
            app.listen(PORT, () => {
                console.log('');
                console.log('='.repeat(50));
                console.log('🌿 SHUDDHUDARA Backend Server');
                console.log('='.repeat(50));
                console.log(`🚀 Server running on port: ${PORT}`);
                console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
                console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
                console.log(`📊 Health Check: http://localhost:${PORT}/`);
                console.log('='.repeat(50));
                console.log('');
                console.log('📝 Available Endpoints:');
                console.log('   POST   /api/auth/register');
                console.log('   POST   /api/auth/login');
                console.log('   GET    /api/auth/profile (protected)');
                console.log('   POST   /api/auth/logout (protected)');
                console.log('   POST   /api/auth/forgot-password');
                console.log('');
                console.log('💡 Tip: Use Ctrl+C to stop the server');
                console.log('');
            });
        }

    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        // On Vercel, we don't want to kill the process
    }
};

// Start the server or prepare for Vercel
if (require.main === module) {
    // Running locally or as a standalone process
    startServer();
} else {
    // For Vercel, connection pool is managed globally
    // We might log a simple check
    console.log('🚀 Serverless function initialized');
}


// Export the app for Vercel
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});
