const db = require("../config/db");

/* =========================
   LISTE DES UTILISATEURS
========================= */
exports.getUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, nom, email, role FROM utilisateurs"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   AJOUT D'UN UTILISATEUR
========================= */
exports.createUser = async (req, res) => {
  const { nom, email, mot_de_passe, role } = req.body;
  try {
    const [exist] = await db.query(
      "SELECT id FROM utilisateurs WHERE email = ?",
      [email]
    );
    if (exist.length > 0)
      return res.status(400).json({ message: "Email déjà utilisé" });

    await db.query(
      "INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?,?,?,?)",
      [nom, email, mot_de_passe, role || "client"]
    );

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   MODIFICATION D'UN UTILISATEUR
========================= */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { nom, email, mot_de_passe, role } = req.body;

  try {
    const [exist] = await db.query(
      "SELECT id FROM utilisateurs WHERE email = ? AND id != ?",
      [email, id]
    );
    if (exist.length > 0)
      return res.status(400).json({ message: "Email déjà utilisé" });

    const queryParams = [nom, email, role];
    let query = "UPDATE utilisateurs SET nom=?, email=?, role=?";
    
    if (mot_de_passe) {
      query += ", mot_de_passe=?";
      queryParams.push(mot_de_passe);
    }

    query += " WHERE id=?";
    queryParams.push(id);

    await db.query(query, queryParams);
    res.json({ message: "Utilisateur mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   SUPPRESSION D'UN UTILISATEUR
========================= */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM utilisateurs WHERE id=?", [id]);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
