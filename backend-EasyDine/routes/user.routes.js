const express = require("express");
const userMiddleware = require("../middlewares/user.middleware.js");
const userController = require("../controllers/user.controller.js");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post(
  "/signup",
  userMiddleware.validateSignUpSignUp,
  userMiddleware.checkUserExistsSignUp,
  userController.signUp
);

router.post("/login", userMiddleware.checkUserExistLogin, userController.login);

module.exports = router;

// {
//   validateSignUpSignUp,
//   checkUserExistsSignUp,
//   checkUserExistLogin,
// }
// { getAllUsers, signUp }
