const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, required: true },
    erp: { type: String, enum: ["Oracle", "Odoo"], required: true },
    module: { type: String, required: true },
    erreur: { type: String },
    priorite: { type: String, enum: ["Faible", "Moyenne", "Haute", "Critique"], default: "Moyenne" },
    status: { type: String, enum: ["Ouvert", "En cours", "Résolu"], default: "Ouvert" },
    solution: { type: String },
    infoComplementaires: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
