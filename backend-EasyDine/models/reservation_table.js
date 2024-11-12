const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reservation_table', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    reservation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'order_detail',
        key: 'id'
      }
    },
    table_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'table_info',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'reservation_table',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "reservation_id",
        using: "BTREE",
        fields: [
          { name: "reservation_id" },
        ]
      },
      {
        name: "table_id",
        using: "BTREE",
        fields: [
          { name: "table_id" },
        ]
      },
    ]
  });
};
