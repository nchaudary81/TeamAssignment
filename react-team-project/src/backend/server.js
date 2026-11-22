// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const app = express();

import "dotenv/config";
import express from "express";
import cors from "cors";
import skillRouter from "./routes/skills.js";
import authRouter from "./routes/auth.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://your-team-app.vercel.app",
  "https://your-team-app.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy: Origin not authorized."));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(logger);

function logger(req, res, next) {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
}

app.use("/api/auth", authRouter);
app.use("/api/skills", skillRouter);

app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
