const { Position } = require('../models');

exports.getAllPositions = async (req, res) => {
    const positions = await Position.findAll();
    res.json(positions);
};

exports.createPosition = async (req, res) => {
    const position = await Position.create(req.body);
    res.json(position);
};

exports.getPositionById = async (req, res) => {
    const position = await Position.findByPk(req.params.id);
    res.json(position);
};

exports.updatePosition = async (req, res) => {
    await Position.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Position updated' });
};

exports.deletePosition = async (req, res) => {
    await Position.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Position deleted' });
};
