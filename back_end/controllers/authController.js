const db = require("../config/db");

/* =========================
   INSCRIPTION
========================= */
exports.register = async (req, res) => {
  const { nom, email, mot_de_passe, telephone, adresse } = req.body;

  try {
    // Vérifier email existant
    const [exist] = await db.query(
      "SELECT id FROM utilisateurs WHERE email = ?",
      [email]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Insertion utilisateur
    await db.query(
      `INSERT INTO utilisateurs 
       (nom, email, mot_de_passe, telephone, adresse) 
       VALUES (?,?,?,?,?)`,
      [nom, email, mot_de_passe, telephone, adresse]
    );

    res.status(201).json({ message: "Inscription réussie" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

/* =========================
   CONNEXION
========================= */
exports.login = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT id, nom, email, telephone, adresse, role
       FROM utilisateurs
       WHERE email = ? AND mot_de_passe = ?`,
      [email, mot_de_passe]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Identifiants incorrects" });
    }

    res.json({
      message: "Connexion réussie",
      user: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


