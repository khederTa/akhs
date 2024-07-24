const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticateToken = require("../middleware/auth");
const { authenticateRole } = require('../middleware/roleBasedAccess');

router.get('/', authenticateToken, authenticateRole, addressController.getAllAddresses);
router.post('/', authenticateToken, addressController.createAddress);
router.get('/:id', authenticateToken, addressController.getAddressById);
router.put('/:id', authenticateToken, addressController.updateAddress);
router.delete('/:id', authenticateToken, addressController.deleteAddress);

module.exports = router;
