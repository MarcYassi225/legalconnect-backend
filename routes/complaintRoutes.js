const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage,
  addCoffreFortFile,
} = require("../controllers/complaintController");

// Routes de base pour les plaintes
router.post("/complaints", authMiddleware, createComplaint);
router.get("/complaints", authMiddleware, getComplaints);
router.get("/complaints/:id", authMiddleware, getComplaintById);
router.put("/complaints/:id", authMiddleware, updateComplaint);

// Routes pour les fonctionnalités spécifiques
router.put("/complaints/:id/status", authMiddleware, updateComplaintStatus);
router.post("/complaints/:id/chat", authMiddleware, addChatMessage);

// Route pour le coffre-fort - version améliorée
router.post(
  "/complaints/:id/coffre-fort",
  authMiddleware,
  upload.single("file"), // Le nom doit correspondre au champ dans Postman
  addCoffreFortFile
);

module.exports = router;