const express = require("express");
const userMiddleware = require("../middlewares/user.middleware.js");
const tableController = require("../controllers/table.controller.js");
// const userUtil = require("../utils/user.util.js");
// const authMiddware = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/", tableController.getAllTables);

router.post("/create-table", tableController.createTable);

router.patch("/update-table", tableController.updateTable);

router.delete("/delete-table", tableController.deleteTable);
// router.post(
//   "/signup",
//   userUtil.validateSignUpSignUp,
//   userMiddleware.checkUserExistsSignUp,
//   userController.signUp
// );

// router.post("/login", userMiddleware.checkUserExistLogin, userController.login);

// router.post("/refresh-token", userController.refreshToken);

// router.post("/logout", authMiddware.authenticateToken, userController.logout);
// // Route to update user information (requires authentication)
// router.put(
//   "/update",
//   authMiddware.authenticateToken,
//   userController.updateUser
// );

// // Route to delete user (requires authentication)
// router.delete(
//   "/delete",
//   authMiddware.authenticateToken,
//   userController.deleteUser
// );

module.exports = router;
