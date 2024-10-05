const { Volunteer } = require('../models');

exports.getAllVolunteers = async (req, res) => {
    const volunteers = await Volunteer.findAll(
        {
            attributes: ["volunteerId", "position"],
            include: [
              {
                model: Person,
                attributes: [
                  "fname",
                  "lname",
                  "mname",
                  "phone",
                  "email",
                  "bDate",
                  "gender",
                  "study",
                  "work",
                ],
              },
             
             
            ],
          }
    );
    res.json(volunteers);
};

exports.createVolunteer = async (req, res) => {
    const volunteer = await Volunteer.create(req.body);
    res.json(volunteer);
};

exports.getVolunteerById = async (req, res) => {
    const volunteer = await Volunteer.findByPk(req.params.id);
    res.json(volunteer);
};

exports.updateVolunteer = async (req, res) => {
    await Volunteer.update(req.body, { where: { volunteerId: req.params.id } });
    res.json({ message: 'Volunteer updated' });
};

exports.deleteVolunteer = async (req, res) => {
    await Volunteer.destroy({ where: { volunteerId: req.params.id } });
    res.json({ message: 'Volunteer deleted' });
};
