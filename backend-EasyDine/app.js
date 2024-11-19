const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const userRoutes = require("./routes/user.routes"); // Import route user
const conversationRoutes = require("./routes/conversation.routes");

const tableRouter = require("./routes/table.routes.js");
const orderRouter = require("./routes/order.routes.js");
const itemRouter = require("./routes/item.routes.js");

const sequelize = require("./config/db.config.js");
const { initModels } = require("./models/init.model.js");
app.use(cors());
app.use(express.json()); // Parse các request có nội dung dạng JSON
app.use(express.urlencoded({ extended: true })); // Parse các request có nội dung dạng URL-encoded

// initModels()

app.use("/api/auth", userRoutes);
app.use("/api/conversation", conversationRoutes);

// app.use("/api/message", messageRoutes);
app.use("/tables", tableRouter);
app.use("/orders", orderRouter);
app.use("/item", itemRouter);

// Kết nối database và chạy server
const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/`);
    });
  })
  .catch((err) => console.error("Unable to connect to the database:", err));
