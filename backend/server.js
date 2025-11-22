// server.js - Main Express Server
// This is the entry point for the SHUDDHUDARA backend application

// Import required packages
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import database connection
const connectDatabase = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE CONFIGURATION
// ============================================

// Enable CORS (Cross-Origin Resource Sharing)
// This allows the frontend to communicate with the backend
app.use(cors({
    origin: '*', // In production, replace with your frontend URL
    credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware (for development)
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.path}`);
    next();
});

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: '🌱 Welcome to SHUDDHUDARA API',
        version: '1.0.0',
        status: 'Server is running'
    });
});

// Authentication routes
// All these routes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route not found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
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
        // Connect to MongoDB
        await connectDatabase();

        // Start listening for requests
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

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    console.log('Shutting down server...');
    process.exit(1);
});
