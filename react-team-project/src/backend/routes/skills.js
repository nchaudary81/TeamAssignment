const express = require("express");
const router = express.Router();
const pool = require("../index");
const requireAuth = require("../middleware/authMiddleware");

// GET: Return all skills
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, category, "providerName" FROM skills'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;