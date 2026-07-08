const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();
router.use(authenticateToken);

let spell = null;

async function loadDictionary() {
  const [nspell, dict] = await Promise.all([
    import("nspell"),
    import("dictionary-es"),
  ]);
  spell = nspell.default(dict.default);
}
loadDictionary();

router.post("/check", (req, res) => {
  if (!spell) return res.status(503).json({ message: "Diccionario cargando" });
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Texto requerido" });
  const words = text.match(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+/g) || [];
  const errors = [...new Set(words.filter((w) => !spell.correct(w)))];
  const suggestions = {};
  errors.forEach((e) => { suggestions[e] = spell.suggest(e).slice(0, 3); });
  res.json({ errors, suggestions });
});

module.exports = router;
