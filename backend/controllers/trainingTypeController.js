const { TrainingType } = require('../models');

exports.getAllTrainingTypes = async (req, res) => {
    const trainingTypes = await TrainingType.findAll();
    res.json(trainingTypes);
};

exports.createTrainingType = async (req, res) => {
    const trainingType = await TrainingType.create(req.body);
    res.json(trainingType);
};

exports.getTrainingTypeById = async (req, res) => {
    const trainingType = await TrainingType.findByPk(req.params.id);
    res.json(trainingType);
};

exports.updateTrainingType = async (req, res) => {
    await TrainingType.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'TrainingType updated' });
};

exports.deleteTrainingType = async (req, res) => {
    await TrainingType.destroy({ where: { id: req.params.id } });
    res.json({ message: 'TrainingType deleted' });
};
