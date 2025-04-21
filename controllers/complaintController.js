const Complaint = require("../models/complaint");

// ✅ Créer une plainte
const createComplaint = async (req, res) => {
  try {
    const { titre, description, pieces_jointes } = req.body;

    const newComplaint = new Complaint({
      titre,
      description,
      utilisateur: req.user.id,
      pieces_jointes: pieces_jointes || [],
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Plainte créée avec succès.",
      complaint: newComplaint,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ Récupérer toutes les plaintes d'un utilisateur
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ utilisateur: req.user.id });

    res.status(200).json({
      message: "Plaintes récupérées avec succès.",
      complaints,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ Récupérer une plainte par son ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur");

    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée." });
    }

    res.status(200).json({
      message: "Plainte récupérée avec succès.",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ Mettre à jour une plainte complète (titre, description, statut, pièces jointes)
const updateComplaint = async (req, res) => {
  try {
    const { titre, description, statut, pieces_jointes } = req.body;

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { titre, description, statut, pieces_jointes },
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Plainte non trouvée." });
    }

    res.status(200).json({
      message: "Plainte mise à jour avec succès.",
      complaint: updatedComplaint,
    });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur", details: err.message });
  }
};

// ✅ Mettre à jour uniquement le statut de la plainte
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    console.log("ID reçu :", id); // Log de l'ID de la plainte
    console.log("Statut reçu :", statut); // Log du statut reçu
    console.log("Utilisateur connecté :", req.user); // Log de l'utilisateur connecté

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      console.log("❌ Plainte non trouvée"); // Log si plainte non trouvée
      return res.status(404).json({ error: "Plainte introuvable." });
    }

    // Vérification si l'utilisateur est le propriétaire de la plainte
    if (complaint.utilisateur.toString() !== req.user.id.toString()) {
      console.log("❌ Utilisateur non autorisé :", complaint.utilisateur.toString(), "vs", req.user.id); // Log de l'ID utilisateur
      return res.status(403).json({ error: "Non autorisé à modifier cette plainte." });
    }

    // Mise à jour du statut de la plainte
    complaint.statut = statut;
    complaint.date_maj = new Date();

    await complaint.save();

    res.status(200).json({
      message: "Statut de la plainte mis à jour avec succès.",
      complaint,
    });
  } catch (error) {
    console.error("❌ Erreur serveur :", error); // Log complet de l'erreur
    res.status(500).json({ error: "Erreur serveur." });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus, // N'oublie pas d'exporter ici !
};
