const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'db1',
});

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user'
      )
    `);

    const result = await client.query('SELECT COUNT(*) FROM users');
    const count = parseInt(result.rows[0].count, 10);

    if (count === 0) {
      await client.query(`
        INSERT INTO users (username, email, password, role) VALUES
        ('admin', 'admin@test.com', 'adminpass', 'admin'),
        ('Normal User', 'user@test.com', 'password123', 'user')
      `);
      console.log('Seeded users');
    }

    await client.query(`
      INSERT INTO users (username, email, password, role) VALUES
      ('Admin', 'admin@bytemonk.io', 'admin123', 'admin')
      ON CONFLICT (email) DO UPDATE SET
        username = EXCLUDED.username,
        password = EXCLUDED.password,
        role = EXCLUDED.role
    `);
    console.log('Admin user admin@bytemonk.io ensured');
  } finally {
    client.release();
  }
}

async function get(sql) {
  const result = await pool.query(sql);
  return result.rows[0] ?? null;
}

async function all(sql) {
  const result = await pool.query(sql);
  return result.rows;
}

async function run(sql) {
  await pool.query(sql);
}

module.exports = { db: { get, all, run }, initDb, pool };
