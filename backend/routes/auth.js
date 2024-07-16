const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require("../middleware/auth");

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh-token', authenticateToken, authController.refreshToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
