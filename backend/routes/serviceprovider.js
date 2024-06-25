const express = require('express');
const router = express.Router();
const serviceProviderController = require('../controllers/serviceProviderController');

router.get('/', serviceProviderController.getAllServiceProviders);
router.post('/', serviceProviderController.createServiceProvider);
router.get('/:id', serviceProviderController.getServiceProviderById);
router.put('/:id', serviceProviderController.updateServiceProvider);
router.delete('/:id', serviceProviderController.deleteServiceProvider);

module.exports = router;
