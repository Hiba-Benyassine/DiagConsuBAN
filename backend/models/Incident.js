const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true }, // ex: "Oracle AP", "Odoo CRM"
    technicalDetails: { type: String },
    status: { type: String, enum: ["nouveau", "en_cours", "resolu"], default: "nouveau" },
    solution: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Incident", incidentSchema);
