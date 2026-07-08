// ==========================================
// AUTH CONTROLLER SECTION
// This file contains the register and login
// logic used by the authentication routes.
// ==========================================

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/database");

function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password are required."
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const info = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    ).run(name, email, hashedPassword);

    return res.status(201).json({
      message: "User registered successfully.",
      user: { id: info.lastInsertRowid, name, email }
    });
  } catch (error) {
    if (error.message.includes("UNIQUE")) {
      return res.status(409).json({
        message: "A user with this email already exists."
      });
    }
    return res.status(500).json({
      message: "Could not create the user."
    });
  }
}

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  return res.json({
    message: "Login successful.",
    token,
    user: { id: user.id, name: user.name, email: user.email }
  });
}

module.exports = {
  register,
  login
};
