const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const repository = require('../data/repository');

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullname: user.fullname },
    process.env.JWT_SECRET || 'development_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await repository.findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function register(req, res, next) {
  try {
    const { fullname, email, password, role = 'doctor' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await repository.createUser({ fullname, email, password: hashedPassword, role });

    res.status(201).json({
      message: 'User registered successfully',
      userId
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    next(error);
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { login, register, me };
