const { Session } = require('../models');

exports.getAllSessions = async (req, res) => {
    const sessions = await Session.findAll();
    res.json(sessions);
};

exports.createSession = async (req, res) => {
    const session = await Session.create(req.body);
    res.json(session);
};

exports.getSessionById = async (req, res) => {
    const session = await Session.findByPk(req.params.id);
    res.json(session);
};

exports.updateSession = async (req, res) => {
    await Session.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Session updated' });
};

exports.deleteSession = async (req, res) => {
    await Session.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Session deleted' });
};
