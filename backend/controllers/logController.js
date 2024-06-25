const { Log } = require('../models');

exports.getAllLogs = async (req, res) => {
    const logs = await Log.findAll();
    res.json(logs);
};

exports.createLog = async (req, res) => {
    const log = await Log.create(req.body);
    res.json(log);
};

exports.getLogById = async (req, res) => {
    const log = await Log.findByPk(req.params.id);
    res.json(log);
};

exports.updateLog = async (req, res) => {
    await Log.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Log updated' });
};

exports.deleteLog = async (req, res) => {
    await Log.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Log deleted' });
};
