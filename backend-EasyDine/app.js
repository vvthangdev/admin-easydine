const express = require("express");
const db = require("./config/db.config"); // Import cấu hình kết nối MySQL
const userRoutes = require("./routes/user.routes"); // Import route user
const app = express();
const bodyParser = require("body-parser");

app.use(express.json()); // Parse các request có nội dung dạng JSON
app.use(express.urlencoded({ extended: true })); // Parse các request có nội dung dạng URL-encoded
app.use(bodyParser.json());

// Sử dụng route user
app.use("/api", userRoutes);

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

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
