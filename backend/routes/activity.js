const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, activityController.getAllActivities);
router.post("/", authenticateToken, activityController.createActivity);
router.get("/:id", authenticateToken, activityController.getActivityById);
router.put("/:id", authenticateToken, activityController.updateActivity);
router.delete("/:id", authenticateToken, activityController.deleteActivity);
router.get("/volunteer-activity/:id", activityController.getCompletedActivity);

module.exports = router;
