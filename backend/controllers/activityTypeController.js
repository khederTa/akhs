const { ActivityType } = require("../models");

exports.getAllActivityTypes = async (req, res) => {
  const activityTypes = await ActivityType.findAll();
  res.json(activityTypes);
};

exports.createActivityType = async (req, res) => {
  const activityType = await ActivityType.create(req.body);
  res.json(activityType);
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
