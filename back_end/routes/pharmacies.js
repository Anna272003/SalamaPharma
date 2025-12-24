const express = require("express");
const router = express.Router();
const controller = require("../controllers/pharmacieController");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

router.get("/search/:nom", controller.search);
router.get("/:id/medicaments", controller.getMedicamentsByPharmacie);

module.exports = router;
