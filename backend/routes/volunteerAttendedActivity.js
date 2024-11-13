// routes/volunteerAttendedActivityRoutes.js
const express = require('express');
const router = express.Router();
const volunteerAttendedActivityController = require('../controllers/VolunteerAttendedActivityController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, volunteerAttendedActivityController.getAllVolunteerAttendedActivities);
router.post('/', authenticateToken, volunteerAttendedActivityController.createVolunteerAttendedActivity);
router.get('/:volunteerId/:activityId', authenticateToken, volunteerAttendedActivityController.getVolunteerAttendedActivityByIds);
router.put('/:volunteerId/:activityId', authenticateToken, volunteerAttendedActivityController.updateVolunteerAttendedActivity);
router.delete('/:volunteerId/:activityId', authenticateToken, volunteerAttendedActivityController.deleteVolunteerAttendedActivity);

module.exports = router;
