const User = require("../models/user.model");
// const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const userService = require("../services/user.service");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

const signUp = async (req, res) => {
  let { role, name, address, bio, email, phone, username, password, token } =
    req.body;

  try {
    const newUser = await userService.createUser({
      role,
      name,
      address,
      bio,
      email,
      phone,
      username,
      password,
      token,
    });
    return res.json({
      status: "SUCCESS",
      message: "Signup successful!",
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "An error occurred during sign up!",
    });
  }
};

const login = async (req, res) => {
  let { username, password } = req.body;
  // const user = await User.findOne({where: {username: username}});
  try {
    const user = await userService.getUserByUserName(username);
    const isPasswordValid = await userService.validatePassword(
      password,
      user.password
    );
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.json({
        status: "FAILED",
        message: "Password incorrect!",
      });
    }
    res.json({
      status: "SUCCESS",
      message: "Login successful!",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "An error occurred during login!",
    });
  }
};

module.exports = { getAllUsers, signUp, login };
