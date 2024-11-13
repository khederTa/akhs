// routes/volunteerAttendedSessionsRoutes.js
const express = require('express');
const router = express.Router();
const volunteerAttendedSessionsController = require('../controllers/VolunteerAttendedSessionsController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, volunteerAttendedSessionsController.getAllVolunteerAttendedSessions);
router.post('/', authenticateToken, volunteerAttendedSessionsController.createVolunteerAttendedSession);
router.get('/:volunteerId/:sessionId', authenticateToken, volunteerAttendedSessionsController.getVolunteerAttendedSessionByIds);
router.put('/:volunteerId/:sessionId', authenticateToken, volunteerAttendedSessionsController.updateVolunteerAttendedSession);
router.delete('/:volunteerId/:sessionId', authenticateToken, volunteerAttendedSessionsController.deleteVolunteerAttendedSession);

module.exports = router;
