import bcrypt from 'bcryptjs';

const handleRegister = async (req, res, db) => {
  const { name, email, password } = req.body;
  console.log('Register request body:', req.body);

  if (!name || !email || !password) {
    console.log('Missing field(s) in registration');
    return res.status(400).json('All fields are required');
  }

  const hash = bcrypt.hashSync(password, 10);
  console.log('Password hash generated');

  try {
    await db.query('BEGIN');

    
    const existing = await db.query('SELECT email FROM login WHERE email = $1', [email]);
    if (existing.rows.length) {
      await db.query('ROLLBACK');
      console.log('Email already registered:', email);
      return res.status(400).json('Email already exists');
    }

   
    const loginResult = await db.query(
      'INSERT INTO login (hash, email) VALUES ($1, $2) RETURNING email',
      [hash, email]
    );
    const loginEmail = loginResult.rows[0].email;
    console.log('Inserted into login:', loginEmail);

    
    const userResult = await db.query(
      'INSERT INTO users (name, email, joined) VALUES ($1, $2, $3) RETURNING id, name, email, joined',
      [name, loginEmail, new Date()]
    );
    console.log('Inserted into users:', userResult.rows[0]);

    await db.query('COMMIT');
    res.json(userResult.rows[0]);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error('Error during registration:', err.message || err);
    res.status(400).json('Registration failed. Check console.');
  }
};

export { handleRegister };
