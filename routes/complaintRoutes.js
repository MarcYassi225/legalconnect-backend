const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
} = require("../controllers/complaintController");

// Route protégée : Créer une plainte
router.post("/complaints", authMiddleware, createComplaint);

// Route protégée : Récupérer toutes les plaintes de l'utilisateur
router.get("/complaints", authMiddleware, getComplaints);

// Route protégée : Récupérer une plainte par son ID
router.get("/complaints/:id", authMiddleware, getComplaintById);

// Route protégée : Mettre à jour une plainte
router.put("/complaints/:id", authMiddleware, updateComplaint);

module.exports = router;
