// controllers/VolunteerAttendedSessionsController.js
const { VolunteerAttendedSessions } = require("../models");

// Get all VolunteerAttendedSessions records
exports.getAllVolunteerAttendedSessions = async (req, res) => {
  const records = await VolunteerAttendedSessions.findAll();
  res.json(records);
};

// Create a new VolunteerAttendedSessions record
exports.createVolunteerAttendedSession = async (req, res) => {
  const record = await VolunteerAttendedSessions.create(req.body);
  res.json(record);
};

// Get a specific VolunteerAttendedSession by volunteerId and sessionId
exports.getVolunteerAttendedSessionByIds = async (req, res) => {
  const { volunteerId, sessionId } = req.params;
  const record = await VolunteerAttendedSessions.findOne({
    where: { volunteerId, sessionId },
  });
  res.json(record);
};

// Update a VolunteerAttendedSession record by volunteerId and sessionId
exports.updateVolunteerAttendedSession = async (req, res) => {
  const { volunteerId, sessionId } = req.params;
  const { attended } = req.body;
  const status = attended ? "attended" : "unattended";
  await VolunteerAttendedSessions.update(
    { status },
    {
      where: { volunteerId, sessionId },
    }
  );
  res.json({ message: "VolunteerAttendedSession updated" });
};

// Delete a VolunteerAttendedSession record by volunteerId and sessionId
exports.deleteVolunteerAttendedSession = async (req, res) => {
  const { volunteerId, sessionId } = req.params;
  await VolunteerAttendedSessions.destroy({
    where: { volunteerId, sessionId },
  });
  res.json({ message: "VolunteerAttendedSession deleted" });
};
