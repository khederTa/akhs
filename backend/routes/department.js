const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const authenticateToken = require("../middleware/auth");

router.get("/", authenticateToken, departmentController.getAllDepartments);
router.post("/", authenticateToken, departmentController.createDepartment);
router.get("/:id", authenticateToken, departmentController.getDepartmentById);
router.put("/:id", authenticateToken, departmentController.updateDepartment);
router.delete("/:id", authenticateToken, departmentController.deleteDepartment);

module.exports = router;
