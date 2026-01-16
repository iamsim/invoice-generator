const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Client, User } = require('../models');

// Middleware to get current user from JWT token
const getCurrentUser = async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );
    
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get clients list with pagination
router.get('/clients-list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    // Build where clause for search
    const whereClause = {
      is_active: true
    };

    if (search) {
      whereClause[Op.or] = [
        { client_name: { [Op.iLike]: `%${search}%` } },
        { contact_email: { [Op.iLike]: `%${search}%` } },
        { contact_phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Get total count for pagination
    const totalCount = await Client.count({ where: whereClause });

    // Get clients with pagination
    const clients = await Client.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'email']
        }
      ],
      limit,
      offset,
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(totalCount / limit);

    return res.json({
      success: true,
      data: clients,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create a new client
router.post('/clients', getCurrentUser, async (req, res) => {
  try {
    const { client_name, contact_email, contact_phone, address } = req.body;

    // Validate required fields
    if (!client_name) {
      return res.status(400).json({
        success: false,
        message: 'Client name is required'
      });
    }

    // Validate email format if provided
    if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Create client
    const client = await Client.create({
      client_name,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
      address: address || null,
      created_by: req.userId,
      is_active: true
    });

    // Fetch client with creator info
    const clientWithCreator = await Client.findByPk(client.client_id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['user_id', 'name', 'email']
        }
      ]
    });

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: clientWithCreator
    });
  } catch (error) {
    console.error('Error creating client:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map(e => e.message).join(', ')
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Client with this name already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
