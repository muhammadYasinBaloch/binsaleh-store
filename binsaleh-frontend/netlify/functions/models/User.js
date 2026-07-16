const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  newsletter:{ type: Boolean, default: false },
  role:      { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, {
  timestamps: true
});

userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
