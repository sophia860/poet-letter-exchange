const User = require('../models/User');
const Letter = require('../models/Letter');
const Match = require('../models/Match');

/**
 * Daily matching engine.
 * For each opted-in poet, pick a letter from a different poet
 * they haven't received recently, and create a Match record.
 */
async function runDailyMatching() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all opted-in users
  const optedInUsers = await User.find({ optedInToLetters: true });

  if (optedInUsers.length < 2) {
    console.log('Not enough opted-in users for matching.');
    return [];
  }

  // Get available letters (one per author, prefer letters not sent too often)
  const availableLetters = await Letter.find({ available: true })
    .sort({ timesDelivered: 1, createdAt: -1 });

  // Build a map of author -> letters
  const lettersByAuthor = {};
  for (const letter of availableLetters) {
    const authorId = letter.author.toString();
    if (!lettersByAuthor[authorId]) {
      lettersByAuthor[authorId] = [];
    }
    lettersByAuthor[authorId].push(letter);
  }

  // Recent matches to avoid repeats (last 7 days)
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recentMatches = await Match.find({ date: { $gte: weekAgo } });

  const recentPairs = new Set();
  for (const m of recentMatches) {
    recentPairs.add(`${m.recipient}-${m.sender}`);
  }

  // Shuffle users for fairness
  const shuffled = [...optedInUsers].sort(() => Math.random() - 0.5);
  const matches = [];
  const usedLetters = new Set();

  for (const recipient of shuffled) {
    const recipientId = recipient._id.toString();

    // Find a letter from someone else, not recently matched
    let bestLetter = null;

    for (const letter of availableLetters) {
      const authorId = letter.author.toString();
      const letterId = letter._id.toString();

      if (authorId === recipientId) continue;
      if (usedLetters.has(letterId)) continue;
      if (recentPairs.has(`${recipientId}-${authorId}`)) continue;

      bestLetter = letter;
      break;
    }

    if (!bestLetter) {
      // Fallback: pick any letter from someone else
      bestLetter = availableLetters.find(
        l => l.author.toString() !== recipientId && !usedLetters.has(l._id.toString())
      );
    }

    if (!bestLetter) continue;

    usedLetters.add(bestLetter._id.toString());

    const match = await Match.create({
      date: today,
      recipient: recipient._id,
      sender: bestLetter.author,
      letter: bestLetter._id
    });

    bestLetter.timesDelivered += 1;
    await bestLetter.save();

    matches.push(match);
  }

  console.log(`Created ${matches.length} matches for ${today.toDateString()}`);
  return matches;
}

module.exports = { runDailyMatching };
