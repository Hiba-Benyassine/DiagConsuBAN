const express = require('express');
const router = express.Router();
const { searchUsers, getProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Recherche d'utilisateurs (public)
router.get('/search', searchUsers);

// Profil de l'utilisateur connecté (protégé)
router.get('/profile', protect, getProfile);

module.exports = router;