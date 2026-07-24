require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connexion à MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API DiagConsuBAN – Assistant IA ERP 🚀");
});

// Enregistrement des routes d'API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/solutions", require("./routes/solutionRoutes"));
app.use("/api/knowledge", require("./routes/knowledgeRoutes"));
app.use("/api/diagnostics", require("./routes/diagnosticRoutes"));
app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur DiagConsuBAN démarré sur le port ${PORT}`);
});