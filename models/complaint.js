const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    utilisateur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Référence au modèle User
      required: true,
    },
    statut: {
      type: String,
      enum: ["en cours", "résolu", "fermé"],
      default: "en cours",
    },
    pieces_jointes: {
      type: [String], // Tableau pour les URLs des fichiers (optionnel)
      default: [],
    },
    historique_actions: [
      {
        action: String, // Description de l'action (ex: "Consultation avocat")
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    date_creation: {
      type: Date,
      default: Date.now,
    },
    date_maj: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Gère automatiquement les champs `createdAt` et `updatedAt`
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
