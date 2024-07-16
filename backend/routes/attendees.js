const express = require('express');
const router = express.Router();
const attendeesController = require('../controllers/attendeesController');
const authenticateToken = require("../middleware/auth");

router.get('/', authenticateToken, attendeesController.getAllAttendees);
router.post('/', authenticateToken, attendeesController.createAttendee);
router.get('/:id', authenticateToken, attendeesController.getAttendeeById);
router.put('/:id', authenticateToken, attendeesController.updateAttendee);
router.delete('/:id', authenticateToken, attendeesController.deleteAttendee);

module.exports = router;
