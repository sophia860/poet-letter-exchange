const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Letter = require('../models/Letter');
const Match = require('../models/Match');

const router = express.Router();

// GET /api/profiles/me - Get own profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profiles/me - Update own profile
router.put('/me', auth, async (req, res) => {
  try {
    const { displayName, bio, interests, themes, optedInToLetters, timezone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { displayName, bio, interests, themes, optedInToLetters, timezone },
      { new: true, runValidators: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profiles/:userId - View another poet's profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('displayName bio interests themes followers following lettersSent likesReceived createdAt');
    if (!user) return res.status(404).json({ error: 'Poet not found.' });

    const letters = await Letter.find({ author: req.params.userId, available: true })
      .sort({ createdAt: -1 })
      .limit(10);

    // Track profile click from today's match
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await Match.findOneAndUpdate(
      { recipient: req.userId, sender: req.params.userId, date: today },
      { profileClicked: true }
    );

    res.json({ poet: user, recentLetters: letters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profiles/:userId/follow - Follow a poet
router.post('/:userId/follow', auth, async (req, res) => {
  try {
    if (req.params.userId === req.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself.' });
    }

    await User.findByIdAndUpdate(req.userId, { $addToSet: { following: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $addToSet: { followers: req.userId } });

    res.json({ message: 'Followed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/profiles/:userId/unfollow - Unfollow a poet
router.post('/:userId/unfollow', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { $pull: { following: req.params.userId } });
    await User.findByIdAndUpdate(req.params.userId, { $pull: { followers: req.userId } });

    res.json({ message: 'Unfollowed.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
