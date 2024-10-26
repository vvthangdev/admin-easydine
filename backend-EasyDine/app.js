const express = require("express");
const db = require("./config/db.config"); // Import cấu hình kết nối MySQL

const app = express();

// Kiểm tra kết nối MySQL với route thử nghiệm
app.get("/test-connection", (req, res) => {
  db.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) {
      console.error("Error executing query:", err.message);
      return res.status(500).json({ error: "Error connecting to database" });
    }
    res.json({
      message: "Database connection successful!",
      solution: results[0].solution,
    });
  });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
