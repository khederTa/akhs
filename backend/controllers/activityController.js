const { Activity } = require('../models');

exports.getAllActivities = async (req, res) => {
    const Activities = await Activity.findAll();
    res.json(Activities);
};

exports.createActivity = async (req, res) => {
    const Activity = await Activity.create(req.body);
    res.json(Activity);
};

exports.getActivityById = async (req, res) => {
    const Activity = await Activity.findByPk(req.params.id);
    res.json(Activity);
};

exports.updateActivity = async (req, res) => {
    await Activity.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Activity updated' });
};

exports.deleteActivity = async (req, res) => {
    await Activity.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Activity deleted' });
};
