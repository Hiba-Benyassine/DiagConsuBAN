const Diagnostic = require('../models/Diagnostic');

// Retourner tous les diagnostics
exports.getAllDiagnostics = async (req, res) => {
  try {
    const diagnostics = await Diagnostic.find();
    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retourner un diagnostic par ID
exports.getDiagnosticById = async (req, res) => {
  try {
    const diagnostic = await Diagnostic.findById(req.params.id);
    if (!diagnostic) return res.status(404).json({ message: 'Diagnostic non trouvé' });
    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un diagnostic (généralement appelé par l'IA)
exports.createDiagnostic = async (req, res) => {
  try {
    const { incident, aiResult } = req.body;
    const newDiag = await Diagnostic.create({ incident, aiResult });
    res.status(201).json(newDiag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
