const express = require('express');
const router = express.Router();
const { createSolution, getAllSolutions, getSolutionById } = require('../controllers/solutionController');
const { protect } = require('../middleware/authMiddleware');

// Crée une nouvelle solution (protégé)
router.post('/', protect, createSolution);

// Récupère toutes les solutions
router.get('/', getAllSolutions);

// Récupère une solution par son ID
router.get('/:id', getSolutionById);

module.exports = router;
