import bcrypt from 'bcryptjs';

const handleSignin = (req, res, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }

  try {
    const data = db.prepare('SELECT email, hash FROM login WHERE email = ?').get(email);

    if (!data) {
      return res.status(400).json('wrong credentials');
    }

    const isValid = bcrypt.compareSync(password, data.hash);
    if (isValid) {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (user) {
        res.json(user);
      } else {
        res.status(400).json('unable to get user');
      }
    } else {
      res.status(400).json('wrong credentials');
    }
  } catch (err) {
    console.log(err);
    res.status(400).json('wrong credentials');
  }
}

export { handleSignin };
