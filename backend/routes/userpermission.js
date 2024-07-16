const express = require('express');
const router = express.Router();
const userPermissionController = require('../controllers/userPermissionController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, userPermissionController.getAllUserPermissions);
router.post('/', authenticateToken, userPermissionController.createUserPermission);
router.get('/:id', authenticateToken, userPermissionController.getUserPermissionById);
router.put('/:id', authenticateToken, userPermissionController.updateUserPermission);
router.delete('/:id', authenticateToken, userPermissionController.deleteUserPermission);

module.exports = router;
