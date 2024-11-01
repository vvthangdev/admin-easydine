const { isUserExists } = require("../services/user.service");

// SignUp kiểm tra tính hợp lệ của dữ liệu đầu vào
const validateSignUpSignUp = (req, res, next) => {
  const { role, name, address, bio, email, phone, username, password } =
    req.body;

  if (!name || !email || !phone || !username || !password) {
    return res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name.trim())) {
    return res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w\.\-]+@([\w\-]+\.)+[\w\-]{2,4}$/.test(email.trim())) {
    return res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (password.trim().length < 8) {
    return res.json({
      status: "FAILED",
      message: "Password is too short!",
    });
  }

  next(); // Chuyển tiếp nếu dữ liệu hợp lệ
};

// SignUp kiểm tra xem người dùng đã tồn tại chưa
const checkUserExistsSignUp = async (req, res, next) => {
  try {
    const { email, phone, username } = req.body;
    const userExists = await isUserExists({ email, phone, username });

    if (userExists) {
      return res.json({
        status: "FAILED",
        message:
          "User with the provided email, phone number, or username already exists",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "An error occurred while checking for existing user!",
    });
  }
};
// Kiểm tra người dùng muốn đăng nhập có tồn tại chưa
const checkUserExistLogin = async (req, res, next) => {
  try {
    const { username } = req.body;
    const userExists = await isUserExists({ username });
    if (!userExists) {
      return res.json({
        status: "FAILED",
        message: "User is not exist!",
      });
    }
    console.log("ok");
    next();
  } catch (error) {
    console.log(error);
    res.json({
      status: "FAILED",
      message: "An error occurred while checking for existing user!",
    });
  }
};

module.exports = {
  validateSignUpSignUp,
  checkUserExistsSignUp,
  checkUserExistLogin,
};
