const mongoose = require("mongoose");

const diagnosticSchema = new mongoose.Schema({
  incident: { type: mongoose.Schema.Types.ObjectId, ref: "Incident", required: true },
  aiResult: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Diagnostic", diagnosticSchema);
