const { Pool } = require('pg');

// Create a new pool instance optimized for Neon (serverless Postgres)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon/Serverless Postgres
  },
  max: 5,                      // Limit pool size for serverless
  idleTimeoutMillis: 30000,    // Close idle clients after 30s
  connectionTimeoutMillis: 5000 // Timeout waiting for a connection
});

// Test the connection
pool.connect()
  .then(client => {
    console.log('✅ Connected to Neon PostgreSQL successfully');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Error:', err.stack);
    console.error('👉 Make sure DATABASE_URL is set in your .env file');
  });

// Handle unexpected errors on idle clients (prevents server crash)
pool.on('error', (err) => {
  console.error('⚠️ Unexpected error on idle DB client (non-fatal):', err.message);
});

// Query wrapper with auto-retry on "connection terminated" errors
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (err) {
    // Retry once on connection-related errors (common with Neon's server-side timeouts)
    if (err.message && (err.message.includes('Connection terminated') || err.message.includes('connection timeout') || err.code === 'ECONNRESET')) {
      console.warn('⚠️ DB connection error, retrying once...', err.message);
      return await pool.query(text, params);
    }
    throw err;
  }
};

module.exports = {
  query,
  pool
};
