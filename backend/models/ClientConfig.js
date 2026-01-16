const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const Client = require('./Client');

const ClientConfig = sequelize.define('ClientConfig', {
  config_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'config_id'
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'client_id',
    references: {
      model: 'clients',
      key: 'client_id'
    }
  },
  config_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'config_name',
    validate: {
      notEmpty: true
    }
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
  tableName: 'client_configs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Define associations
ClientConfig.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

ClientConfig.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

Client.hasMany(ClientConfig, {
  foreignKey: 'client_id',
  as: 'configs'
});

User.hasMany(ClientConfig, {
  foreignKey: 'created_by',
  as: 'clientConfigs'
});

module.exports = ClientConfig;
