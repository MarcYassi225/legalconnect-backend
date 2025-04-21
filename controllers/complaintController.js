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

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({ error: "Plainte introuvable." });
    }

    if (complaint.utilisateur.toString() !== req.user.id.toString()) {
      return res.status(403).json({ error: "Non autorisé à modifier cette plainte." });
    }

    complaint.statut = statut;
    complaint.date_maj = new Date();
    await complaint.save();

    res.status(200).json({
      message: "Statut de la plainte mis à jour avec succès.",
      complaint,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// ✅ Ajouter un message dans le chat d'une plainte
const addChatMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Le message est requis." });
    }

    const plainte = await Complaint.findById(id);
    if (!plainte) {
      return res.status(404).json({ message: "Plainte non trouvée." });
    }

    const newMessage = {
      expediteur: req.user.id,
      message,
      date: new Date(),
    };

    plainte.chat.push(newMessage);
    plainte.date_maj = new Date();

    await plainte.save();

    res.status(200).json({
      message: "Message ajouté au chat.",
      chat: plainte.chat,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage, // ✅ export du contrôleur du chat
};
