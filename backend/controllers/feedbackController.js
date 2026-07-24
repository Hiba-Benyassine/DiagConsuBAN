const Feedback = require('../models/Feedback');

// Ajouter un feedback
exports.addFeedback = async (req, res) => {
  try {
    const { user, incident, rating, comment } = req.body;
    const feedback = await Feedback.create({ user, incident, rating, comment });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lister tous les feedbacks (optionnel filtrage par utilisateur)
exports.listFeedback = async (req, res) => {
  try {
    const filter = {};
    if (req.query.user) filter.user = req.query.user;
    const feedbacks = await Feedback.find(filter).populate('user', 'username email');
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
