// database.js - MongoDB Connection Configuration
// This file handles the database connection for the SHUDDHUDARA application

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * This function establishes a connection to MongoDB using Mongoose
 * It reads the connection string from environment variables
 */
const connectDatabase = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shuddhudara';

    // Connect to MongoDB
    // Note: Mongoose 7+ handles useNewUrlParser and useUnifiedTopology internally
    const connection = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected Successfully: ${connection.connection.host}`);
    console.log(`📊 Database Name: ${connection.connection.name}`);

    return connection;
  } catch (error) {
    // If connection fails, log the error and exit the process
    const maskedURI = process.env.MONGODB_URI
      ? process.env.MONGODB_URI.replace(/:([^:@]{1,})@/, ':****@')
      : 'localhost';

    console.error('❌ MongoDB Connection Error:', error.message);
    console.error(`📍 Attempted URI: ${maskedURI}`);
    console.error('💡 Make sure MongoDB is running on your system');
    console.error('   You can start MongoDB with: mongod');

    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ Critical error: MONGODB_URI might be missing or incorrect.');
      console.error('📊 If this is Vercel, please check your Environment Variables.');
    }
    // Don't exit process in serverless env, just throw to let the request fail
    throw error;
  }
};


// Export the connection function
module.exports = connectDatabase;
