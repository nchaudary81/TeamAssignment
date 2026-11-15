const express = require("express");
const router = express.Router();
const pool = require("../index");

// GET: Return all skills
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        skills.id,
        skills.user_id,
        skills.title,
        skills.description,
        skills.category,
        users.full_name AS "providerName"
      FROM skills
      LEFT JOIN users ON skills.user_id = users.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
