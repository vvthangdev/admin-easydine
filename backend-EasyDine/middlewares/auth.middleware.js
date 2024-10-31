require("dotenv").config();

const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

// let refreshTokens = [];

// app.post("/token", (req, res) => {
//   const refreshTokens = req.body.token;
//   if (refreshTokens == null) return res.sendStatus(401);
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
//   jwt.verify(refreshTokens, process.env.RE)
// });
