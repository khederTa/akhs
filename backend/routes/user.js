const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, userController.getAllUsers);
router.post('/', authenticateToken, userController.createUser);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, userController.updateUser);
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;
