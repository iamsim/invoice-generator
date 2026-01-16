const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Client routes
router.use('/', clientRoutes);

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'API routes are working!' });
});

module.exports = router;
