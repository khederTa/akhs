const express = require('express');
const router = express.Router();
const draftActivityController = require('../controllers/draftActivityController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, draftActivityController.getAllDraftActivities);
router.post('/', authenticateToken, draftActivityController.createDraftActivity);
router.get('/:id', authenticateToken, draftActivityController.getDraftActivityById);
router.put('/:id', authenticateToken, draftActivityController.updateDraftActivity);
router.delete('/:id', authenticateToken, draftActivityController.deleteDraftActivity);

module.exports = router;
