const mongoose = require("mongoose");

const solutionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  module: { type: String, required: true }, // ex: "Oracle AP", "Odoo CRM"
  steps: [{ type: String }],
  sqlQueries: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Solution", solutionSchema);
