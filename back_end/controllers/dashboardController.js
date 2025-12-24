const db = require("../config/db"); // ton fichier MySQL déjà existant

exports.getDashboardStats = async (req, res) => {
  try {
    // Totaux
    const [users] = await db.query("SELECT COUNT(*) as total FROM utilisateurs");
    const [pharmacies] = await db.query("SELECT COUNT(*) as total FROM pharmacies");
    const [medicaments] = await db.query("SELECT COUNT(*) as total FROM medicaments");
    const [commandes] = await db.query("SELECT COUNT(*) as total FROM commandes");

    // Commandes aujourd'hui, cette semaine, ce mois
    const [commandesToday] = await db.query(
      "SELECT COUNT(*) as total FROM commandes WHERE DATE(cree_le) = CURDATE()"
    );
    const [commandesWeek] = await db.query(
      "SELECT COUNT(*) as total FROM commandes WHERE YEARWEEK(cree_le,1) = YEARWEEK(CURDATE(),1)"
    );
    const [commandesMonth] = await db.query(
      "SELECT COUNT(*) as total FROM commandes WHERE MONTH(cree_le) = MONTH(CURDATE()) AND YEAR(cree_le) = YEAR(CURDATE())"
    );

    res.json({
      stats: {
        utilisateurs: users[0].total,
        pharmacies: pharmacies[0].total,
        medicaments: medicaments[0].total,
        commandes: commandes[0].total,
      },
      commandesGraph: {
        today: commandesToday[0].total,
        week: commandesWeek[0].total,
        month: commandesMonth[0].total
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
