import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('Environment variables:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'Exists' : 'Missing',
  NODE_ENV: process.env.NODE_ENV || 'development'
});

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL is not defined in .env');
  console.log('💡 Tip: Create a .env file with DATABASE_URL="postgresql://user:pass@localhost:5432/dbname"');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Database connection successful. Current time:', result.rows[0].current_time);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Check:');
    console.log('1. Is PostgreSQL running? (run `sudo service postgresql start` on Linux)');
    console.log('2. Are the credentials in DATABASE_URL correct?');
    console.log('3. Does the database exist? (run `CREATE DATABASE your_database` in psql)');
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection();