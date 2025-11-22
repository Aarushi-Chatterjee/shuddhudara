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
    
    // Connect to MongoDB with recommended options
    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB Connected Successfully: ${connection.connection.host}`);
    console.log(`📊 Database Name: ${connection.connection.name}`);
    
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('💡 Make sure MongoDB is running on your system');
    console.error('   You can start MongoDB with: mongod');
    process.exit(1); // Exit with failure code
  }
};

// Export the connection function
module.exports = connectDatabase;
