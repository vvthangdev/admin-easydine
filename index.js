const express = require("express");
const app = express();
const mongoose = require("mongoose");
const productRoute = require("./routes/product.route.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});

app.use("/api/products", productRoute);

app.listen(3000, () => {
  console.log(`Server is running at port ${PORT}`);
});

mongoose
  .connect(
    "mongodb+srv://vvthangdev:depVhmhrfEl8Xbyv@backend.sa56x.mongodb.net/?retryWrites=true&w=majority&appName=backEnd"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

// //Get API
// app.get("/", (req, res) => {
//   res.send("Hello from Node API");
// });

// // app.get("/api/products", async (req, res) => {
// //   try {
// //     const products = await Product.find({});
// //     res.status(200).json(products);
// //   } catch (error) {
// //     res.status(500).json({ messgase: error.messgase });
// //   }
// // });
// // product: so it vi chi lay 1 san pham
// app.get("/api/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findById(id);
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ messgase: error.messgase });
//   }
// });

// //Post API
// app.post("/api/products", async (req, res) => {
//   // console.log("req.body")
//   // res.send(req.body)
//   // // res.send("Data received!")
//   try {
//     const product = await Product.create(req.body);
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ messgase: error.messgase });
//   }
// });

// //Put API
// // Update a product

// app.put("/api/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await Product.findByIdAndUpdate(id, req.body);

//     if (!product) {
//       return res.status(404).json({ messgase: "Product not found!" });
//     }

//     const updatedProduct = await Product.findById(id);
//     res.status(200).json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ messgase: error.messgase });
//   }
// });

// app.delete("/api/product/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(404).json({ messgase: "Product not found!" });
//     }

//     res.status(200).json({ messgase: "Product deleted successfully!" });
//   } catch (error) {
//     res.status(500).json({ messgase: error.messgase });
//   }
// });
