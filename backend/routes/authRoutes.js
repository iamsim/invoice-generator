const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user for development (replace with database query)
const mockUser = {
  id: 1,
  email: 'demo@example.com',
  password: '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', // password: "password"
  name: 'Demo User'
};

// Hash password for demo (in production, this would be in database)
// For demo purposes, we'll use a simple check
const DEMO_PASSWORD = 'password';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Mock authentication (replace with database query)
    // For demo: accept demo@example.com / password
    if (email === 'demo@example.com' && password === DEMO_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { userId: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        { expiresIn: '7d' }
      );

      return res.json({
        message: 'Login successful',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name
        },
        token
      });
    }

    // Invalid credentials
    return res.status(401).json({ 
      message: 'Invalid email or password' 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
});

// Register endpoint (placeholder)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        message: 'Email, password, and name are required' 
      });
    }

    // In production, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Create user in database
    // 4. Generate JWT token
    // 5. Return user and token

    return res.status(501).json({ 
      message: 'Registration not implemented yet' 
    });
  } catch (error) {
    console.error('Register error:', error);
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
