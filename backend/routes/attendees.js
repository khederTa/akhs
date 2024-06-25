const express = require('express');
const router = express.Router();
const attendeesController = require('../controllers/attendeesController');

router.get('/', attendeesController.getAllAttendees);
router.post('/', attendeesController.createAttendee);
router.get('/:id', attendeesController.getAttendeeById);
router.put('/:id', attendeesController.updateAttendee);
router.delete('/:id', attendeesController.deleteAttendee);

module.exports = router;
