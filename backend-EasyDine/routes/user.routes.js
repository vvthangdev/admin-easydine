const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

// Định nghĩa route POST /api/users để tạo người dùng mới
router.post("/users", UserController.createUser);
router.put('/users/:id', UserController.updateUser);

module.exports = router;