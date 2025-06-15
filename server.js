// server.js
require('dotenv').config();              // 1️⃣  Load .env first

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();

// ── Global middleware ───────────────────────────────────────
app.use(cors());
app.use(express.json());                           // parse application/json
app.use(express.urlencoded({ extended: true }));   // parse form‑urlencoded
app.use(express.static('public'));                 // serve files from /public

// ── Database connection ────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);                               // stop server if DB fails
  });

// ── Routes ─────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
app.use(authRoutes);   // <‑‑  Now POST /register works directly

// Optionally, a simple health check
app.get('/', (_, res) => res.send('API running 🚀'));

// ── Start server ───────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
