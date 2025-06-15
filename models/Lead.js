const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
});

module.exports = mongoose.model('Lead', leadSchema);
