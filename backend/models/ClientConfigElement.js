const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ClientConfig = require('./ClientConfig');
const InvoiceElement = require('./InvoiceElement');
const User = require('./User');

const ClientConfigElement = sequelize.define('ClientConfigElement', {
  config_element_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'config_element_id'
  },
  config_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'config_id',
    references: {
      model: 'client_configs',
      key: 'config_id'
    }
  },
  element_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'element_id',
    references: {
      model: 'invoice_elements',
      key: 'element_id'
    }
  },
  default_value: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'default_value',
    // Can store JSON as text, or use DataTypes.JSONB for PostgreSQL
    get() {
      const value = this.getDataValue('default_value');
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // Return as string if not valid JSON
      }
    },
    set(value) {
      if (value && typeof value === 'object') {
        this.setDataValue('default_value', JSON.stringify(value));
      } else {
        this.setDataValue('default_value', value);
      }
    }
  },
  is_required: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_required'
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'display_order'
  },
  added_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'added_by',
    references: {
      model: 'users',
      key: 'user_id'
    }
  }
}, {
  tableName: 'client_config_elements',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: false, // Only added_at, no updated_at
  underscored: true
});

// Define associations
ClientConfigElement.belongsTo(ClientConfig, {
  foreignKey: 'config_id',
  as: 'config'
});

ClientConfigElement.belongsTo(InvoiceElement, {
  foreignKey: 'element_id',
  as: 'element'
});

ClientConfigElement.belongsTo(User, {
  foreignKey: 'added_by',
  as: 'addedBy'
});

ClientConfig.hasMany(ClientConfigElement, {
  foreignKey: 'config_id',
  as: 'elements'
});

InvoiceElement.hasMany(ClientConfigElement, {
  foreignKey: 'element_id',
  as: 'configElements'
});

User.hasMany(ClientConfigElement, {
  foreignKey: 'added_by',
  as: 'addedConfigElements'
});

module.exports = ClientConfigElement;
