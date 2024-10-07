const { Volunteer,Person, Address } = require('../models');


exports.getAllVolunteers = async (req, res) => {
    const volunteers = await Volunteer.findAll(
        {
            attributes: ["volunteerId", "disable" ,"disable_status"],
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
  const { personData, volunteerData } = req.body;

  try {
    // Create the address first if it's part of personData
    const address = await Address.create(personData.address); // Save the address in the database

    // Create the person and associate it with the address
    const person = await Person.create({
      fname: personData.fname,
      lname: personData.lname,
      mname: personData.mname,
      phone: personData.phone,
      email: personData.email,
      bDate: personData.bDate,
      gender: personData.gender,
      study: personData.study,
      work: personData.work,
      addressId: address.id,  // Associate the person with the address
    });

    // Create the volunteer and associate it with the person
    const volunteer = await Volunteer.create({
      ...volunteerData,   // Spread the volunteer data (disable, disable_status)
      personId: person.id // Associate the volunteer with the person by personId
    });

    // Send the created volunteer as the response
    res.status(201).json(volunteer);
  } catch (error) {
    console.error("Error creating volunteer:", error);
    res.status(500).json({ error: 'An error occurred while creating the volunteer' });
  }
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
