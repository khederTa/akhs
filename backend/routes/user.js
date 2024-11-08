const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/auth");
// const specificPermissionAccess = require("../middleware/specificPermissionAccess");
// const blacklistAccess = require("../middleware/blacklistAccess");

router.get(
  "/",
  authenticateToken,
  userController.getAllUsers
);
router.post("/", authenticateToken, userController.createUser);
router.post("/promote", authenticateToken, userController.promoteVolunteer);
router.get("/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
