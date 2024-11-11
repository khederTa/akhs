const express = require("express");
const router = express.Router();
const activityTypeController = require("../controllers/activityTypeController");
const authenticateToken = require("../middleware/auth");
// const { authenticateRole } = require("../middleware/roleBasedAccess");

router.get(
  "/",
  authenticateToken,
  // authenticateRole,
  activityTypeController.getAllActivityTypes
);
router.post(
  "/",
  authenticateToken,
  // authenticateRole,
  activityTypeController.createActivityType
);
router.get(
  "/:id",
  authenticateToken,
  // authenticateRole,
  activityTypeController.getActivityTypeById
);
router.put(
  "/:id",
  authenticateToken,
  // authenticateRole,
  activityTypeController.updateActivityType
);
router.delete(
  "/:id",
  authenticateToken,
  // authenticateRole,
  activityTypeController.deleteActivityType
);

module.exports = router;
