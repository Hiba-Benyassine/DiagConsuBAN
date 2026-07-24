const Incident = require("../models/Incident");
const Solution = require("../models/Solution");

// GET /api/stats — Statistiques pour le dashboard
exports.getStats = async (req, res) => {
    try {
        const [
            incidentsOuverts,
            incidentsResolus,
            incidentsEnCours,
            solutionsValidees,
            totalIncidents
        ] = await Promise.all([
            Incident.countDocuments({ status: "Ouvert" }),
            Incident.countDocuments({ status: "Résolu" }),
            Incident.countDocuments({ status: "En cours" }),
            Solution.countDocuments({ validation: true }),
            Incident.countDocuments({})
        ]);

        const tauxResolution = totalIncidents > 0
            ? Math.round((incidentsResolus / totalIncidents) * 100)
            : 0;

        res.json({
            incidentsOuverts,
            incidentsResolus,
            incidentsEnCours,
            solutionsValidees,
            tauxResolution,
            total: totalIncidents
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
