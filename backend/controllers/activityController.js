const {
  Activity,
  Session,
  VolunteerAttendedSessions,
  VolunteerAttendedActivity,
  ActivityType,
  Department,
  Volunteer,
  Position,
  Person,
  ServiceProvider,
  File,
  Address,
} = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");

exports.getAllActivities = async (req, res) => {
  const Activities = await Activity.findAll({
    attributes: [
      "id",
      "title",
      "done",
      "numSessions",
      "minSessions",
      "startDate",
    ],
  });
  res.json(Activities);
};

exports.createActivity = async (req, res) => {
  const { activityData, sessionsData, invitedVolunteersData } = req.body;

  const activity = await Activity.create(activityData);

  const activityId = activity.id;

  sessionsData.sessions.map(async (sessionDate) => {
    const {
      // id,
      sessionName,
      dateValue,
      hallName,
      startTime,
      endTime,
      // trainerName,
      providerNames,
    } = sessionDate;
    const session = await Session.create({
      // id:id,
      name: sessionName,
      hall_name: hallName,
      date: dateValue,
      startTime: startTime,
      endTime: endTime,
      activityId,
    });

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
  try {
    const { id } = req.params;

    const activity = await Activity.findByPk(id, {
      include: [
        {
          model: ActivityType,
          attributes: ["id", "name"],
        },
        {
          model: Department,
          attributes: ["id", "name"],
        },
        {
          model: Session,
          attributes: [
            "id",
            "name",
            "date",
            "hall_name",
            "city",
            "street",
            "startTime",
            "endTime",
          ],
          include: [
            {
              model: ServiceProvider,
              include: [
                {
                  model: Volunteer,
                  attributes: ["volunteerId", "active_status"],
                  include: [
                    {
                      model: Person,
                      attributes: [
                        "id",
                        "fname",
                        "lname",
                        "mname",
                        "momname",
                        "phone",
                        "email",
                        "bDate",
                        "gender",
                        "study",
                        "work",
                        "nationalNumber",
                        "fixPhone",
                        "smoking",
                        "note",
                        "prevVol",
                        "compSkill",
                        "koboSkill",
                        "fileId",
                      ],
                    },
                  ],
                },
                {
                  model: Department,
                  attributes: ["id", "name"],
                },
                {
                  model: Position,
                  attributes: ["id", "name"],
                },
              ],
            },
            {
              model: VolunteerAttendedSessions,
              as: "AttendanceDetails", // Match alias in Session model
              attributes: ["volunteerId", "status"],
            },
            {
              model: Volunteer,
              as: "Attendees", // Match alias in Session model
              attributes: ["volunteerId", "active_status"],
              include: [
                {
                  model: Person,
                  attributes: ["fname", "lname", "email", "phone"],
                },
              ],
            },
          ],
        },
        {
          model: Volunteer,
          as: "Volunteers", // Match alias in Activity model
          through: { attributes: ["status", "notes"] }, // Include additional attributes from the join table
          attributes: ["volunteerId", "active_status"],
          include: [
            {
              model: Person,
              attributes: [
                "id",
                "fname",
                "lname",
                "mname",
                "momName",
                "phone",
                "email",
                "bDate",
                "gender",
                "study",
                "work",
                "nationalNumber",
                "fixPhone",
                "smoking",
                "note",
                "prevVol",
                "compSkill",
                "koboSkill",
                "fileId",
              ],
              include: [
                {
                  model: Address,
                  attributes: ["id", "state", "city", "district", "village"],
                },
                { model: File },
              ],
            },
          ],
        },
      ],
    });

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    return res.json(activity);
  } catch (error) {
    console.error("Error fetching activity details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching activity details." });
  }
};

exports.updateActivity = async (req, res) => {
  // await Activity.update(req.body, { where: { id: req.params.id } });
  // res.json({ message: "Activity updated" });
  try {
    const activivtyId = req.params.id;
    const { activityData, sessionsData, invitedVolunteersData } = req.body;

    // Check if the activity exists
    const activity = await Activity.findByPk(activivtyId);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // Update the activity
    await activity.update(activityData);

    await VolunteerAttendedActivity.destroy({
      where: { activityId: activivtyId }, // Specify the activityId
    });

    sessionsData.sessions.map(async (sessionDate) => {
      const {
        sessionName,
        dateValue,
        hallName,
        startTime,
        endTime,
        // trainerName,
        id,
        providerNames,
      } = sessionDate;
      const serviceProviderIds = providerNames.map(
        (provider) => provider.value
      );
      const sessionExist = await Session.findAll({ where: { id } });
      console.log(sessionExist);
      let session;
      if (sessionExist && sessionExist.length > 0) {
        // Update existing session
        await Session.update(
          {
            name: sessionName,
            hall_name: hallName,
            date: dateValue,
            startTime,
            endTime,
            activityId: activivtyId,
          },
          { where: { id } }
        );
        // Retrieve the instance
        session = await Session.findByPk(id);
        await session.setServiceProviders(serviceProviderIds); // Replace service providers
      } else {
        // Create a new session
        session = await Session.create({
          // id:id,
          name: sessionName,
          hall_name: hallName,
          date: dateValue,
          startTime,
          endTime,
          activityId: activivtyId,
        });
        session = await Session.findByPk(session.id);
        await session.addServiceProviders(serviceProviderIds); // Replace service providers
      }
      // // Retrieve the instance
      // session = await Session.findByPk(id);

      //       // Manage service providers
      //       if (session) {
      //         await session.setServiceProviders(serviceProviderIds); // Replace service providers
      //       }

      const sessionId = session.id;

      await VolunteerAttendedSessions.destroy({
        where: { sessionId: sessionId },
      });

      invitedVolunteersData.volunteerIds.map(async (volunteerData) => {
        await VolunteerAttendedSessions.create({
          volunteerId: volunteerData,
          sessionId,
          status: "invited",
        });
      });
    });
    invitedVolunteersData.volunteerIds.map(async (volunteerData) => {
      await VolunteerAttendedActivity.create({
        volunteerId: volunteerData,
        activityId: activivtyId,
        status: "invited",
      });
    });
    res.json({ message: "Activity updated", activity });
  } catch (error) {
    console.error("Error updating activity:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the activity" });
  }
};

exports.deleteActivity = async (req, res) => {
  await Activity.destroy({ where: { id: req.params.id } });
  res.json({ message: "Activity deleted" });
};

exports.getCompletedActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const completedActivity = await db.sequelize.query(
      `SELECT DISTINCT * FROM activities as a
        JOIN activitytypes AS ats ON ats.id = a.activityTypeId
        JOIN VolunteerAttendedActivity AS vaa ON a.id = vaa.activityId
        WHERE vaa.volunteerId = ${id}
          AND vaa.status = 'attended';`,
      {
        type: QueryTypes.SELECT,
      }
    );
    const activities = await Activity.findAll({
      include: { model: ActivityType },
    });
    const activityData = activities.filter((item) =>
      completedActivity.find((elem) => elem.id === item.id)
    );
    return res.json(activityData);
  } catch (error) {
    console.error("Error fetching completed packages:", error);
    throw error;
  }
};
