const express = require('express');
const router = express.Router();
const userPermissionController = require('../controllers/userPermissionController');

router.get('/', userPermissionController.getAllUserPermissions);
router.post('/', userPermissionController.createUserPermission);
router.get('/:id', userPermissionController.getUserPermissionById);
router.put('/:id', userPermissionController.updateUserPermission);
router.delete('/:id', userPermissionController.deleteUserPermission);

module.exports = router;
