const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../models');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if user has a password set
    if (!user.password_hash) {
      return res.status(401).json({ 
        message: 'Account not properly configured. Please contact administrator.' 
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ 
        message: 'Account is inactive. Please contact administrator.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !name || !role) {
      return res.status(400).json({ 
        message: 'Email, name, and role are required' 
      });
    }

    // Validate role
    if (!['client_admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ 
        message: 'Role must be either "client_admin" or "superadmin"' 
      });
    }

    // Check if user already exists by email or name
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { email },
          { name }
        ]
      } 
    });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email or name already exists' 
      });
    }

    // Create user (password will be hashed by the model hook)
    const user = await User.create({
      email,
      name,
      role,
      password_hash: password || null, // Allow creating user without password
      is_active: true
    });

    // Generate JWT token if password was provided
    let token = null;
    if (password) {
      token = jwt.sign(
        { userId: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );
    }

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Handle Sequelize validation errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: error.errors.map(e => e.message).join(', ') 
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'User with this email or name already exists' 
      });
    }

    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // You could implement token blacklisting here if needed
  res.json({ message: 'Logout successful' });
});

module.exports = router;
