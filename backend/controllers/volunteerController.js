const {
  Volunteer,
  Person,
  Address,
  ServiceProvider,
  File,
  ActivityType,
  Activity,
  VolunteerAttendedActivity,
} = require("../models");
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.findAll({
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
        {
          model: ServiceProvider,
          required: false, // Ensures it's a LEFT JOIN, so volunteers without a ServiceProvider are included
          attributes: [], // We don’t need to retrieve any columns from ServiceProvider
        },
      ],
      where: {
        "$ServiceProvider.volunteerId$": null, // Filter volunteers with no associated ServiceProvider
      },
    });

    res.json(volunteers);
  } catch (error) {
    console.error(
      "Error fetching volunteers with person and address information:",
      error
    );
    res
      .status(500)
      .json({ error: "An error occurred while retrieving volunteers." });
  }
};

exports.createVolunteer = async (req, res) => {
  const { personData, volunteerData } = req.body;

  try {
    // Create the address first if it's part of personData
    // const address = await Address.create(addressData); // Save the address in the database

    // Create the person and associate it with the address
    const person = await Person.create({
      fname: personData.fname,
      lname: personData.lname,
      mname: personData.mname,
      momname: personData.momname,
      phone: personData.phone,
      email: personData.email,
      bDate: personData.bDate,
      gender: personData.gender,
      study: personData.study,
      work: personData.work,
      compSkill: personData.compSkill,
      koboSkill: personData.koboSkill,
      prevVol: personData.prevVol,
      fixPhone: personData.fixPhone,
      nationalNumber: personData.nationalNumber,
      note: personData.note,
      smoking: personData.smoking,
      addressId: personData.addressId, // Associate the person with the address
      fileId: personData.fileId,
    });

    // Create the volunteer and associate it with the person
    const volunteer = await Volunteer.create({
      ...volunteerData, // Spread the volunteer data (disable, disable_status)
      personId: person.id, // Associate the volunteer with the person by personId
    });

    // Send the created volunteer as the response
    res.status(201).json(volunteer);
  }  catch (error) {
    console.error("Error creating volunteer:", error);

    // Handle Sequelize unique constraint errors
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "ValidationError",
        message: error.errors[0].message, // Provides the exact message (e.g., "nationalNumber must be unique")
        field: error.errors[0].path,     // Provides the field causing the error (e.g., "nationalNumber")
      });
    }

    // Handle other errors
    res.status(500).json({
      error: "An error occurred while creating the volunteer",
    });
  }
};

exports.getVolunteerById = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id, {
      include: [
        {
          model: Person,
          include: [
            {
              model: Address,
            },
          ],
        },
      ],
    });

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    res.json(volunteer);
  } catch (error) {
    console.error("Error fetching volunteer:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the volunteer." });
  }
};

exports.updateVolunteer = async (req, res) => {
  try {
    await Volunteer.update(req.body, { where: { volunteerId: req.params.id } });
    res.json({ message: "Volunteer updated" });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    res.status(500).json({ message: "Error updating volunteer" });
  }
};

exports.deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByPk(req.params.id);

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    const person = await Person.findByPk(volunteer.personId);
    // const addressId = person ? person.addressId : null;

    // Delete the volunteer
    await volunteer.destroy();

    // Delete related person and address if they exist
    if (person) {
      await person.destroy();
      // if (addressId) {
      //   await Address.destroy({ where: { id: addressId } });
      // }
    }

    res.json({ message: "Volunteer and related data deleted" });
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the volunteer." });
  }
};

exports.getVolunteersForActivityTypePrerequisites = async (req, res) => {
  try {
    const { activityTypeId } = req.params;
    // Step 1: Find prerequisite activity types for the given activity type
    const activityType = await ActivityType.findByPk(activityTypeId, {
      include: {
        model: ActivityType,
        as: "Prerequisites",
        attributes: ["id"],
        through: { attributes: [] }, // Exclude the join table fields
      },
    });

    // Get the list of prerequisite activity type IDs
    const prerequisiteTypeIds = activityType?.Prerequisites.map(
      (prerequisite) => prerequisite.id
    );

    // return all volunteers where there are no conditions to attend the activity
    if (!prerequisiteTypeIds || prerequisiteTypeIds?.length === 0) {
      const volunteers = await Volunteer.findAll({
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
          {
            model: ServiceProvider,
            required: false, // Ensures it's a LEFT JOIN, so volunteers without a ServiceProvider are included
            attributes: [], // We don’t need to retrieve any columns from ServiceProvider
          },
        ],
        where: {
          "$ServiceProvider.volunteerId$": null, // Filter volunteers with no associated ServiceProvider
        },
      });
      return res.json(volunteers);
    }
    
    // Step 2: Find activities that belong to these prerequisite activity types
    const prerequisiteActivities = await Activity.findAll({
      where: {
        activityTypeId: prerequisiteTypeIds,
      },
      attributes: ["id"],
    });

    // Get the list of prerequisite activity IDs
    const prerequisiteActivityIds = prerequisiteActivities.map(
      (activity) => activity.id
    );

    // Step 3: Retrieve volunteers who attended these prerequisite activities
    const volunteers = await Volunteer.findAll({
      include: [
        {
          model: Activity,
          where: { id: prerequisiteActivityIds },
          through: {
            attributes: [], // Exclude the join table fields
            where: { status: "attended" }, // Optional: Only get those who attended
          },
        },
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
        {
          model: ServiceProvider,
          required: false, // Ensures it's a LEFT JOIN, so volunteers without a ServiceProvider are included
          attributes: [], // We don’t need to retrieve any columns from ServiceProvider
        },
      ],
      where: {
        "$ServiceProvider.volunteerId$": null, // Filter volunteers with no associated ServiceProvider
      },
    });

    return res.json(volunteers);
  } catch (error) {
    console.error("Error fetching volunteers:", error);
  }
};
