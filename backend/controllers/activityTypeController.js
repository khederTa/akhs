const { ActivityType, Department } = require("../models");
const db = require("../models");
const { QueryTypes } = require("sequelize");
// Corrected getAllActivityTypes function
exports.getAllActivityTypes = async (req, res) => {
  try {
    const activityTypes = await ActivityType.findAll({
      include: [
        {
          model: ActivityType,
          as: "Prerequisites",
          through: { attributes: [] },
        },
        {
          model: Department,
        },
      ],
    });

    return res.status(200).json(activityTypes);
  } catch (error) {
    console.error("Error fetching activity types with prerequisites:", error);
    return res.status(500).json({ error: "Failed to fetch activity types" });
  }
};

exports.createActivityType = async (req, res) => {
  const { name, description, departmentId, prerequisites } = req.body;
  try {
    const activityType = await ActivityType.create({
      name,
      description,
      departmentId,
      active_status: "active"
    });
    
    // Prepare the values for the insert statement
    if(prerequisites.length > 0){
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

    }

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
  const { id } = req.params;
  const { name, description, prerequisites, active_status, departmentId } =
    req.body;
  // console.log("\nactivityType: \n");
  // console.log({
  //   name,
  //   description,
  //   prerequisites,
  //   active_status,
  //   departmentId,
  // });
  try {
    // Update the activity type
    await ActivityType.update(
      { name, description, active_status, departmentId },
      { where: { id } }
    );

    // Remove all existing prerequisites
    await db.sequelize.query(
      `DELETE FROM ActivityTypePrerequisites WHERE activityTypeId = ${id}`,
      {
        type: QueryTypes.DELETE,
      }
    );

    // Insert updated prerequisites
    const values = prerequisites
      .map((prerequisiteId) => `(${id}, ${prerequisiteId})`)
      .join(", ");

    if (values) {
      await db.sequelize.query(
        `INSERT INTO ActivityTypePrerequisites (activityTypeId, prerequisiteId) VALUES ${values}`,
        { type: QueryTypes.INSERT }
      );
    }

    res.status(200).json({ message: "Activity type updated successfully." });
  } catch (error) {
    console.error("Error updating activity type:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the activity type." });
  }
};

exports.deleteActivityType = async (req, res) => {
  const { id } = req.params;

  try {
    // First, remove associated prerequisites
    await db.sequelize.query(
      `DELETE FROM ActivityTypePrerequisites WHERE activityTypeId = ${id}`,
      { type: QueryTypes.DELETE }
    );

    // Then, remove the activity type itself
    await ActivityType.destroy({ where: { id } });

    res.status(200).json({ message: "Activity type deleted successfully." });
  } catch (error) {
    console.error("Error deleting activity type:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the activity type." });
  }
};
