const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.get('/', logController.getAllLogs);
router.post('/', logController.createLog);
router.get('/:id', logController.getLogById);
router.put('/:id', logController.updateLog);
router.delete('/:id', logController.deleteLog);

module.exports = router;
