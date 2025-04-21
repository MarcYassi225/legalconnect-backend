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
      ref: "User",
      required: true,
    },
    statut: {
      type: String,
      enum: ["en cours", "résolue", "fermée"],
      default: "en cours",
    },
    pieces_jointes: {
      type: [String],
      default: [],
    },
    historique_actions: [
      {
        action: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    chat: [
      {
        expediteur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
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
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
