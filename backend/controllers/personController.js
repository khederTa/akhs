const { Person } = require('../models');

exports.getAllPersons = async (req, res) => {
    const persons = await Person.findAll();
    res.json(persons);
};

exports.createPerson = async (req, res) => {
    const person = await Person.create(req.body);
    res.json(person);
};

exports.getPersonById = async (req, res) => {
    const person = await Person.findByPk(req.params.id);
    res.json(person);
};

exports.updatePerson = async (req, res) => {
    await Person.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Person updated' });
};

exports.deletePerson = async (req, res) => {
    await Person.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Person deleted' });
};
