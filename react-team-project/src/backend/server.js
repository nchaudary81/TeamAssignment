const express = require("express");
const app = express();

app.use(express.json());
app.use(logger);

// Custom log-catcher middleware
function logger(req, res, next) {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
}

const skillRouter = require("./routes/skills");

app.use("/api/skills", skillRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
