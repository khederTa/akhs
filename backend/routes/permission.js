const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");
const authenticateToken = require("../middleware/auth");
const blacklistAccess = require("../middleware/blacklistAccess");

router.get("/", authenticateToken, permissionController.getAllPermissions);
router.post("/", authenticateToken, permissionController.createPermission);
router.get(
  "/:id",
  authenticateToken,
  blacklistAccess,
  roleAccess,
  permissionController.getPermissionById
);
router.put("/:id", authenticateToken, permissionController.updatePermission);
router.delete("/:id", authenticateToken, permissionController.deletePermission);

module.exports = router;
