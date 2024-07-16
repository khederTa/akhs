const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, permissionController.getAllPermissions);
router.post('/', authenticateToken, permissionController.createPermission);
router.get('/:id', authenticateToken, permissionController.getPermissionById);
router.put('/:id', authenticateToken, permissionController.updatePermission);
router.delete('/:id', authenticateToken, permissionController.deletePermission);

module.exports = router;
