// routes/userRoutes.js
const express = require("express");
// const User = require('../models/user.model');
const { getAllUsers, signUp } = require("../controllers/user.controller.js");

const router = express.Router();

// Lấy tất cả người dùng
router.get("/", getAllUsers);

router.post("/signup", signUp);
// router.post("/", createUser);

// router.get('/', async (req, res) => {
//   try {
//     const users = await User.findAll();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching users' });
//   }
// });

// // Tạo người dùng mới
// router.post('/', async (req, res) => {
//   try {
//     const user = await User.create(req.body);
//     res.status(201).json(user);
//   } catch (error) {
//     res.status(500).json({ error: 'Error creating user' });
//   }
// });

module.exports = router;
