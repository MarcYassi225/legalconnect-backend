// models/avis.js
const mongoose = require('mongoose');

const avisSchema = new mongoose.Schema({
  utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titre: { type: String, required: true },
  description: { type: String, required: true },
  fichier: { type: String },  // Pour ajouter un fichier, si nécessaire
  dateDepot: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Avis', avisSchema);
