const { DraftActivity } = require('../models');

exports.getAllDraftActivities = async (req, res) => {
    const draftActivities = await DraftActivity.findAll();
    res.json(draftActivities);
};

exports.createDraftActivity = async (req, res) => {
    const draftActivity = await DraftActivity.create(req.body);
    res.json(draftActivity);
};

exports.getDraftActivityById = async (req, res) => {
    const draftActivity = await DraftActivity.findByPk(req.params.id);
    res.json(draftActivity);
};

exports.updateDraftActivity = async (req, res) => {
    await DraftActivity.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'DraftActivity updated' });
};

exports.deleteDraftActivity = async (req, res) => {
    await DraftActivity.destroy({ where: { id: req.params.id } });
    res.json({ message: 'DraftActivity deleted' });
};
