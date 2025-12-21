const { Pool } = require('pg');

// Create a new pool instance with the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon/Serverless Postgres
  }
});

// Test the connection
pool.connect()
  .then(() => console.log('✅ Connected to Neon PostgreSQL successfully'))
  .catch(err => {
    console.error('❌ Database Connection Error:', err.stack);
    console.error('👉 Make sure DATABASE_URL is set in your .env file');
    // Don't exit process here, let server decide
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool // Export pool if needed for transactions
};
