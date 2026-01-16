const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Invoice = require('./Invoice');
const InvoiceElement = require('./InvoiceElement');

const InvoiceElementValue = sequelize.define('InvoiceElementValue', {
  value_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'value_id'
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'invoice_id',
    references: {
      model: 'invoices',
      key: 'invoice_id'
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
  element_value: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'element_value',
    // Can store JSON as text, or use DataTypes.JSONB for PostgreSQL
    get() {
      const value = this.getDataValue('element_value');
      if (!value) return null;
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // Return as string if not valid JSON
      }
    },
    set(value) {
      if (value && typeof value === 'object') {
        this.setDataValue('element_value', JSON.stringify(value));
      } else {
        this.setDataValue('element_value', value);
      }
    }
  }
}, {
  tableName: 'invoice_element_values',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

// Define associations
InvoiceElementValue.belongsTo(Invoice, {
  foreignKey: 'invoice_id',
  as: 'invoice'
});

InvoiceElementValue.belongsTo(InvoiceElement, {
  foreignKey: 'element_id',
  as: 'element'
});

Invoice.hasMany(InvoiceElementValue, {
  foreignKey: 'invoice_id',
  as: 'elementValues'
});

InvoiceElement.hasMany(InvoiceElementValue, {
  foreignKey: 'element_id',
  as: 'values'
});

module.exports = InvoiceElementValue;
