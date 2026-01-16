const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Example route
router.get('/', (req, res) => {
  res.json({ message: 'API routes are working!' });
});

module.exports = router;
