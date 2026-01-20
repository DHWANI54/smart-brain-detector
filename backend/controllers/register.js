import bcrypt from 'bcryptjs';

const handleRegister = (req, res, db) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission');
  }

  const hash = bcrypt.hashSync(password);

  const registerTransaction = db.transaction(() => {
    const existing = db.prepare('SELECT email FROM login WHERE email = ?').get(email);
    if (existing) {
      throw new Error('Email already exists');
    }

    db.prepare('INSERT INTO login (hash, email) VALUES (?, ?)').run(hash, email);

    const info = db.prepare('INSERT INTO users (email, name, joined) VALUES (?, ?, ?)')
      .run(email, name, new Date().toISOString());

    return db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
  });

  try {
    const user = registerTransaction();
    res.json(user);
  } catch (err) {
    if (err.message === 'Email already exists') {
      res.status(400).json('Email already exists');
    } else {
      console.log(err);
      res.status(400).json('unable to register');
    }
  }
};

export { handleRegister };
