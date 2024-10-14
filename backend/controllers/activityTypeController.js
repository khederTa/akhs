const { ActivityType } = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");
exports.getAllActivityTypes = async (req, res) => {
  const activityTypes = await ActivityType.findAll();
  res.json(activityTypes);
};

exports.createActivityType = async (req, res) => {
  const { name, description, prerequisites } = req.body;
  try {
    const activityType = await ActivityType.create({ name, description });

    // Prepare the values for the insert statement
    const values = prerequisites
      .map((record) => `(${activityType.id}, ${record.id})`)
      .join(", ");

    // Insert the prerequisites
    await db.sequelize.query(
      `INSERT INTO akhs.activitytypeprerequisites (activityTypeId, prerequisiteId) VALUES ${values}`,
      {
        type: QueryTypes.INSERT,
      }
    );

    res.json(activityType);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the activity type." });
  }
};

exports.getActivityTypeById = async (req, res) => {
  const activityType = await ActivityType.findByPk(req.params.id);
  res.json(activityType);
};

exports.updateActivityType = async (req, res) => {
  await ActivityType.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "ActivityType updated" });
};

exports.deleteActivityType = async (req, res) => {
  await ActivityType.destroy({ where: { id: req.params.id } });
  res.json({ message: "ActivityType deleted" });
};
