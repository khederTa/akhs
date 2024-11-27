// controllers/VolunteerAttendedActivityController.js
const { VolunteerAttendedActivity , Volunteer  , Person} = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");

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

// Get all volunteers who attended a specific activity
exports.getVolunteersByActivity = async (req, res) => {
  const { activityId } = req.params;

  try {
    if (!activityId) {
      return res.status(400).json({ error: "activityId is required." });
    }

    const volunteers = await db.sequelize.query(
      `
      SELECT 
        v.volunteerId, 
        v.active_status, 
        p.id AS personId, 
        p.fname, 
        p.lname, 
        p.gender
      FROM 
        akhs.volunteers AS v
      INNER JOIN 
        akhs.volunteerattendedactivity AS vaa 
        ON v.volunteerId = vaa.volunteerId
      INNER JOIN 
        akhs.persons AS p 
        ON v.personId = p.id
      WHERE 
        vaa.activityId = :activityId
        
      `,
      {
        replacements: { activityId },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (volunteers.length === 0) {
      return res.status(404).json({ message: "No volunteers found for this activity." });
    }

    res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
    res.status(500).json({ error: "An error occurred while fetching volunteers." });
  }
};



// Get a specific VolunteerAttendedActivity by volunteerId and activityId
exports.getVolunteerAttendedActivityByIds = async (req, res) => {
  const { volunteerId, activityId } = req.params;
  const record = await VolunteerAttendedActivity.findOne({
    where: { volunteerId, activityId },
  });
  res.json(record);
};

// Update a VolunteerAttendedActivity record by volunteerId and activityId
exports.updateVolunteerAttendedActivity = async (req, res) => {
  const { volunteerId, activityId } = req.params;
  const { attended, notes } = req.body;
  const status = attended ? "attended" : "unattended";
  if (status) {
    await VolunteerAttendedActivity.update(
      { status },
      {
        where: { volunteerId, activityId },
      }
    );
  }
  if (notes) {
    await VolunteerAttendedActivity.update(
      { notes },
      {
        where: { volunteerId, activityId },
      }
    );
  }
  res.json({ message: "VolunteerAttendedActivity updated" });
};

// Delete a VolunteerAttendedActivity record by volunteerId and activityId
exports.deleteVolunteerAttendedActivity = async (req, res) => {
  const { volunteerId, activityId } = req.params;
  await VolunteerAttendedActivity.destroy({
    where: { volunteerId, activityId },
  });
  res.json({ message: "VolunteerAttendedActivity deleted" });
};
