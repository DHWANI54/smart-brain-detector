import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import detectPort from 'detect-port'; 
import db from './db.js';
import { handleRegister } from './controllers/register.js';
import { handleSignin } from './controllers/signin.js';

const app = express();

app.use(cors());
app.use(bodyParser.json());


const DEFAULT_PORT = 3000;
let PORT;


app.get('/', (req, res) => res.send('Backend is running'));

app.get('/config', (req, res) => {
  res.json({ apiBaseUrl: `http://localhost:${PORT}` });
});

app.post('/signin', (req, res) => handleSignin(req, res, db));
app.post('/register', (req, res) => handleRegister(req, res, db));

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = $1', [id])
    .then(result => {
      if (result.rows.length) res.json(result.rows[0]);
      else res.status(400).json('User not found');
    })
    .catch(() => res.status(400).json('Error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db.query(
    'UPDATE users SET entries = entries + 1 WHERE id = $1 RETURNING entries',
    [id]
  )
    .then(result => {
      if (result.rows.length) res.json(result.rows[0].entries);
      else res.status(400).json('User not found');
    })
    .catch(() => res.status(400).json('Unable to update entries'));
});


detectPort(DEFAULT_PORT).then((availablePort) => {
  PORT = availablePort;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});
