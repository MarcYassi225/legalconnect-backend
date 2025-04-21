const Complaint = require("../models/complaint");

// ✅ Créer une plainte
const createComplaint = async (req, res) => {
  try {
    const { titre, description, pieces_jointes } = req.body;

    // Créer une nouvelle plainte
    const newComplaint = new Complaint({
      titre,
      description,
      utilisateur: req.user.id, // On associe la plainte à l'utilisateur qui est connecté
      pieces_jointes: pieces_jointes || [],
    });

    await newComplaint.save(); // Sauvegarder la plainte dans la base de données

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

// ✅ Mettre à jour une plainte
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

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
};
