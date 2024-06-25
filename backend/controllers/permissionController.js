const { Permission } = require('../models');

exports.getAllPermissions = async (req, res) => {
    const permissions = await Permission.findAll();
    res.json(permissions);
};

exports.createPermission = async (req, res) => {
    const permission = await Permission.create(req.body);
    res.json(permission);
};

exports.getPermissionById = async (req, res) => {
    const permission = await Permission.findByPk(req.params.id);
    res.json(permission);
};

exports.updatePermission = async (req, res) => {
    await Permission.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Permission updated' });
};

exports.deletePermission = async (req, res) => {
    await Permission.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Permission deleted' });
};
