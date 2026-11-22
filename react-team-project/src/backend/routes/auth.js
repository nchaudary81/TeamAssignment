const express = require("express");
const router = express.Router();
const pool = require("../index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
    const body = req.body || {};
    const fullName = typeof body.full_name === "string" ? body.full_name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = body.password;

    // Check required information
    if (!fullName || !email || typeof password !== "string") {
        return res.status(400).json({
            message: "Full name, email, and password are required."
        });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            message: "Enter a valid email address."
        });
    }

    // Validate password length
    const passwordBytes = Buffer.byteLength(password, "utf8");

    if (passwordBytes < 8 || passwordBytes > 72) {
        return res.status(400).json({
            message: "Password must be between 8 and 72 bytes."
        });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not configured.");
        return res.status(500).json({
            message: "Server configuration error."
        });
    }

    try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const result = await pool.query(
            `INSERT INTO users (full_name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, full_name, email`,
            [fullName, email, passwordHash]
        );

        const user = result.rows[0];

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            message: "Registration successful.",
            token,
            user
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                message: "An account with that email already exists."
            });
        }

        console.error(error);
        return res.status(500).json({
            message: "Server error."
        });
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try {
        const email = typeof req.body?.email === "string"
            ? req.body.email.trim().toLowerCase()
            : "";

        const password = req.body?.password;

        // Check required information
        if (!email || typeof password !== "string" || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured.");
            return res.status(500).json({
                message: "Server configuration error."
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const user = result.rows[0];

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error."
        });
    }
});

module.exports = router;
