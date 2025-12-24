
const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicamentController");

// CRUD
router.get("/", controller.getAllMedicaments);
router.post("/", controller.createMedicament);
router.put("/:id", controller.updateMedicament);
router.delete("/:id", controller.deleteMedicament);

// Recherches
router.get("/nom/:nom", controller.searchByName);
router.get("/categorie/:categorie_id", controller.searchByCategory);
router.get("/pharmacie/:pharmacie_id", controller.searchByPharmacy);

module.exports = router;
