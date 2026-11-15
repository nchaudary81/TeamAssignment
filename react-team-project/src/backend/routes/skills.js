const express = require("express");
const router = express.Router();
const pool = require("../index");

// GET: Return all skills
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM skills");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
