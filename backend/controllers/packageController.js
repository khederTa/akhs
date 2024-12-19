const { Package, ActivityType, Activity } = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");

exports.getAllPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: {
        model: ActivityType,
        through: { attributes: [] }, // Exclude join table attributes
      },
    });
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving Packages" });
  }
};

// Create a new Package and link it with existing ActivityTypes
exports.createPackage = async (req, res) => {
  try {
    const { name, description, activityTypeIds } = req.body;
    console.log({ name, description, activityTypeIds });
    // Create the new Package
    const newPackage = await Package.create({ name, description });

    // Link the Package with existing ActivityTypes
    if (activityTypeIds && Array.isArray(activityTypeIds)) {
      const activityTypes = await ActivityType.findAll({
        where: { id: activityTypeIds },
      });

      if (activityTypes.length) {
        await newPackage.addActivityTypes(activityTypes);
      }
    }

    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ error: "Error creating Package" });
  }
};

exports.getPackageById = async (req, res) => {
  const package = await Package.findByPk(req.params.id);
  res.json(package);
};

exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, activityTypeIds } = req.body;

    // Find the Package by ID
    const package = await Package.findByPk(id);

    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    // Update the Package's fields
    package.name = name;
    package.description = description;
    await package.save();

    // Update the associated ActivityTypes
    if (activityTypeIds && Array.isArray(activityTypeIds)) {
      const activityTypes = await ActivityType.findAll({
        where: { id: activityTypeIds },
      });

      // Clear existing associations and reassign new ones
      await package.setActivityTypes(activityTypes);
    }

    // Fetch the updated Package with associated ActivityTypes
    const updatedPackage = await Package.findByPk(id, {
      include: {
        model: ActivityType,
        through: { attributes: [] },
      },
    });

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ error: "Error updating Package" });
  }
};

exports.deletePackage = async (req, res) => {
  await Package.destroy({ where: { id: req.params.id } });
  res.json({ message: "Package deleted" });
};

exports.getCompletedPackages = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const completedPackages = await db.sequelize.query(
      `SELECT DISTINCT p.*
        FROM akhs.packages AS p
        WHERE NOT EXISTS (
            SELECT 1
            FROM akhs.activitytypespackages AS atp
            WHERE atp.PackageId = p.id
              AND atp.ActivityTypeId NOT IN (
                  SELECT ats.id
                  FROM akhs.activitytypes AS ats
                  JOIN akhs.activities AS a ON ats.id = a.activityTypeId
                  JOIN akhs.volunteerattendedactivity AS vaa ON a.id = vaa.activityId
                  WHERE vaa.volunteerId = ${id}
                    AND vaa.status = "attended" AND a.done = true
      )
      );
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    console.log(completedPackages);
    const packages = await Package.findAll({
      include: {
        model: ActivityType,
        through: { attributes: [] }, // Exclude join table attributes
      },
    });

    const packagesData = packages.filter((pack) =>
      completedPackages.find((comp) => comp.id === pack.id)
    );

    const completedActivity = await db.sequelize.query(
      `SELECT DISTINCT a.id FROM activities as a
        JOIN activitytypes AS ats ON ats.id = a.activityTypeId
        JOIN VolunteerAttendedActivity AS vaa ON a.id = vaa.activityId
        WHERE vaa.volunteerId = ${id}
          AND vaa.status = 'attended' and a.done = true;`,
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

    return res.json({ packagesData, packages, activityData });
  } catch (error) {
    console.error("Error fetching completed packages:", error);
    throw error;
  }
};
