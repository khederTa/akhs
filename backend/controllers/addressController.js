const { Address } = require('../models');

exports.getAllAddresses = async (req, res) => {
    const addresses = await Address.findAll();
    res.json(addresses);
};

exports.createAddress = async (req, res) => {
    const address = await Address.create(req.body);
    res.json(address);
};

exports.getAddressById = async (req, res) => {
    const address = await Address.findByPk(req.params.id);
    res.json(address);
};

exports.updateAddress = async (req, res) => {
    await Address.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Address updated' });
};

exports.deleteAddress = async (req, res) => {
    await Address.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Address deleted' });
};
