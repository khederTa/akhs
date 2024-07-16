const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, packageController.getAllPackages);
router.post("/", authenticateToken, packageController.createPackage);
router.get("/:id", authenticateToken, packageController.getPackageById);
router.put("/:id", authenticateToken, packageController.updatePackage);
router.delete("/:id", authenticateToken, packageController.deletePackage);

module.exports = router;
