// routes/avisRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { createAvis } = require('../controllers/avisController');

// Route pour déposer un avis
router.post('/avis', authMiddleware, createAvis);

module.exports = router;
