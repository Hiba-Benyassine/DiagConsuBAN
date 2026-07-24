const Solution = require('../models/Solution');

// Crée une nouvelle solution
exports.createSolution = async (req, res) => {
  try {
    const { title, description, module, steps, sqlQueries } = req.body;
    const solution = await Solution.create({ title, description, module, steps, sqlQueries });
    res.status(201).json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère toutes les solutions
exports.getAllSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find();
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupère une solution par ID
exports.getSolutionById = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ message: 'Solution non trouvée' });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
