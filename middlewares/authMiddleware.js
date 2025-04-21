const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization"); // On attend le token dans l'en-tête "Authorization"

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé, token manquant." });
  }

  try {
    // Enlever le "Bearer " du token (si présent)
    const tokenSansBearer = token.split(" ")[1]; // "Bearer <token>"
    const decoded = jwt.verify(tokenSansBearer, process.env.JWT_SECRET); // Décoder le token avec la clé secrète
    req.user = decoded; // Ajouter les infos de l'utilisateur à la requête
    next(); // Passer à la prochaine fonction middleware ou à la route
  } catch (err) {
    res.status(401).json({ error: "Token invalide." });
  }
};

module.exports = authMiddleware;
