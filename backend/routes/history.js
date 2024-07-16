const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, historyController.getAllHistories);
router.post("/", authenticateToken, historyController.createHistory);
router.get("/:id", authenticateToken, historyController.getHistoryById);
router.put("/:id", authenticateToken, historyController.updateHistory);
router.delete("/:id", authenticateToken, historyController.deleteHistory);

module.exports = router;
