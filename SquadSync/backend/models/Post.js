const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventName: { type: String, required: true },
  eventDate: { type: Date },
  description: { type: String, required: true },
  foundTeammate: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

// index for faster lookups by author
postSchema.index({ authorId: 1 });

module.exports = mongoose.model('Post', postSchema);