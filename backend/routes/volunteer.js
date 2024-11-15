const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, volunteerController.getAllVolunteers);
router.post("/", authenticateToken, volunteerController.createVolunteer);
router.get("/:id", authenticateToken, volunteerController.getVolunteerById);
router.put("/:id", authenticateToken, volunteerController.updateVolunteer);
router.delete("/:id", authenticateToken, volunteerController.deleteVolunteer);
router.get("/:activityTypeId/eligible-volunteer", authenticateToken, volunteerController.getVolunteersForActivityTypePrerequisites);

module.exports = router;
