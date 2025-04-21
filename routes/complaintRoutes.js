const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage, // ✅ Nouvelle fonction importée
} = require("../controllers/complaintController");

// Route protégée : Créer une plainte
router.post("/complaints", authMiddleware, createComplaint);

// Route protégée : Récupérer toutes les plaintes de l'utilisateur
router.get("/complaints", authMiddleware, getComplaints);

// Route protégée : Récupérer une plainte par son ID
router.get("/complaints/:id", authMiddleware, getComplaintById);

// Route protégée : Mettre à jour une plainte (titre, description, etc.)
router.put("/complaints/:id", authMiddleware, updateComplaint);

// ✅ Route protégée : Mettre à jour uniquement le statut d'une plainte
router.put("/complaints/:id/status", authMiddleware, updateComplaintStatus);

// ✅ Nouvelle route : Ajouter un message dans le chat d’une plainte
router.post("/complaints/:id/chat", authMiddleware, addChatMessage);

module.exports = router;
