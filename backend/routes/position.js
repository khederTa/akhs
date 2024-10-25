const express = require("express");
const router = express.Router();
const positionController = require("../controllers/positionController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, positionController.getAllPositions);
router.post("/", authenticateToken, positionController.createPosition);
router.get("/:id", authenticateToken, positionController.getPositionById);
router.put("/:id", authenticateToken, positionController.updatePosition);
router.delete("/:id", authenticateToken, positionController.deletePosition);

module.exports = router;
