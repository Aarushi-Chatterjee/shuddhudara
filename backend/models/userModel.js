// userModel.js - User Database Schema
// This file defines the structure of user data in MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema Definition
 * Defines what information we store for each user
 */
const userSchema = new mongoose.Schema({
    // Username field - must be unique and required
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true, // Remove whitespace from both ends
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },

    // Email field - must be unique, required, and valid format
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        unique: true,
        lowercase: true, // Convert to lowercase
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email address'
        ]
    },

    // Password field - will be hashed before saving
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't include password by default in queries
    },

    // Account creation timestamp
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Last login timestamp
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    // Add automatic timestamps for updates
    timestamps: true
});

/**
 * Pre-save Hook - Hash Password Before Saving
 * This runs automatically before a user document is saved to the database
 */
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt (random data) for hashing
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);

        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to Compare Passwords
 * Used during login to check if the entered password matches the stored hash
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Method to Update Last Login Time
 * Call this when a user successfully logs in
 */
userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save();
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
