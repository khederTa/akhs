const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, serviceProviderController.getAllServiceProviders);
router.post('/', authenticateToken, serviceProviderController.createServiceProvider);
router.post('/promote', authenticateToken, serviceProviderController.promoteVolunteer);
router.get('/:id', authenticateToken, serviceProviderController.getServiceProviderById);
router.put('/:id', authenticateToken, serviceProviderController.updateServiceProvider);
router.delete('/:id', authenticateToken, serviceProviderController.deleteServiceProvider);

module.exports = router;
