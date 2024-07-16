const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, addressController.getAllAddresses);
router.post('/', authenticateToken, addressController.createAddress);
router.get('/:id', authenticateToken, addressController.getAddressById);
router.put('/:id', authenticateToken, addressController.updateAddress);
router.delete('/:id', authenticateToken, addressController.deleteAddress);

module.exports = router;
