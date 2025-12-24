const db = require("../config/db");

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, adresse, telephone FROM pharmacies ORDER BY nom"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pharmacies WHERE id=?",
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Pharmacie introuvable" });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.create = async (req, res) => {
  const { nom, adresse, telephone } = req.body;

  try {
    await db.query(
      "INSERT INTO pharmacies (nom, adresse, telephone) VALUES (?, ?, ?)",
      [nom, adresse, telephone]
    );

    res.status(201).json({ message: "Pharmacie ajoutée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  const { nom, adresse, telephone } = req.body;

  try {
    await db.query(
      "UPDATE pharmacies SET nom=?, adresse=?, telephone=? WHERE id=?",
      [nom, adresse, telephone, req.params.id]
    );

    res.json({ message: "Pharmacie modifiée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM pharmacies WHERE id=?", [req.params.id]);
    res.json({ message: "Pharmacie supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH
exports.search = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM pharmacies WHERE nom LIKE ?",
      [`%${req.params.nom}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// MEDICAMENTS BY PHARMACY
exports.getMedicamentsByPharmacie = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        m.id,
        m.nom,
        m.description,
        pm.prix,
        pm.stock
      FROM pharmacie_medicaments pm
      JOIN medicaments m ON pm.medicament_id = m.id
      WHERE pm.pharmacie_id=?
      `,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
