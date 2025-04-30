const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour afficher les options de l'accueil
router.get("/accueil", authMiddleware, (req, res) => {
  // Options que l'utilisateur verra sur la page d'accueil
  const homeOptions = {
    deposerUnDossier: "Déposer un dossier pour avis",
    deposerUnePlainte: "Déposer une plainte",
    explorerLesThematiques: "Explorer les thématiques"
  };

  res.status(200).json({
    message: "Options de l'accueil récupérées avec succès.",
    options: homeOptions
  });
});

module.exports = router;
