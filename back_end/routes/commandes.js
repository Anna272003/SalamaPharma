const express = require("express");
const {
  createOrder,
  getOrdersByUser,
  getOrderById,
  updateStatus,
  cancelOrder,
  getAllOrders,
  deleteOrder,
  getOrderDetails,
  updateOrder
} = require("../controllers/commandeController");

const router = express.Router();

// EXISTANT (ne pas toucher)
router.post("/", createOrder);
router.get("/user/:id", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id/statut", updateStatus);
router.put("/:id/annuler", cancelOrder);

// AJOUT POUR ADMIN
router.get("/", getAllOrders);                 // LISTE ADMIN
router.get("/:id/details", getOrderDetails);   // DETAILS
router.delete("/:id", deleteOrder);             // SUPPRESSION
router.put("/:id", updateOrder);                // UPDATE STATUT (admin)

module.exports = router;
