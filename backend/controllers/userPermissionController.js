const { UserPermission } = require('../models');

exports.getAllUserPermissions = async (req, res) => {
    const userPermissions = await UserPermission.findAll();
    res.json(userPermissions);
};

exports.createUserPermission = async (req, res) => {
    const userPermission = await UserPermission.create(req.body);
    res.json(userPermission);
};

exports.getUserPermissionById = async (req, res) => {
    const userPermission = await UserPermission.findByPk(req.params.id);
    res.json(userPermission);
};

exports.updateUserPermission = async (req, res) => {
    await UserPermission.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'UserPermission updated' });
};

exports.deleteUserPermission = async (req, res) => {
    await UserPermission.destroy({ where: { id: req.params.id } });
    res.json({ message: 'UserPermission deleted' });
};
