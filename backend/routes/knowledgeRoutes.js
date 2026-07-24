const express = require('express');
const router = express.Router();
const { createKnowledge, getAllKnowledge, getKnowledgeById } = require('../controllers/knowledgeController');
const { protect } = require('../middleware/authMiddleware');

// Crée une connaissance (protégé)
router.post('/', protect, createKnowledge);

// Récupère toutes les connaissances
router.get('/', getAllKnowledge);

// Récupère une connaissance par ID
router.get('/:id', getKnowledgeById);

module.exports = router;