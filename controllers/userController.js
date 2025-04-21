const User = require("../models/user");

// ✅ GET /api/profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Profil utilisateur récupéré avec succès.",
      profil: user,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ PUT /api/profil (mise à jour du profil)
const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email } = req.body;

    // Vérification basique
    if (!email || !nom || !prenom) {
      return res.status(400).json({ error: "Tous les champs sont requis : nom, prénom, email." });
    }

    // Empêche de modifier le rôle via cette route
    if (req.body.role) {
      return res.status(403).json({ error: "Modification du rôle interdite." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    res.status(200).json({
      message: "Profil mis à jour avec succès.",
      profil: updatedUser,
    });

  } catch (err) {
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
