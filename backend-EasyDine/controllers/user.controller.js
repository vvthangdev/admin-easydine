const User = require("../models/user.model");

// Tạo người dùng mới
exports.createUser = (req, res) => {
  // Kiểm tra request có đầy đủ thông tin không
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.phone_number ||
    !req.body.password
  ) {
    return res.status(400).json({ message: "Content cannot be empty!" });
  }

  // Tạo đối tượng người dùng mới
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password,
  };

  // Gọi model để thêm người dùng vào cơ sở dữ liệu
  User.create(newUser, (err, data) => {
    if (err) {
      res.status(500).json({
        message: err.message || "Some error occurred while creating the user.",
      });
    } else {
      res.status(201).json(data); // Trả về thông tin user vừa được tạo
    }
  });
};

exports.updateUser = (req, res) => {
  const updatedUser = {
    name: req.body.name || null,
    email: req.body.email || null,
    phone_number: req.body.phone_number || null,
    password: req.body.password || null,
  };

  User.updateById(req.params.id, updatedUser, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res
          .status(404)
          .json({ message: `Not found user with id ${req.params.id}` });
      } else {
        res
          .status(500)
          .json({ message: `Error updating user with id ${req.params.id}` });
      }
    } else {
      res.status(200).json(data);
    }
  });
};
