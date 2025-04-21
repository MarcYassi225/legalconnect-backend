const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

// 🔒 Route protégée : Récupérer le profil utilisateur
router.get("/profil", authMiddleware, getProfile);

// ✏️ Route protégée : Mettre à jour le profil utilisateur
router.put("/profil", authMiddleware, updateProfile);

module.exports = router;
