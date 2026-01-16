const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
// const Invoice = require('./Invoice');

// Initialize models
const models = {
  User,
  // Invoice,
  sequelize
};

// Define associations here
// Example:
// User.hasMany(Invoice);
// Invoice.belongsTo(User);

module.exports = models;
