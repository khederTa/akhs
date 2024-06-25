const { User } = require('../models');

exports.getAllUsers = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
};

exports.createUser = async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
};

exports.getUserById = async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
};

exports.updateUser = async (req, res) => {
    await User.update(req.body, { where: { userId: req.params.id } });
    res.json({ message: 'User updated' });
};

exports.deleteUser = async (req, res) => {
    await User.destroy({ where: { userId: req.params.id } });
    res.json({ message: 'User deleted' });
};
