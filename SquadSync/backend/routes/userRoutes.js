const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'U9n3s4RBJwr5YdMmujWcQdf87xgKwt4r';

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        ok: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ 
      ok: false, 
      message: 'Invalid token' 
    });
  }
};

// Get user statistics
router.get('/stats/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        ok: false, 
        message: 'User not found' 
      });
    }

    // Count posts created by user
    const postsCount = await Post.countDocuments({ authorId: req.userId });

    res.json({
      ok: true,
      stats: {
        postsCreated: postsCount,
        interestsSent: user.interestsSent || 0,
        teamsJoined: 0
      }
    });
  } catch (err) {
    next(err);
  }
});

// Update user profile
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { bio, skills, links } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        ok: false, 
        message: 'User not found' 
      });
    }

    if (bio !== undefined) {
      user.bio = bio;
    }
    
    if (skills !== undefined) {
      if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(s => s);
      } else if (Array.isArray(skills)) {
        user.skills = skills;
      }
    }
    
    if (links !== undefined) {
      user.links = { github: links.github || user.links?.github || '', linkedin: links.linkedin || user.links?.linkedin || '' };
    }

    await user.save();

    res.json({
      ok: true,
      message: 'Profile updated successfully',
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

// Get user by ID
router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-passwordHash');
    
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
    next(err);
  }
});

module.exports = router;
