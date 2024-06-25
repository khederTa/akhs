const { ServiceProvider } = require('../models');

exports.getAllServiceProviders = async (req, res) => {
    const serviceProviders = await ServiceProvider.findAll();
    res.json(serviceProviders);
};

exports.createServiceProvider = async (req, res) => {
    const serviceProvider = await ServiceProvider.create(req.body);
    res.json(serviceProvider);
};

exports.getServiceProviderById = async (req, res) => {
    const serviceProvider = await ServiceProvider.findByPk(req.params.id);
    res.json(serviceProvider);
};

exports.updateServiceProvider = async (req, res) => {
    await ServiceProvider.update(req.body, { where: { providerId: req.params.id } });
    res.json({ message: 'ServiceProvider updated' });
};

exports.deleteServiceProvider = async (req, res) => {
    await ServiceProvider.destroy({ where: { providerId: req.params.id } });
    res.json({ message: 'ServiceProvider deleted' });
};
