// ==========================================
// NOTES CRUD SECTION
// This section contains the logic to create,
// read, update and delete user notes.
// ==========================================

const db = require("../database/database");

function getAllNotes(req, res) {
  try {
    const notes = db.prepare(`
      SELECT id, title, content, user_id, created_at, updated_at
      FROM notes
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `).all(req.user.id);

    return res.json(notes);
  } catch {
    return res.status(500).json({ message: "Could not get notes." });
  }
}

function getNoteById(req, res) {
  try {
    const note = db.prepare(`
      SELECT id, title, content, user_id, created_at, updated_at
      FROM notes
      WHERE id = ? AND user_id = ?
    `).get(req.params.id, req.user.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json(note);
  } catch {
    return res.status(500).json({ message: "Could not get the note." });
  }
}

function createNote(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const info = db.prepare(
      "INSERT INTO notes (title, content, user_id) VALUES (?, ?, ?)"
    ).run(title, content, req.user.id);

    return res.status(201).json({
      message: "Note created successfully.",
      note: { id: info.lastInsertRowid, title, content, user_id: req.user.id }
    });
  } catch {
    return res.status(500).json({ message: "Could not create the note." });
  }
}

function updateNote(req, res) {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required." });
  }

  try {
    const info = db.prepare(`
      UPDATE notes
      SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).run(title, content, req.params.id, req.user.id);

    if (info.changes === 0) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json({ message: "Note updated successfully." });
  } catch {
    return res.status(500).json({ message: "Could not update the note." });
  }
}

function deleteNote(req, res) {
  try {
    const info = db.prepare(
      "DELETE FROM notes WHERE id = ? AND user_id = ?"
    ).run(req.params.id, req.user.id);

    if (info.changes === 0) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.json({ message: "Note deleted successfully." });
  } catch {
    return res.status(500).json({ message: "Could not delete the note." });
  }
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
