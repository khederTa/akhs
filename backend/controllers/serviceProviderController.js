const { ServiceProvider, Person , Address } = require("../models");

exports.getAllServiceProviders = async (req, res) => {
  const serviceProviders = await ServiceProvider.findAll({
    attributes: ["providerId", "position" , "role"],
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
  });
  res.json(serviceProviders);
};

exports.createServiceProvider = async (req, res) => {
  const { personData, serviceProviderData } = req.body; // Expecting person and serviceProvider data separately in the request body

  try {
    // Step 1: Create the address first if it's part of personData
    let address = null;
    if (personData.address) {
      address = await Address.create(personData.address); // Save the address in the database
    }

    // Step 2: Create the person and associate it with the address
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
      addressId: address ? address.id : null,  // Associate the person with the address if available
    });

    // Step 3: Create the service provider and associate it with the person
    const serviceProvider = await ServiceProvider.create({
      ...serviceProviderData,   // Spread the service provider data
      personId: person.id       // Associate the service provider with the person by personId
    });

    // Send the created service provider as the response
    res.status(201).json(serviceProvider);
  } catch (error) {
    console.error("Error creating service provider:", error);
    res.status(500).json({ error: 'An error occurred while creating the service provider' });
  }
};


exports.getServiceProviderById = async (req, res) => {
  const serviceProvider = await ServiceProvider.findByPk(req.params.id);
  res.json(serviceProvider);
};

exports.updateServiceProvider = async (req, res) => {
  await ServiceProvider.update(req.body, {
    where: { providerId: req.params.id },
  });
  res.json({ message: "ServiceProvider updated" });
};

exports.deleteServiceProvider = async (req, res) => {
  await ServiceProvider.destroy({ where: { providerId: req.params.id } });
  res.json({ message: "ServiceProvider deleted" });
};
