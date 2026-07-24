const Incident = require("../models/Incident");

// Créer un incident
exports.createIncident = async (req, res) => {
    try {
        const { title, description, module, technicalDetails } = req.body;
        const incident = await Incident.create({
            title,
            description,
            module,
            technicalDetails
        });
        res.status(201).json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir tous les incidents
exports.getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().populate("resolvedBy", "username email");
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un incident par son ID
exports.getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id).populate("resolvedBy", "username email");
        if (!incident) return res.status(404).json({ message: "Incident non trouvé" });
        res.json(incident);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mettre à jour un incident (ex: résolution)
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
