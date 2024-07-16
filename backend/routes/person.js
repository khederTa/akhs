const express = require("express");
const router = express.Router();
const personController = require("../controllers/personController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, personController.getAllPersons);
router.post("/", authenticateToken, personController.createPerson);
router.get("/:id", authenticateToken, personController.getPersonById);
router.put("/:id", authenticateToken, personController.updatePerson);
router.delete("/:id", authenticateToken, personController.deletePerson);

module.exports = router;
