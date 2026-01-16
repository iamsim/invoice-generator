const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Client = require('./Client');
const ClientConfig = require('./ClientConfig');
const User = require('./User');

const Invoice = sequelize.define('Invoice', {
  invoice_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'invoice_id'
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'invoice_number',
    validate: {
      notEmpty: true
    }
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
  config_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'config_id',
    references: {
      model: 'client_configs',
      key: 'config_id'
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
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'draft',
    field: 'status',
    validate: {
      isIn: [['draft', 'active', 'inactive']]
    }
  },
  version_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: 'version_number'
  },
  parent_invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'parent_invoice_id',
    references: {
      model: 'invoices',
      key: 'invoice_id'
    }
  },
  is_current_version: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_current_version'
  },
  activated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'activated_at'
  },
  deactivated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deactivated_at'
  }
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Define associations
Invoice.belongsTo(Client, {
  foreignKey: 'client_id',
  as: 'client'
});

Invoice.belongsTo(ClientConfig, {
  foreignKey: 'config_id',
  as: 'config'
});

Invoice.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

// Self-referencing relationship for versioning
Invoice.belongsTo(Invoice, {
  foreignKey: 'parent_invoice_id',
  as: 'parentInvoice'
});

Invoice.hasMany(Invoice, {
  foreignKey: 'parent_invoice_id',
  as: 'versions'
});

Client.hasMany(Invoice, {
  foreignKey: 'client_id',
  as: 'invoices'
});

ClientConfig.hasMany(Invoice, {
  foreignKey: 'config_id',
  as: 'invoices'
});

User.hasMany(Invoice, {
  foreignKey: 'created_by',
  as: 'invoices'
});

module.exports = Invoice;
