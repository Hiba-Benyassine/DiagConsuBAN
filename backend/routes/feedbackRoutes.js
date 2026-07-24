const express = require('express');
const router = express.Router();
const { addFeedback, listFeedback } = require('../controllers/feedbackController');

router.post('/', addFeedback);
router.get('/', listFeedback);

module.exports = router;