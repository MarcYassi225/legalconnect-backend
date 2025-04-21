const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profilRoutes = require("./routes/profil"); // 👈 On ajoute le nouveau fichier ici

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);      // Pour /api/signup et /api/login
app.use("/api", userRoutes);      // (si tu as déjà des routes dans userRoutes)
app.use("/api", profilRoutes);    // 👈 Ajoute celle-ci pour /api/profil

// Connexion MongoDB
mongoose.connect("mongodb+srv://legaladmin:admin@legalconnect-cluster.egsxquw.mongodb.net/legalconnect?retryWrites=true&w=majority", {})
  .then(() => {
    console.log("✅ Connecté à MongoDB !");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur backend en ligne sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Erreur MongoDB :", error);
  });
