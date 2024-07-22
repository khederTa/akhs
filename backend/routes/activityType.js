const express = require("express");
const router = express.Router();
const activityTypeController = require("../controllers/activityTypeController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, activityTypeController.getAllActivityTypes);
router.post("/", authenticateToken, activityTypeController.createActivityType);
router.get(
  "/:id",
  authenticateToken,
  activityTypeController.getActivityTypeById
);
router.put(
  "/:id",
  authenticateToken,
  activityTypeController.updateActivityType
);
router.delete(
  "/:id",
  authenticateToken,
  activityTypeController.deleteActivityType
);

module.exports = router;
