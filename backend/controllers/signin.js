import bcrypt from 'bcryptjs';

const handleSignin = async (req, res, db) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Incorrect form submission');
  }

  try {
    const loginResult = await db.query('SELECT email, hash FROM login WHERE email = $1', [email]);

    if (!loginResult.rows.length) {
      return res.status(400).json('Wrong credentials');
    }

    const isValid = bcrypt.compareSync(password, loginResult.rows[0].hash);

    if (!isValid) {
      return res.status(400).json('Wrong credentials');
    }

    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!userResult.rows.length) {
      return res.status(400).json('User not found');
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json('Unable to sign in');
  }
};

export { handleSignin };
