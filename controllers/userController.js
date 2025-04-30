const User = require("../models/user");
const bcrypt = require("bcrypt");

// ✅ GET /api/profil
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.status(200).json({ message: "Profil utilisateur récupéré avec succès.", profil: user });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ PUT /api/profil
const updateProfile = async (req, res) => {
  try {
    const { nom, prenom, email, telephone, ville, specialite, siteInternet } = req.body;
    if (!email || !nom || !prenom) return res.status(400).json({ error: "Champs obligatoires manquants." });
    if (req.body.role) return res.status(403).json({ error: "Modification du rôle interdite." });

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, email, telephone, ville, specialite, siteInternet },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) return res.status(404).json({ error: "Utilisateur non trouvé." });
    res.status(200).json({ message: "Profil mis à jour avec succès.", profil: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// 🔐 PUT /api/profil/motdepasse
const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;
    const match = await bcrypt.compare(ancienMotDePasse, user.password);
    if (!match) return res.status(400).json({ message: "Mot de passe actuel incorrect." });

    user.password = await bcrypt.hash(nouveauMotDePasse, 10);
    await user.save();
    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors du changement de mot de passe", error: err.message });
  }
};

// ⭐ POST /api/profil/note
const ajouterNote = async (req, res) => {
  try {
    const { professionnelId, valeur } = req.body;
    const utilisateur = req.user;

    if (!valeur || valeur < 1 || valeur > 5) {
      return res.status(400).json({ message: "Note invalide. Elle doit être entre 1 et 5." });
    }

    const professionnel = await User.findById(professionnelId);
    if (!professionnel || professionnel.role !== "juridique") {
      return res.status(404).json({ message: "Professionnel introuvable." });
    }

    // Vérifier si l'utilisateur a déjà noté ce professionnel
    const dejaNote = professionnel.notes.find(note => note.auteurId.toString() === utilisateur.id);
    if (dejaNote) {
      return res.status(400).json({ message: "Vous avez déjà noté ce professionnel." });
    }

    professionnel.notes.push({
      auteurId: utilisateur.id,
      valeur
    });

    await professionnel.save();

    res.status(200).json({ message: "Note ajoutée avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout de la note.", error: err.message });
  }
};


// 💬 POST /api/profil/commentaire
const ajouterCommentaire = async (req, res) => {
  try {
    const { professionnelId, texte } = req.body;
    const auteur = req.user;

    const professionnel = await User.findById(professionnelId);
    if (!professionnel || professionnel.role !== "juridique") {
      return res.status(404).json({ message: "Professionnel introuvable" });
    }

    const nouveauCommentaire = {
      auteurId: auteur._id,
      auteurNom: `${auteur.prenom} ${auteur.nom}`,
      texte
    };

    professionnel.commentaires.push(nouveauCommentaire);
    await professionnel.save();

    res.status(200).json({ message: "Commentaire ajouté avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error: err.message });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  ajouterNote,
  ajouterCommentaire
};