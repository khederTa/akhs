const { History } = require('../models');

exports.getAllHistories = async (req, res) => {
    const histories = await History.findAll();
    res.json(histories);
};

exports.createHistory = async (req, res) => {
    const history = await History.create(req.body);
    res.json(history);
};

exports.getHistoryById = async (req, res) => {
    const history = await History.findByPk(req.params.id);
    res.json(history);
};

exports.updateHistory = async (req, res) => {
    await History.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'History updated' });
};

exports.deleteHistory = async (req, res) => {
    await History.destroy({ where: { id: req.params.id } });
    res.json({ message: 'History deleted' });
};
