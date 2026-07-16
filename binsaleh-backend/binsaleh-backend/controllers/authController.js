// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Built-in fallback secrets so the app works without env vars
// In production, set these as environment variables to override
const JWT_SECRET = process.env.JWT_SECRET || 'bs_jwt_secret_binsaleh_2026_secure_key';
const ADMIN_SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'Binsaleh_products_services';

// JWT token banane ka helper
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/register
// profile.html ke signup-form se match karta hai
exports.register = async (req, res) => {
   console.log("BODY:", req.body);
  try {
    const { name, email, password, newsletter } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Password ko hash karna — kabhi bhi plain text save nahi karna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      newsletter: !!newsletter
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
// profile.html ke signin-form se match karta hai
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

console.log("Email entered:", email);
console.log("User from DB:", user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password matched:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
// Current logged-in user ka data (profile.html ke renderAuthState ke liye)
// Ye route "protect" middleware ke peeche hoga
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/newsletter/subscribe
// Email subscription for the homepage newsletter form
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Check if user already exists with this email
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.newsletter) {
        return res.json({ message: 'Already subscribed! Thank you.' });
      }
      // Update existing user to subscribe to newsletter
      existing.newsletter = true;
      await existing.save();
      return res.json({ message: 'Subscribed successfully!' });
    }

    // Create a minimal user entry for newsletter only
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(email + JWT_SECRET, salt);

    await User.create({
      name: email.split('@')[0],
      email: email.toLowerCase(),
      password: hashedPassword,
      newsletter: true,
      role: 'customer'
    });

    res.status(201).json({ message: 'Subscribed successfully! Welcome to BIN SALEH 🎉' });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({ message: 'Already subscribed! Thank you.' });
    }
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/register-admin
// Admin panel se admin registration ke liye.
// Setup key match karna zaroori hai — JWT_SECRET ya ADMIN_SETUP_KEY env mein.
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;

    if (!setupKey || setupKey !== ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: 'Invalid admin setup key.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'admin', // 👈 admin role set
      newsletter: false
    });

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
