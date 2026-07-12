require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Story = require('./models/Story');
const MathQuestion = require('./models/MathQuestion');
const ActivityLog = require('./models/ActivityLog');

const registerRoutes = require('./routes');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'saajha-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

async function logActivity(userId, action, details = '') {
  if (!userId) return;
  try {
    await ActivityLog.create({ user: userId, action, details });
  } catch (error) {
    console.error('Activity logging failed:', error.message);
  }
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

registerRoutes(app, {
  requireAuth,
  logActivity,
  models: { User, ActivityLog, Story, MathQuestion }
});

app.use((req, res) => {
  res.status(404).render('pages/shared/404', { title: 'Not Found' });
});

const PORT = process.env.PORT || 3003;

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Saajha app running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    console.log('Starting without database connectivity.');
    app.listen(PORT, () => {
      console.log(`Saajha app running on http://localhost:${PORT}`);
    });
  });
