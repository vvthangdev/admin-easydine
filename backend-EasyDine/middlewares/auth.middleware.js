require("dotenv").config();
const express = require("express");
const app = express();
const authUtil = require("../utils/auth.util");
const User = require("../models/user.model");
app.use(express.json());

async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access token required!");
  }

  try {
    // Sử dụng ACCESS_TOKEN_SECRET để xác thực access token
    const user = await authUtil.verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!user) {
      return res.status(403).send("Invalid or expired access token!");
    }
    // Gán thông tin người dùng vào request
    // Đặt payload vào req.user mà không cần nested "payload"
    const userObject = await User.findOne({
      username: user
    });
    // req.user = user.payload ? user.payload : user;
    req.user = userObject;
    next(); // Chuyển sang middleware hoặc route tiếp theo
  } catch (error) {
    console.log(error);
    return res.status(403).send("Invalid or expired access token!");
  }
}

module.exports = {
  authenticateToken,
};
