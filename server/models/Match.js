const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  letter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Letter',
    required: true
  },
  opened: {
    type: Boolean,
    default: false
  },
  openedAt: {
    type: Date
  },
  liked: {
    type: Boolean,
    default: false
  },
  profileClicked: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

matchSchema.index({ date: 1, recipient: 1 }, { unique: true });
matchSchema.index({ date: 1, sender: 1 });

module.exports = mongoose.model('Match', matchSchema);
