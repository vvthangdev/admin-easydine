const db = require("../config/db.config");

// Định nghĩa model cho bảng users
const User = {
  // Phương thức để tạo người dùng mới
  create: (newUser, result) => {
    const query = "INSERT INTO users SET ?";

    // Thực thi câu lệnh query với dữ liệu user mới
    db.query(query, newUser, (err, res) => {
      if (err) {
        console.log("Error: ", err);
        result(err, null); // Trả về lỗi nếu có
        return;
      }

      // Trả về kết quả nếu thành công (id của user vừa thêm)
      result(null, { id: res.insertId, ...newUser });
    });
  },

  updateById: (id, updatedUser, result) => {
    const query = `
      UPDATE users 
      SET 
        name = COALESCE(?, name), 
        email = COALESCE(?, email), 
        phone_number = COALESCE(?, phone_number), 
        password = COALESCE(?, password) 
      WHERE id = ?
    `;

    // Sử dụng COALESCE để giữ nguyên giá trị cũ nếu không có giá trị mới
    db.query(
      query, 
      [updatedUser.name, updatedUser.email, updatedUser.phone_number, updatedUser.password, id],
      (err, res) => {
        if (err) {
          console.log('Error: ', err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // Không tìm thấy người dùng với ID đã cho
          result({ kind: "not_found" }, null);
          return;
        }

        // Trả về kết quả nếu cập nhật thành công
        result(null, { id: id, ...updatedUser });
      }
    );
  }
};

module.exports = User;
