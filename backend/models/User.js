const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nom: { type: String },
    prenom: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["consultant", "expert", "admin"], default: "consultant" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
