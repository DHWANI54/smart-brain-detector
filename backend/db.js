import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('database.db');

// Initialize tables
const createUsers = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    entries INTEGER DEFAULT 0,
    joined DATETIME
  )
`;

const createLogin = `
  CREATE TABLE IF NOT EXISTS login (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hash TEXT,
    email TEXT UNIQUE
  )
`;

db.exec(createUsers);
db.exec(createLogin);

// Seed default test user
const seedUser = () => {
  const email = 'demo@gmail.com'; // Easy to remember
  const password = 'demo';          // Easy to remember
  const name = 'Demo User';

  const userExists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

  if (!userExists) {
    console.log('🌱 Seeding demo user...');
    const hash = bcrypt.hashSync(password, 10); // Standard salt rounds

    const insertUser = db.prepare('INSERT INTO users (name, email, joined) VALUES (?, ?, ?)');
    const insertLogin = db.prepare('INSERT INTO login (email, hash) VALUES (?, ?)');

    const transaction = db.transaction(() => {
      insertUser.run(name, email, new Date().toISOString());
      insertLogin.run(email, hash);
    });

    try {
      transaction();
      console.log(`✅ Demo user created: ${email} / ${password}`);
    } catch (err) {
      console.error('❌ Failed to seed demo user:', err.message);
    }
  }
};

seedUser();

export default db;
