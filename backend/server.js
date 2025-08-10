const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Needed for Render's managed PostgreSQL
      },
    })
  : new Pool({
      user: process.env.DB_USER || 'your_username',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'keeper_app',
      password: process.env.DB_PASSWORD || 'your_password',
      port: process.env.DB_PORT || 5432,
    });

// Create notes table if it doesn't exist
const createTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Notes table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

createTable();

// Routes...

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
