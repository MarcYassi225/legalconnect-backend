// routes/avisRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multerMiddleware');  // Middleware pour l'upload de fichiers
const { createAvis, addChatMessage, addCoffreFortFile } = require('../controllers/avisController');

// Route pour déposer un avis
router.post('/avis', authMiddleware, createAvis);

// Route pour ajouter un message au chat de l'avis
router.post('/avis/chat', authMiddleware, addChatMessage);

// Route pour ajouter un fichier au coffre-fort de l'avis
router.post('/avis/coffre-fort', authMiddleware, upload.single('fichier'), addCoffreFortFile);

module.exports = router;
