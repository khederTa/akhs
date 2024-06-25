const express = require('express');
const router = express.Router();
const trainingTypeController = require('../controllers/trainingTypeController');

router.get('/', trainingTypeController.getAllTrainingTypes);
router.post('/', trainingTypeController.createTrainingType);
router.get('/:id', trainingTypeController.getTrainingTypeById);
router.put('/:id', trainingTypeController.updateTrainingType);
router.delete('/:id', trainingTypeController.deleteTrainingType);

module.exports = router;
