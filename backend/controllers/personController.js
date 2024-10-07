const { Person , Address } = require("../models");

exports.getAllPersons = async (req, res) => {
  const persons = await Person.findAll();
  res.json(persons);
};

exports.createPerson = async (req, res) => {
  try {
    // Extract address information from the request
    const addressInfo = req.body.address;

    // Check if address information is provided
    let address = null;
    if (addressInfo) {
      // Create the address and save it to the database
      address = await Address.create(addressInfo);
    }

    // Create the person with the addressId if the address was created
    const person = await Person.create({
      fname: req.body.fname,
      lname: req.body.lname,
      mname: req.body.mname,
      phone: req.body.phone,
      email: req.body.email,
      bDate: req.body.bDate,
      gender: req.body.gender,
      study: req.body.study,
      work: req.body.work,
      addressId: address ? address.id : null, // Associate the person with the address if available
    });

    // Return the newly created person in the response
    res.status(201).json(person);
  } catch (error) {
    console.error("Error creating person:", error);
    res.status(500).json({ error: "An error occurred while creating the person" });
  }
};

exports.getPersonById = async (req, res) => {
  const person = await Person.findByPk(req.params.id);
  res.json(person);
};

exports.updatePerson = async (req, res) => {
  await Person.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Person updated" });
};

exports.deletePerson = async (req, res) => {
  await Person.destroy({ where: { id: req.params.id } });
  res.json({ message: "Person deleted" });
};
