const db = require("../config/db");

exports.createOrder = async (req, res) => {
  const {
    utilisateur_id,
    pharmacie_id,
    total,
    adresse_livraison,
    type_livraison,
    produits
  } = req.body;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
      `INSERT INTO commandes
       (utilisateur_id, pharmacie_id, total, adresse_livraison, type_livraison, statut)
       VALUES (?,?,?,?,?, 'confirmee')`,
      [utilisateur_id, pharmacie_id, total, adresse_livraison, type_livraison]
    );

    const commandeId = result.insertId;

    for (const p of produits) {
      const [rows] = await connection.query(
        `SELECT stock, prix
         FROM pharmacie_medicaments
         WHERE pharmacie_id = ? AND medicament_id = ?`,
        [pharmacie_id, p.medicament_id]
      );

      if (rows.length === 0)
        throw new Error("Médicament non disponible");

      if (rows[0].stock < p.quantite)
        throw new Error("Stock insuffisant");

      await connection.query(
        `INSERT INTO commande_details
         (commande_id, medicament_id, quantite, prix_unitaire)
         VALUES (?,?,?,?)`,
        [commandeId, p.medicament_id, p.quantite, rows[0].prix]
      );

      await connection.query(
        `UPDATE pharmacie_medicaments
         SET stock = stock - ?
         WHERE pharmacie_id = ? AND medicament_id = ?`,
        [p.quantite, pharmacie_id, p.medicament_id]
      );
    }

    await connection.commit();
    res.status(201).json({ id: commandeId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    connection.release();
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const [commandes] = await db.query(
      `SELECT * FROM commandes
       WHERE utilisateur_id = ?
       ORDER BY cree_le DESC`,
      [req.params.id]
    );

    res.json(commandes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [cmd] = await db.query(
      `SELECT c.*, u.nom AS utilisateur_nom, u.telephone AS utilisateur_tel, u.adresse AS utilisateur_adresse
       FROM commandes c
       JOIN utilisateurs u ON u.id = c.utilisateur_id
       WHERE c.id = ?`,
      [req.params.id]
    );

    if (cmd.length === 0)
      return res.status(404).json({ message: "Commande introuvable" });

    const [details] = await db.query(
      `SELECT d.*, m.nom
       FROM commande_details d
       JOIN medicaments m ON m.id = d.medicament_id
       WHERE d.commande_id = ?`,
      [req.params.id]
    );

    cmd[0].details = details;

    res.json(cmd[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { statut } = req.body;
  await db.query(
    "UPDATE commandes SET statut = ? WHERE id = ?",
    [statut, req.params.id]
  );
  res.json({ message: "Statut mis à jour" });
};

exports.cancelOrder = async (req, res) => {
  const [cmd] = await db.query(
    "SELECT statut FROM commandes WHERE id = ?",
    [req.params.id]
  );

  if (cmd[0].statut !== "confirmee")
    return res.status(400).json({ message: "Annulation impossible" });

  await db.query(
    "UPDATE commandes SET statut = 'annulee' WHERE id = ?",
    [req.params.id]
  );

  res.json({ message: "Commande annulée" });
};

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.*,
        u.nom AS utilisateur_nom
      FROM commandes c
      LEFT JOIN utilisateurs u ON u.id = c.utilisateur_id
      ORDER BY c.cree_le DESC
    `);

    // Format pour le frontend
    const formatted = rows.map(r => ({
      ...r,
      utilisateur: { nom: r.utilisateur_nom }
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.id,
        d.quantite,
        d.prix_unitaire,
        m.nom
      FROM commande_details d
      JOIN medicaments m ON m.id = d.medicament_id
      WHERE d.commande_id = ?
    `, [req.params.id]);

    // Format attendu par le frontend
    const formatted = rows.map(r => ({
      id: r.id,
      quantite: r.quantite,
      prix_unitaire: r.prix_unitaire,
      medicament: { nom: r.nom }
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  const { statut } = req.body;

  try {
    await db.query(
      "UPDATE commandes SET statut = ? WHERE id = ?",
      [statut, req.params.id]
    );

    res.json({ message: "Commande mise à jour" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    await db.query("DELETE FROM commande_details WHERE commande_id = ?", [req.params.id]);
    await db.query("DELETE FROM commandes WHERE id = ?", [req.params.id]);

    res.json({ message: "Commande supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

