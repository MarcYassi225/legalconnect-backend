const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  nom: { type: String },
  prenom: { type: String },
  role: { type: String, enum: ["particulier", "juridique"], required: true },
  specialite: { type: String },
  telephone: { type: String },
  ville: { type: String },
  siteInternet: { type: String }, // <= NOUVEAU
  notes: [{ type: Number, min: 1, max: 5 }], // <= NOUVEAU
  commentaires: [
    {
      auteurId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      auteurNom: { type: String },
      texte: { type: String },
      date: { type: Date, default: Date.now }
    }
  ], // <= NOUVEAU
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
