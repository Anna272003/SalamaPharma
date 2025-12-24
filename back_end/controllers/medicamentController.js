const db = require("../config/db");

// GET ALL
exports.getAllMedicaments = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        m.id,
        m.nom,
        m.description,
        m.prix,
        m.stock,
        m.categorie_id,
        c.nom AS categorie_nom
      FROM medicaments m
      LEFT JOIN categories c ON m.categorie_id = c.id
      ORDER BY m.nom
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createMedicament = async (req, res) => {
  const { nom, description, prix, stock, categorie_id } = req.body;

  try {
    await db.query(
      `INSERT INTO medicaments (nom, description, prix, stock, categorie_id)
       VALUES (?, ?, ?, ?, ?)`,
      [nom, description, prix, stock, categorie_id]
    );

    res.status(201).json({ message: "Médicament ajouté" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateMedicament = async (req, res) => {
  const { id } = req.params;
  const { nom, description, prix, stock, categorie_id } = req.body;

  try {
    await db.query(
      `UPDATE medicaments 
       SET nom=?, description=?, prix=?, stock=?, categorie_id=?
       WHERE id=?`,
      [nom, description, prix, stock, categorie_id, id]
    );

    res.json({ message: "Médicament modifié" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteMedicament = async (req, res) => {
  try {
    await db.query(`DELETE FROM medicaments WHERE id=?`, [req.params.id]);
    res.json({ message: "Médicament supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH BY NAME
exports.searchByName = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, c.nom AS categorie_nom
       FROM medicaments m
       LEFT JOIN categories c ON m.categorie_id = c.id
       WHERE m.nom LIKE ?`,
      [`%${req.params.nom}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH BY CATEGORY
exports.searchByCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, c.nom AS categorie_nom
       FROM medicaments m
       JOIN categories c ON m.categorie_id = c.id
       WHERE m.categorie_id=?`,
      [req.params.categorie_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// SEARCH BY PHARMACY
exports.searchByPharmacy = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT m.*, c.nom AS categorie_nom, pm.stock, pm.prix
       FROM pharmacie_medicaments pm
       JOIN medicaments m ON pm.medicament_id = m.id
       LEFT JOIN categories c ON m.categorie_id = c.id
       WHERE pm.pharmacie_id=?`,
      [req.params.pharmacie_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
