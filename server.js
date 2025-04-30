const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profilRoutes = require("./routes/profil"); // 👈 On ajoute le fichier profil
const complaintRoutes = require("./routes/complaintRoutes"); // 👈 Ajout des routes de plainte
const homeRoutes = require("./routes/homeRoutes"); // 👈 Ajout des routes pour l'accueil
const avisRoutes = require("./routes/avisRoutes");  // Pour le dépôt d'avis

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares globaux
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);      // Pour /api/signup et /api/login
app.use("/api", userRoutes);      // (si tu as déjà des routes dans userRoutes)
app.use("/api", profilRoutes);    // 👈 Ajoute celle-ci pour /api/profil
app.use("/api", complaintRoutes); // 👈 Ajout des routes pour les plaintes
app.use("/api", homeRoutes);      // 👈 Ajoute celle-ci pour /api/accueil
app.use("/api", avisRoutes);  // Ajoute la route pour déposer un avis

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
