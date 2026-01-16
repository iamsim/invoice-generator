const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const InvoiceElement = sequelize.define('InvoiceElement', {
  element_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'element_id'
  },
  element_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'element_name',
    validate: {
      notEmpty: true
    }
  },
  element_type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'element_type',
    validate: {
      isIn: [['line_item', 'tax', 'discount', 'header', 'footer']]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  is_system_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    field: 'is_system_default'
  }
}, {
  tableName: 'invoice_elements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // Only created_at, no updated_at
  underscored: true
});

module.exports = InvoiceElement;
