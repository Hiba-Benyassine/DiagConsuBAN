const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Inscription
exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Utilisateur déjà existant" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role: role || "consultant"
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
        res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Connexion
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Identifiants invalides" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Identifiants invalides" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
