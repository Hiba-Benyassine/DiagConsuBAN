const express = require("express");
const router = express.Router();
const { diagnoseProblem, addKnowledge } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

router.post("/diagnose", diagnoseProblem);
router.post("/knowledge", protect, addKnowledge);

module.exports = router;
