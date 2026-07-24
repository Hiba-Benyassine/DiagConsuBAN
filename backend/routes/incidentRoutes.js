const express = require("express");
const router = express.Router();
const { createIncident, getIncidents, getIncidentById, updateIncident } = require("../controllers/incidentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createIncident);
router.get("/", getIncidents);
router.get("/:id", getIncidentById);
router.put("/:id", protect, updateIncident);

module.exports = router;
