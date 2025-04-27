const Complaint = require("../models/complaint");
const fs = require("fs");
const path = require("path");

// Créer une plainte
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
      message: "Plainte créée avec succès",
      complaint: newComplaint,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Récupérer toutes les plaintes
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ utilisateur: req.user.id });
    res.status(200).json({
      message: "Plaintes récupérées avec succès",
      complaints,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Récupérer une plainte par ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("utilisateur");
    
    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(200).json({
      message: "Plainte récupérée avec succès",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Mettre à jour une plainte
const updateComplaint = async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(200).json({
      message: "Plainte mise à jour avec succès",
      complaint: updatedComplaint,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Mettre à jour le statut
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    complaint.statut = req.body.statut;
    complaint.date_maj = new Date();
    await complaint.save();

    res.status(200).json({
      message: "Statut mis à jour avec succès",
      complaint,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Ajouter un message au chat
const addChatMessage = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    complaint.chat.push({
      expediteur: req.user.id,
      message: req.body.message,
    });

    await complaint.save();

    res.status(200).json({
      message: "Message ajouté avec succès",
      chat: complaint.chat,
    });
  } catch (err) {
    res.status(500).json({ 
      error: "Erreur serveur", 
      details: err.message 
    });
  }
};

// Ajouter un fichier au coffre-fort
const addCoffreFortFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    const fileData = {
      nom_fichier: req.file.originalname,
      type: req.file.mimetype,
      url: `/uploads/${req.file.filename}`,
      auteur: req.user.id
    };

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $push: { coffre_fort: fileData } },
      { new: true, runValidators: true }
    );
    
    if (!updatedComplaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    res.status(201).json({
      message: "Fichier ajouté avec succès",
      file: fileData,
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error("Erreur critique:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
};

// ✅ Fonction corrigée pour supprimer un fichier du coffre-fort
const deleteCoffreFortFile = async (req, res) => {
  try {
    const { complaintId, fileId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: "Plainte non trouvée" });
    }

    // Vérifie que le fichier existe
    const file = complaint.coffre_fort.id(fileId);
    if (!file) {
      return res.status(404).json({ error: "Fichier non trouvé dans le coffre-fort" });
    }

    // Supprimer le fichier du tableau
    complaint.coffre_fort = complaint.coffre_fort.filter(f => f._id.toString() !== fileId);

    complaint.date_maj = new Date();
    await complaint.save();

    res.status(200).json({ message: "Fichier supprimé du coffre-fort avec succès" });
  } catch (error) {
    console.error("Erreur suppression fichier :", error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};


module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  updateComplaintStatus,
  addChatMessage,
  addCoffreFortFile,
  deleteCoffreFortFile, // ✅ export aussi ici
};
