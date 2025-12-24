const express = require('express');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const { sendMail } = require('../config/mail');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'U9n3s4RBJwr5YdMmujWcQdf87xgKwt4r';

// Auth middleware
const authenticate = async (req, res, next) => {
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

// Get posts with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { filterType, userId } = req.query;
    let query = {};
    
    switch(filterType) {
      case 'Available':
        // Posts that haven't found teammates and aren't deleted
        query = { 
          foundTeammate: false,
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        };
        break;
        
      case 'Created By Me':
        // Posts created by the current user
        if (userId) {
          query = { 
            authorId: userId,
            $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
          };
        } else {
          // If no userId provided, return empty
          query = { _id: null };
        }
        break;
        
      case 'Stopped':
        // Posts that found teammates or are deleted
        query = { 
          $or: [
            { foundTeammate: true },
            { isDeleted: true }
          ]
        };
        break;
        
      case 'All':
      default:
        // All posts that aren't deleted
        query = { 
          $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }]
        };
        break;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    // Populate author info
    const postsWithAuthors = await Promise.all(
      posts.map(async (post) => {
        const author = await User.findById(post.authorId).select('name srn email');
        return {
          id: post._id,
          eventName: post.eventName,
          eventDate: post.eventDate,
          text: post.description,
          foundTeammate: post.foundTeammate || false,
          author: {
            id: author._id,
            name: author.name,
            srn: author.srn,
            username: author.srn,
            email: author.email
          },
          createdAt: post.createdAt
        };
      })
    );

    res.json({
      ok: true,
      posts: postsWithAuthors
    });
  } catch (err) {
    next(err);
  }
});

// Create new post
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { eventName, eventDate, text } = req.body;

    if (!eventName || !text) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Missing required fields: eventName, text' 
      });
    }

    const post = new Post({
      authorId: req.userId,
      eventName,
      eventDate: eventDate || null,
      description: text
    });

    await post.save();

    // Get author info for response
    const author = await User.findById(req.userId).select('name srn email');

    res.status(201).json({
      ok: true,
      post: {
        id: post._id,
        eventName: post.eventName,
        eventDate: post.eventDate,
        text: post.description,
        author: {
          id: author._id,
          name: author.name,
          srn: author.srn,
          username: author.srn,
          email: author.email
        },
        createdAt: post.createdAt
      }
    });
  } catch (err) {
    next(err);
  }
});

// Express interest in a post
router.post('/:postId/interest', authenticate, async (req, res, next) => {
  try {
    const { postId } = req.params;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Post not found' 
      });
    }

    // Get author and interested user info
    const author = await User.findById(post.authorId);
    const interestedUser = await User.findById(req.userId);

    if (!author || !interestedUser) {
      return res.status(404).json({ 
        ok: false, 
        message: 'User not found' 
      });
    }

    // Don't allow users to be interested in their own posts
    if (post.authorId.toString() === req.userId) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Cannot express interest in your own post' 
      });
    }

    // Check if already interested
    const alreadyInterested = interestedUser.interests?.some(
      interest => interest.postId.toString() === postId
    );
    
    if (alreadyInterested) {
      return res.status(400).json({ 
        ok: false, 
        message: 'You have already expressed interest in this post' 
      });
    }

    // Send email notification
    const subject = `${interestedUser.name} is interested in your post!`;
    const text = `Hi ${author.name},

${interestedUser.name} (${interestedUser.srn}) is interested in joining your team for "${post.eventName}"!

Their details:
- Name: ${interestedUser.name}
- SRN: ${interestedUser.srn}
- Email: ${interestedUser.email}
${interestedUser.skills?.length ? `- Skills: ${interestedUser.skills.join(', ')}` : ''}

Reach out to them to discuss further!

Best regards,
SquadSync Team`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Team Interest! 🎉</h2>
        <p>Hi ${author.name},</p>
        <p><strong>${interestedUser.name}</strong> is interested in joining your team for "<strong>${post.eventName}</strong>"!</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4b5563;">Contact Details:</h3>
          <p><strong>Name:</strong> ${interestedUser.name}</p>
          <p><strong>SRN:</strong> ${interestedUser.srn}</p>
          <p><strong>Email:</strong> <a href="mailto:${interestedUser.email}">${interestedUser.email}</a></p>
          ${interestedUser.skills?.length ? `<p><strong>Skills:</strong> ${interestedUser.skills.join(', ')}</p>` : ''}
        </div>
        
        <p>Reach out to them to discuss collaboration!</p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          SquadSync Team 🚀
        </p>
      </div>
    `;

    try {
      await sendMail(author.email, subject, text, html);
      
      // Track the interest
      interestedUser.interests.push({
        postId: post._id,
        userId: post.authorId,
        sentAt: new Date()
      });
      interestedUser.interestsSent = (interestedUser.interestsSent || 0) + 1;
      await interestedUser.save();
      
      res.json({
        ok: true,
        message: 'Interest notification sent successfully',
        stats: {
          interestsSent: interestedUser.interestsSent
        }
      });
    } catch (emailErr) {
      console.error('Email sending failed:', emailErr);
      res.status(500).json({
        ok: false,
        message: 'Failed to send email notification'
      });
    }
  } catch (err) {
    next(err);
  }
});

// Mark post as teammate found
router.patch('/:postId/mark-found', authenticate, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Post not found' 
      });
    }

    // Check if user is the author
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ 
        ok: false, 
        message: 'You can only mark your own posts' 
      });
    }

    post.foundTeammate = true;
    await post.save();

    res.json({
      ok: true,
      message: 'Post marked as found teammate',
      post: {
        id: post._id,
        foundTeammate: post.foundTeammate
      }
    });
  } catch (err) {
    next(err);
  }
});

// Delete post (soft delete)
router.delete('/:postId', authenticate, async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        ok: false, 
        message: 'Post not found' 
      });
    }

    // Check if user is the author
    if (post.authorId.toString() !== req.userId) {
      return res.status(403).json({ 
        ok: false, 
        message: 'You can only delete your own posts' 
      });
    }

    post.isDeleted = true;
    await post.save();

    res.json({
      ok: true,
      message: 'Post deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;