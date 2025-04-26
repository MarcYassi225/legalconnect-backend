const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  nom_fichier: { type: String, required: true },
  type: { type: String, required: true },
  url: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date_upload: { type: Date, default: Date.now }
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  statut: { type: String, enum: ["en cours", "résolue", "fermée"], default: "en cours" },
  pieces_jointes: { type: [String], default: [] },
  historique_actions: [{
    action: String,
    date: { type: Date, default: Date.now },
  }],
  chat: [{
    expediteur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
  }],
  coffre_fort: { type: [fileSchema], default: [] },
  date_creation: { type: Date, default: Date.now },
  date_maj: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);