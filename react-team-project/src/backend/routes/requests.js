import express from "express";
import pool from "../index.js";
import requireAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        skill_requests.id,
        skill_requests.skill_id AS "skillId",
        skill_requests.message,
        skill_requests.status,
        skill_requests.created_at AS "createdAt",
        skills.title AS "skillTitle",
        users.full_name AS "providerName"
       FROM skill_requests
       JOIN skills ON skill_requests.skill_id = skills.id
       JOIN users ON skills.user_id = users.id
       WHERE skill_requests.requester_id = $1
       ORDER BY skill_requests.created_at DESC`,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load requests." });
  }
});

router.get("/received", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        skill_requests.id,
        skill_requests.skill_id AS "skillId",
        skill_requests.message,
        skill_requests.status,
        skill_requests.created_at AS "createdAt",
        skills.title AS "skillTitle",
        requesters.full_name AS "requesterName"
       FROM skill_requests
       JOIN skills ON skill_requests.skill_id = skills.id
       JOIN users AS requesters ON skill_requests.requester_id = requesters.id
       WHERE skills.user_id = $1
       ORDER BY skill_requests.created_at DESC`,
      [req.user.id],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not load received requests." });
  }
});

router.post("/", requireAuth, async (req, res) => {
  const { skillId, message } = req.body || {};
  const parsedSkillId = Number(skillId);
  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  if (!Number.isInteger(parsedSkillId) || parsedSkillId <= 0) {
    return res.status(400).json({ message: "A valid skill is required." });
  }

  if (
    (message !== undefined && message !== null && typeof message !== "string") ||
    trimmedMessage.length > 1000
  ) {
    return res.status(400).json({
      message: "Request message must be 1000 characters or fewer.",
    });
  }

  try {
    const skillResult = await pool.query(
      "SELECT id, user_id FROM skills WHERE id = $1",
      [parsedSkillId],
    );

    if (skillResult.rows.length === 0) {
      return res.status(404).json({ message: "Skill not found." });
    }

    if (String(skillResult.rows[0].user_id) === String(req.user.id)) {
      return res.status(400).json({
        message: "You cannot request your own skill.",
      });
    }

    const result = await pool.query(
      `INSERT INTO skill_requests (skill_id, requester_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, skill_id AS "skillId", message, status,
                 created_at AS "createdAt"`,
      [parsedSkillId, req.user.id, trimmedMessage || null],
    );

    res.status(201).json({
      message: "Skill request sent.",
      request: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not send request." });
  }
});

export default router;
