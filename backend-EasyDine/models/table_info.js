const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const TableInfo = sequelize.define('table_info', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('booked', 'available'),
    defaultValue: 'available',
  },
}, {
  tableName: 'table_info',
  timestamps: false,
});

module.exports = TableInfo;