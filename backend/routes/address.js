const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authenticateToken = require("../middleware/auth");
const { authenticatePermission } = require('../middleware/roleBasedAccess');

router.get('/', authenticateToken, authenticatePermission, addressController.getAllAddresses);
router.post('/', authenticateToken, addressController.createAddress);
router.get('/:id', authenticateToken, authenticatePermission, addressController.getAddressById);
router.put('/:id', authenticateToken, addressController.updateAddress);
router.delete('/:id', authenticateToken, addressController.deleteAddress);

module.exports = router;
