const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/change-password/:id", authController.changePassword);
router.put(
  "/change-password-by-admin/:id",
  authenticateToken,
  authController.changePasswordByAdmin
);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
