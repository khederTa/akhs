const express = require('express');
const router = express.Router();
const trainingTypeController = require('../controllers/trainingTypeController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, trainingTypeController.getAllTrainingTypes);
router.post('/', authenticateToken, trainingTypeController.createTrainingType);
router.get('/:id', authenticateToken, trainingTypeController.getTrainingTypeById);
router.put('/:id', authenticateToken, trainingTypeController.updateTrainingType);
router.delete('/:id', authenticateToken, trainingTypeController.deleteTrainingType);

module.exports = router;
