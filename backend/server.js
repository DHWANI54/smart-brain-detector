import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './db.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Backend is running with SQLite'));

// Helper to handle sqlite errors
const handleDbError = (res, err) => {
  console.error(err);
  res.status(400).json('Database error');
};

app.post('/signin', (req, res) => handleSignin(req, res, db));
app.post('/register', (req, res) => handleRegister(req, res, db));

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json('User not found');
    }
  } catch (err) {
    handleDbError(res, err);
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  try {
    // Run update and get new entries count
    // better-sqlite3 run() returns changes, not rows, unless we select after
    // or use RETURNING if supported. To be safe, we'll separate.
    const stmt = db.prepare('UPDATE users SET entries = entries + 1 WHERE id = ?');
    const info = stmt.run(id);

    if (info.changes > 0) {
      const user = db.prepare('SELECT entries FROM users WHERE id = ?').get(id);
      res.json(user.entries);
    } else {
      res.status(400).json('User not found');
    }
  } catch (err) {
    handleDbError(res, err);
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
