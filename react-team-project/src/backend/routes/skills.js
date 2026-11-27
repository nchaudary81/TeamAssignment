import express from "express";
import pool from "../index.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// GET: Return all skills
// router.get("/", requireAuth, async (req, res) => { // Removed requireAuth to allow public access to skills
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
      skills.id,
      skills.title,
      skills.description,
      skills.category,
      users.full_name AS "providerName"
      FROM skills
      JOIN users ON skills.user_id = users.id`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// GET: Return skills shared by the signed-in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        skills.id,
        skills.title,
        skills.description,
        skills.category,
        users.full_name AS "providerName"
       FROM skills
       JOIN users ON skills.user_id = users.id
       WHERE skills.user_id = $1
       ORDER BY skills.id DESC`,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// POST: Create a new skill
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, description, category } = req.body || {};

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        message: "Skill title is required",
      });
    }

    if (
      (description !== undefined &&
        description !== null &&
        typeof description !== "string") ||
      (category !== undefined &&
        category !== null &&
        typeof category !== "string")
    ) {
      return res.status(400).json({
        message: "Invalid skill data",
      });
    }

    const result = await pool.query(
      `INSERT INTO skills (user_id, title, description, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id, title, description, category`,
      [req.user.id, title.trim(), description || null, category || null],
    );

    res.status(201).json({
      message: "Skill created successfully",
      skill: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// Find skill by ID
router
  .route("/:id")

  // GET: Return one skill
  .get(requireAuth, async (req, res) => {
    try {
      const skillId = Number(req.params.id);

      if (!Number.isInteger(skillId) || skillId <= 0) {
        return res.status(400).json({
          message: "Invalid skill ID",
        });
      }

      const result = await pool.query(
        `SELECT
          skills.id,
          skills.title,
          skills.description,
          skills.category,
          users.full_name AS "providerName"
         FROM skills
         JOIN users ON skills.user_id = users.id
         WHERE skills.id = $1`,
        [skillId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Skill not found",
        });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  })

  // PUT: Update a skill
  .put(requireAuth, async (req, res) => {
    try {
      const skillId = Number(req.params.id);
      const { title, description, category } = req.body || {};

      if (!Number.isInteger(skillId) || skillId <= 0) {
        return res.status(400).json({
          message: "Invalid skill ID",
        });
      }

      if (
        title === undefined &&
        description === undefined &&
        category === undefined
      ) {
        return res.status(400).json({
          message: "No skill data provided",
        });
      }

      if (
        (title !== undefined &&
          (typeof title !== "string" || title.trim() === "")) ||
        (description !== undefined &&
          description !== null &&
          typeof description !== "string") ||
        (category !== undefined &&
          category !== null &&
          typeof category !== "string")
      ) {
        return res.status(400).json({
          message: "Invalid skill data",
        });
      }

      const result = await pool.query(
        `UPDATE skills
         SET title = COALESCE($1, title),
             description = COALESCE($2, description),
             category = COALESCE($3, category)
         WHERE id = $4 AND user_id = $5
         RETURNING id, title, description, category`,
        [
          title === undefined ? null : title.trim(),
          description === undefined ? null : description,
          category === undefined ? null : category,
          skillId,
          req.user.id,
        ],
      );

      if (result.rows.length === 0) {
        const checkSkill = await pool.query(
          "SELECT id FROM skills WHERE id = $1",
          [skillId],
        );

        if (checkSkill.rows.length === 0) {
          return res.status(404).json({
            message: "Skill not found",
          });
        }

        return res.status(403).json({
          message: "You can only update your own skills",
        });
      }

      res.json({
        message: "Skill updated successfully",
        skill: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  })

  // DELETE: Delete a skill
  .delete(requireAuth, async (req, res) => {
    try {
      const skillId = Number(req.params.id);

      if (!Number.isInteger(skillId) || skillId <= 0) {
        return res.status(400).json({
          message: "Invalid skill ID",
        });
      }

      const result = await pool.query(
        "DELETE FROM skills WHERE id = $1 AND user_id = $2",
        [skillId, req.user.id],
      );

      if (result.rowCount === 0) {
        const checkSkill = await pool.query(
          "SELECT id FROM skills WHERE id = $1",
          [skillId],
        );

        if (checkSkill.rows.length === 0) {
          return res.status(404).json({
            message: "Skill not found",
          });
        }

        return res.status(403).json({
          message: "You can only delete your own skills",
        });
      }

      res.json({
        message: "Skill deleted successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  });

export default router;
