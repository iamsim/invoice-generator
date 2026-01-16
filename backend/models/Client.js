const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Client = sequelize.define('Client', {
  client_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'client_id'
  },
  client_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'client_name',
    validate: {
      notEmpty: true
    }
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'contact_email',
    validate: {
      isEmail: true
    }
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'contact_phone'
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'address'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Define associations
Client.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

User.hasMany(Client, {
  foreignKey: 'created_by',
  as: 'clients'
});

module.exports = Client;
