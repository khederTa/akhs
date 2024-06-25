const { Attendees } = require('../models');

exports.getAllAttendees = async (req, res) => {
    const attendees = await Attendees.findAll();
    res.json(attendees);
};

exports.createAttendee = async (req, res) => {
    const attendee = await Attendees.create(req.body);
    res.json(attendee);
};

exports.getAttendeeById = async (req, res) => {
    const attendee = await Attendees.findByPk(req.params.id);
    res.json(attendee);
};

exports.updateAttendee = async (req, res) => {
    await Attendees.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Attendee updated' });
};

exports.deleteAttendee = async (req, res) => {
    await Attendees.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Attendee deleted' });
};
