// controllers/VolunteerAttendedActivityController.js
const { VolunteerAttendedActivity } = require('../models');

// Get all VolunteerAttendedActivity records
exports.getAllVolunteerAttendedActivities = async (req, res) => {
    const records = await VolunteerAttendedActivity.findAll();
    res.json(records);
};

// Create a new VolunteerAttendedActivity record
exports.createVolunteerAttendedActivity = async (req, res) => {
    const record = await VolunteerAttendedActivity.create(req.body);
    res.json(record);
};

// Get a specific VolunteerAttendedActivity by volunteerId and activityId
exports.getVolunteerAttendedActivityByIds = async (req, res) => {
    const { volunteerId, activityId } = req.params;
    const record = await VolunteerAttendedActivity.findOne({ where: { volunteerId, activityId } });
    res.json(record);
};

// Update a VolunteerAttendedActivity record by volunteerId and activityId
exports.updateVolunteerAttendedActivity = async (req, res) => {
    const { volunteerId, activityId } = req.params;
    await VolunteerAttendedActivity.update(req.body, { where: { volunteerId, activityId } });
    res.json({ message: 'VolunteerAttendedActivity updated' });
};

// Delete a VolunteerAttendedActivity record by volunteerId and activityId
exports.deleteVolunteerAttendedActivity = async (req, res) => {
    const { volunteerId, activityId } = req.params;
    await VolunteerAttendedActivity.destroy({ where: { volunteerId, activityId } });
    res.json({ message: 'VolunteerAttendedActivity deleted' });
};
