require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const corsOptions = {
    origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(logger);


function logger(req, res, next) {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    next();
}

const skillRouter = require("./routes/skills");
const requireAuth = require("./middleware/authMiddleware");
const authRouter = require("./routes/auth");

app.use("/api/auth", authRouter);
app.use("/api/skills", skillRouter);

app.get("/", (req, res) => {
    res.json({ message: "Server is running" });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});