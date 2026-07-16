// netlify/functions/api.js
// BIN SALEH Store — Netlify Function (replaces standalone Express server)
// This runs the entire backend as a serverless function on Netlify

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');

const app = express();

// ---------- MongoDB Connection (cached for serverless) ----------
let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  if (process.env.MONGO_URI) {
    cachedDb = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } else {
    console.warn('⚠️ MONGO_URI not set — running without database');
  }
  return cachedDb;
}

// ---------- Middleware ----------
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- Health Check ----------
app.get('/', (req, res) => {
  res.json({ message: 'BIN SALEH Store API is running 🚀' });
});

// ---------- Routes ----------
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));

// ---------- 404 Handler ----------
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// ---------- Netlify Function Handler ----------
// serverless-http wraps the Express app and creates a Netlify-compatible handler
const handler = serverless(app);

exports.handler = async (event, context) => {
  // Connect to MongoDB on each invocation (uses cached connection)
  await connectDB();
  return await handler(event, context);
};
