const User = require('../models/User');

// Recherche d'utilisateurs (autocomplete) - query param ?q=
exports.searchUsers = async (req, res) => {
  try {
    const q = req.query.q || '';
    const users = await User.find({ username: { $regex: q, $options: 'i' } })
      .select('username email role')
      .limit(10);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retourner le profil de l'utilisateur connecté (via auth middleware)
exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non autorisé' });
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
