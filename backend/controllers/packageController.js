const { Package } = require('../models');

exports.getAllPackages = async (req, res) => {
    const packages = await Package.findAll();
    res.json(packages);
};

exports.createPackage = async (req, res) => {
    const package = await Package.create(req.body);
    res.json(package);
};

exports.getPackageById = async (req, res) => {
    const package = await Package.findByPk(req.params.id);
    res.json(package);
};

exports.updatePackage = async (req, res) => {
    await Package.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Package updated' });
};

exports.deletePackage = async (req, res) => {
    await Package.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Package deleted' });
};
