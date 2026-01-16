const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Client = require('./Client');
const ClientConfig = require('./ClientConfig');
const InvoiceElement = require('./InvoiceElement');
const ClientConfigElement = require('./ClientConfigElement');
const Invoice = require('./Invoice');
const InvoiceElementValue = require('./InvoiceElementValue');

// Initialize models
const models = {
  User,
  Client,
  ClientConfig,
  InvoiceElement,
  ClientConfigElement,
  Invoice,
  InvoiceElementValue,
  sequelize
};

// Associations are defined in individual model files

module.exports = models;
