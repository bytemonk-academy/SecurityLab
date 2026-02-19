/**
 * SQL INJECTION LAB — VULNERABLE BACKEND (PostgreSQL Version)
 * For educational use only.
 */

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const { db, initDb } = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: 'sql-injection-lab-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.redirect('/index.html');
});




// ---------- VULNERABLE LOGIN ----------
app.post('/login', async (req, res) => {
  const email = (req.body.email || req.body.username || '').trim();
  const password = (req.body.password || '').trim();

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // ❌ Intentionally vulnerable
  const sql = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  let user;
  try {
    user = await db.get(sql);
  } catch (err) {
    console.error('SQL error:', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  res.json({
    redirect: '/dashboard.html',
    user: {
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});

// ---------- VULNERABLE SIGNUP ----------
app.post('/signup', async (req, res) => {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();
  const password = (req.body.password || '').trim();

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email and password required' });
  }

  // ❌ Intentionally vulnerable
  const sql = `
    INSERT INTO users (username, email, password, role)
    VALUES ('${username}', '${email}', '${password}', 'user')
  `;

  try {
    await db.run(sql);
  } catch (err) {
    // ✅ PostgreSQL unique violation code
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' });
    }

    console.error('SQL error:', err.message);
    return res.status(500).json({ error: 'Signup failed' });
  }

  req.session.user = { username, email, role: 'user' };

  res.json({
    redirect: '/dashboard.html',
    user: { username, email, role: 'user' },
  });
});

// ---------- DASHBOARD ----------
app.post('/dashboard', (req, res) => {
  const user = req.session && req.session.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    username: user.username,
    email: user.email,
    role: user.role,
  });
});

// ---------- ADMIN PANEL ----------
app.get('/admin', async (req, res) => {
  const user = req.session && req.session.user;

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }

  const users = await db.all(
    'SELECT id, username, email, role FROM users'
  );

  res.json({
    message: 'Admin panel',
    flag: 'LAB5_SQLi_Admin_Bypass_Success',
    users,
  });
});

// ---------- VULNERABLE SEARCH (PostgreSQL UNION injection compatible) ----------
app.get('/api/search', async (req, res) => {
  const q = (req.query.q || req.query.email || '').trim();

  // ❌ Intentionally vulnerable
  const sql = `
    SELECT id, email
    FROM users
    WHERE email LIKE '%${q}%'
  `;

  try {
    const rows = await db.all(sql);
    res.json({ results: rows });
  } catch (err) {
    console.error('SQL error:', err.message);
    return res.status(500).json({
      error: 'Search failed',
      details: err.message,
    });
  }
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ redirect: '/index.html' });
});

// Start server
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`SQL Injection Lab backend running at http://localhost:${port}`);
      console.log("Try bypass: admin' --  or  ' OR 1=1 --");
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err.message);
    console.error('Check your .env: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  });
