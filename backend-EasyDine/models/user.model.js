// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.config");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Đảm bảo Sequelize nhận diện đúng auto-increment nếu cần
    },
    role: DataTypes.ENUM("customer", "admin"),
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
  },
  {
    tableName: "User",
    timestamps: false, // Nếu bảng không có các trường createdAt và updatedAt
  }
);

module.exports = User;
