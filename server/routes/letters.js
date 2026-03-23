const express = require('express');
const auth = require('../middleware/auth');
const Letter = require('../models/Letter');
const Match = require('../models/Match');
const User = require('../models/User');

const router = express.Router();

// POST /api/letters - Submit a new poem-letter
router.post('/', auth, async (req, res) => {
  try {
    const { title, body, tags, form, themes } = req.body;
    const letter = await Letter.create({
      author: req.userId,
      title,
      body,
      tags,
      form,
      themes
    });

    await User.findByIdAndUpdate(req.userId, { $inc: { lettersSent: 1 } });
    res.status(201).json(letter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/letters/inbox - Get today's letter for the logged-in user
router.get('/inbox', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const match = await Match.findOne({
      recipient: req.userId,
      date: today
    }).populate({
      path: 'letter',
      populate: { path: 'author', select: 'displayName bio' }
    });

    if (!match) {
      return res.json({ letter: null, message: 'No letter today. Check back tomorrow!' });
    }

    if (!match.opened) {
      match.opened = true;
      match.openedAt = new Date();
      await match.save();
    }

    res.json({ match, letter: match.letter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/letters/:letterId/like - Like a letter
router.post('/:letterId/like', auth, async (req, res) => {
  try {
    const letter = await Letter.findById(req.params.letterId);
    if (!letter) return res.status(404).json({ error: 'Letter not found.' });

    await letter.addLike(req.userId);

    // Increment author's likesReceived
    await User.findByIdAndUpdate(letter.author, { $inc: { likesReceived: 1 } });

    // Mark match as liked
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Match.findOneAndUpdate(
      { recipient: req.userId, letter: letter._id },
      { liked: true }
    );

    res.json({ likeCount: letter.likeCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/letters/my - Get all letters by the logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const letters = await Letter.find({ author: req.userId }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
