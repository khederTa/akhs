const express = require("express");
const fileController = require("../controllers/fileController");
const router = express.Router();

router.post("/", fileController.createFile);
router.get("/:id", fileController.getFile);
router.put("/:id", fileController.updateFile);
router.delete("/:id", fileController.deleteFile);

module.exports = router;
