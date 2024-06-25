const express = require('express');
const router = express.Router();
const draftActivityController = require('../controllers/draftActivityController');

router.get('/', draftActivityController.getAllDraftActivities);
router.post('/', draftActivityController.createDraftActivity);
router.get('/:id', draftActivityController.getDraftActivityById);
router.put('/:id', draftActivityController.updateDraftActivity);
router.delete('/:id', draftActivityController.deleteDraftActivity);

module.exports = router;
