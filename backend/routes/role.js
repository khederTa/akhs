const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const authenticateToken = require("../middleware/auth");
const { authenticateRole } = require("../middleware/roleBasedAccess");

router.get(
  "/",
  authenticateToken,
  authenticateRole,
  roleController.getAllRoles
);
// router.post("/", authenticateToken, roleController.createRole);
// router.get("/:id", authenticateToken, roleController.getRoleById);
// router.put("/:id", authenticateToken, roleController.updateRole);
// router.delete("/:id", authenticateToken, roleController.deleteRole);

module.exports = router;
