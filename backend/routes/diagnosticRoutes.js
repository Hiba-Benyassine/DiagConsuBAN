const express = require('express');
const router = express.Router();
const { getAllDiagnostics, getDiagnosticById, createDiagnostic } = require('../controllers/diagnosticController');

// Liste tous les diagnostics
router.get('/', getAllDiagnostics);
// Récupère un diagnostic par ID
router.get('/:id', getDiagnosticById);
// Crée un nouveau diagnostic (généralement appelé par l'IA)
router.post('/', createDiagnostic);

module.exports = router;
