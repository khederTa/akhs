const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, logController.getAllLogs);
router.post("/", authenticateToken, logController.createLog);
router.get("/:id", authenticateToken, logController.getLogById);
router.put("/:id", authenticateToken, logController.updateLog);
router.delete("/:id", authenticateToken, logController.deleteLog);

module.exports = router;
