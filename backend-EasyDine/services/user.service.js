const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/user.model");

async function isUserExists(criteria) {
  // Tạo mảng điều kiện `where` dựa trên các thuộc tính có trong `criteria`
  const conditions = [];

  if (criteria.email) {
    conditions.push({ email: criteria.email });
  }
  if (criteria.phone) {
    conditions.push({ phone: criteria.phone });
  }
  if (criteria.username) {
    conditions.push({ username: criteria.username });
  }

  // Nếu không có điều kiện nào được cung cấp, trả về `false` ngay lập tức
  if (conditions.length === 0) {
    return false;
  }

  // Thực hiện truy vấn với điều kiện `Op.or` để kiểm tra sự tồn tại
  const result = await User.findAll({
    where: {
      [Op.or]: conditions,
    },
  });

  return result.length > 0;
}

async function createUser(userData) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // Sử dụng User.create để lưu trực tiếp vào cơ sở dữ liệu và nhận lại đối tượng đã lưu
  const newUser = new User({
    ...userData,
    password: hashedPassword,
    token: userData.password,
  });
  // console.log({newUser});
  return newUser.save(); // newUser sẽ bao gồm tất cả các thuộc tính từ cơ sở dữ liệu
}

async function getUserByUserName(username) {
  console.log(User.findOne({ where: { username: username } }));
  return await User.findOne({ where: { username: username } });
}

async function validatePassword(password, hashedPassword) {
  // console.log(bcrypt.compareSync(password, hashedPassword))
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
  isUserExists,
  createUser,
  getUserByUserName,
  validatePassword,
};
