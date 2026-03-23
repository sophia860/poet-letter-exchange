require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const letterRoutes = require('./routes/letters');
const profileRoutes = require('./routes/profiles');
const { scheduleMorningMatch } = require('./jobs/morningMatch');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/profiles', profileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.');

    // Schedule the daily matching cron job
    scheduleMorningMatch();

    app.listen(PORT, () => {
      console.log(`Poet Letter Exchange running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
