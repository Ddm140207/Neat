// ==========================================
// SERVER CONFIGURATION SECTION
// This file starts the Express server and
// connects the main API routes used by Noty.
// ==========================================

require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
require("./database/database");

const authRoutes = require("./routes/auth.routes");
const notesRoutes = require("./routes/notes.routes");
const spellRoutes = require("./routes/spell.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// GLOBAL MIDDLEWARE SECTION
// Express reads JSON requests and CORS allows
// the frontend to communicate with this API.
// ==========================================

app.use(cors());
app.use(express.json());
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get(["/favicon.ico", "/favicon.png"], (req, res) => {
  res.sendFile(path.join(frontendPath, "public", "logo.svg"));
});

// ==========================================
// API ROUTES SECTION
// Auth routes are public. Notes routes are
// protected inside their route file.
// ==========================================

app.get("/api", (req, res) => {
  res.json({
    message: "Noty API is running",
    documentation: "Use /api/auth and /api/notes endpoints."
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/spell", spellRoutes);

// ==========================================
// SERVER START SECTION
// This launches the backend on the configured
// port so the frontend can call the API.
// ==========================================

function startServer(port) {
  const server = app.listen(port);

  server.on("listening", () => {
    console.log(`Noty backend running at http://localhost:${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err.message);
      process.exit(1);
    }
  });
}

startServer(PORT);
