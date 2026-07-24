const Knowledge = require('../models/Knowledge');

// Crée une entrée de connaissance
exports.createKnowledge = async (req, res) => {
  try {
    const { title, description, module, solution, tags } = req.body;
    const knowledge = await Knowledge.create({ title, description, module, solution, tags });
    res.status(201).json(knowledge);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère toutes les connaissances
exports.getAllKnowledge = async (req, res) => {
  try {
    const items = await Knowledge.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère une connaissance par ID
exports.getKnowledgeById = async (req, res) => {
  try {
    const item = await Knowledge.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Connaissance non trouvée' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
