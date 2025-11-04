// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// small helper to require fields
const requireFields = (fields, body) => {
  for (const f of fields) {
    if (!body[f]) return f;
  }
  return null;
};

// Signup
router.post('/signup', async (req, res) => {
  try {
    console.log('📩 Signup request received:', req.body);

    // basic validation
    const missing = requireFields(['name', 'email', 'password'], req.body);
    if (missing) return res.status(400).json({ message: `Missing field: ${missing}` });

    const { name, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create user
    const user = await User.create({ name, email, password: hashedPassword });

    // ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // sign token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // respond
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    // return helpful message during development
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('🔑 Login request received:', req.body);

    // basic validation
    const missing = requireFields(['email', 'password'], req.body);
    if (missing) return res.status(400).json({ message: `Missing field: ${missing}` });

    const { email, password } = req.body;

    // find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // sign token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

export default router;
