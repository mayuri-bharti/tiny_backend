import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[A-Za-z0-9]{6,8}$/
  },
  targetUrl: {
    type: String,
    required: true,
    trim: true
  },
  totalClicks: {
    type: Number,
    default: 0
  },
  lastClicked: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Link', linkSchema);


