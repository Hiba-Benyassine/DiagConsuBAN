const Incident = require("../models/Incident");

// Créer un incident
exports.createIncident = async (req, res) => {
    try {
        const { titre, description, erp, module, erreur, priorite, infoComplementaires } = req.body;
        const incident = await Incident.create({
            titre,
            description,
            erp,
            module,
            erreur,
            priorite,
            infoComplementaires,
            createdBy: req.user ? req.user._id : null
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les incidents
exports.getIncidents = async (req, res) => {
    try {
        const { erp, module, status, limit } = req.query;
        const filter = {};
        if (erp) filter.erp = erp;
        if (module) filter.module = module;
        if (status) filter.status = status;

        const incidents = await Incident.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit ? parseInt(limit) : 100)
            .populate("createdBy", "nom prenom email");
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un incident par son ID
exports.getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id)
            .populate("createdBy", "nom prenom email")
            .populate("resolvedBy", "nom prenom email");
        if (!incident) return res.status(404).json({ message: "Incident non trouvé" });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un incident
exports.updateIncident = async (req, res) => {
    try {
        const { status, solution } = req.body;
        const incident = await Incident.findById(req.params.id);
        if (!incident) return res.status(404).json({ message: "Incident non trouvé" });

        if (status) incident.status = status;
        if (solution) {
            incident.solution = solution;
            incident.resolvedBy = req.user ? req.user._id : null;
        }

        await incident.save();
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
