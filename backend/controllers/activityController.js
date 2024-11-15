const {
  Activity,
  Session,
  VolunteerAttendedSessions,
  VolunteerAttendedActivity,
} = require("../models");

exports.getAllActivities = async (req, res) => {
  const Activities = await Activity.findAll({ attributes: ["id", "title", "done"] });
  res.json(Activities);
};

exports.createActivity = async (req, res) => {
  const { activityData, sessionsData, invitedVolunteersData } = req.body;

  const activity = await Activity.create(activityData);

  const activityId = activity.id;

  sessionsData.sessions.map(async (sessionDate) => {
    const {
      sessionName,
      dateValue,
      hallName,
      startTime,
      endTime,
      trainerName,
      providerNames,
    } = sessionDate;
    const session = await Session.create({
      name: sessionName,
      hall_name: hallName,
      date: dateValue,
      startTime: startTime,
      endTime: endTime,
      activityId,
    });

    const trainerIds = trainerName.map((trainer) => trainer.value);

    // Set the associations
    if (trainerIds && trainerIds.length > 0) {
      await session.addServiceProviders(trainerIds); // Link trainers as service providers
    }
    const serviceProviderIds = providerNames.map((provider) => provider.value);
    if (serviceProviderIds && serviceProviderIds.length > 0) {
      await session.addServiceProviders(serviceProviderIds); // Link service providers
    }

    const sessionId = session.id;

    invitedVolunteersData.volunteerIds.map((volunteerData) => {
      VolunteerAttendedSessions.create({
        volunteerId: volunteerData,
        sessionId,
        status: "invited",
      });
    });
  });

  invitedVolunteersData.volunteerIds.map((volunteerData) => {
    VolunteerAttendedActivity.create({
      volunteerId: volunteerData,
      activityId,
      status: "invited",
    });
  });

  res.json({ message: "Activity Added" });
};

exports.getActivityById = async (req, res) => {
  const Activity = await Activity.findByPk(req.params.id);
  res.json(Activity);
};

exports.updateActivity = async (req, res) => {
  await Activity.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Activity updated" });
};

exports.deleteActivity = async (req, res) => {
  await Activity.destroy({ where: { id: req.params.id } });
  res.json({ message: "Activity deleted" });
};
