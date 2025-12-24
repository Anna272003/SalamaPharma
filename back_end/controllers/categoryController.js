const db = require("../config/db");

/* =========================
   GET ALL
========================= */
exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom FROM categories ORDER BY nom ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   GET BY ID
========================= */
exports.getCategoryById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom FROM categories WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   CREATE
========================= */
exports.createCategory = async (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ message: "Nom requis" });
  }

  try {
    await db.query(
      "INSERT INTO categories (nom) VALUES (?)",
      [nom]
    );
    res.status(201).json({ message: "Catégorie ajoutée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   UPDATE
========================= */
exports.updateCategory = async (req, res) => {
  const { nom } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE categories SET nom = ? WHERE id = ?",
      [nom, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    res.json({ message: "Catégorie modifiée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   DELETE
========================= */
exports.deleteCategory = async (req, res) => {
  try {
    const [result] = await db.query(
      "DELETE FROM categories WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Catégorie introuvable" });
    }

    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
