// Authentication routes
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'U9n3s4RBJwr5YdMmujWcQdf87xgKwt4r';

// Signup route
router.post('/signup', async (req, res, next) => {
  try {
    const { name, srn, email, password } = req.body;

    // normalize
    const normalizedEmail = email?.toLowerCase();
    const normalizedSrn = srn?.toUpperCase();

    // Validate email domain (use normalizedEmail)
    if (!normalizedEmail || !normalizedEmail.endsWith('@stu.pes.edu')) {
      return res.status(400).json({ ok: false, message: 'Email must be a PES student email (@stu.pes.edu)' });
    }

    // Check if user already exists (use normalized values)
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { srn: normalizedSrn }]
    });

    if (existingUser) {
      return res.status(400).json({ ok: false, message: 'User with this email or SRN already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      srn: srn.toUpperCase(),
      email: email.toLowerCase(),
      passwordHash
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      ok: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        srn: user.srn,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Missing username and password' 
      });
    }

    // Find user by email or SRN
    const user = await User.findOne({
      $or: [
        { email: username.toLowerCase() },
        { srn: username.toUpperCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        ok: false, 
        message: 'User not found.Please create an account.' 
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ 
        ok: false, 
        message: 'Invalid Password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        srn: user.srn,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        links: user.links
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get current user
router.get('/me', async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        ok: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ 
        ok: false, 
        message: 'User not found' 
      });
    }

    res.json({
      ok: true,
      user: {
        id: user._id,
        name: user.name,
        srn: user.srn,
        email: user.email,
        bio: user.bio,
        skills: user.skills,
        links: user.links
      }
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        ok: false, 
        message: 'Invalid token' 
      });
    }
    next(err);
  }
});

module.exports = router;