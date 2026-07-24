const mongoose = require("mongoose");

const knowledgeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: String, required: true },
    solution: { type: String, required: true },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Knowledge", knowledgeSchema);
