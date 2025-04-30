// controllers/avisController.js
const Avis = require('../models/avis');
const User = require('../models/user');

const createAvis = async (req, res) => {
  try {
    const { titre, description, chat, coffreFort, statut } = req.body;

    // Créer un nouvel avis
    const avis = new Avis({
      utilisateurId: req.user.id,  // Utilisateur connecté
      titre,
      description,
      chat,  // Messages du chat associés à l'avis
      coffreFort,  // Fichiers associés à l'avis
      statut: statut || "en attente",  // Statut par défaut "en attente"
    });

    // Sauvegarder l'avis dans la base de données
    await avis.save();

    // Mettre à jour l'utilisateur pour lier l'avis à son profil
    const user = await User.findById(req.user.id);
    user.avis.push(avis._id);  // Ajouter l'ID de l'avis au tableau d'avis de l'utilisateur
    await user.save();

    res.status(201).json({ message: "Avis pour dossier déposé avec succès", avis });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du dépôt de l'avis", details: err.message });
  }
};

module.exports = { createAvis };
