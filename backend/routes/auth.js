const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, errors: errors.array() });
  }

  const { name, email, password, phone, address } = req.body;

  try {
    console.log('📝 Register attempt:', { name, email });
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('⚠️ User already exists:', email);
      return res.status(400).json({ msg: 'User already exists with this email' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      address,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user
    await user.save();
    console.log('✅ User created:', email);

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT error:', err);
        throw err;
      }
      console.log('✅ Token generated for:', email);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ msg: 'Server error during registration', error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: errors.array()[0].msg, errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    console.log('🔑 Login attempt:', email);
    
    // Find user
    let user = await User.findOne({ email });
    if (!user) {
      console.log('⚠️ User not found:', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('⚠️ Wrong password for:', email);
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Create token
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT error:', err);
        throw err;
      }
      console.log('✅ Login successful:', email);
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      });
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ msg: 'Server error during login', error: err.message });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err) {
    console.error('Error fetching user profile:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;