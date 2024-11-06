const {
  ServiceProvider,
  Person,
  Address,
  Volunteer,
  Department,
  Position,
  File,
  User,
} = require("../models");

// Get all ServiceProviders with associated data
exports.getAllServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await ServiceProvider.findAll({
      attributes: ["providerId"],
      include: [
        {
          model: Volunteer,
          attributes: ["volunteerId", "active_status"],
          include: [
            {
              model: Person,
              attributes: [
                "id",
                "fname",
                "lname",
                "mname",
                "momname",
                "phone",
                "email",
                "bDate",
                "gender",
                "study",
                "work",
                "nationalNumber",
                "fixPhone",
                "smoking",
                "note",
                "prevVol",
                "compSkill",
                "koboSkill",
                "fileId",
              ],
              include: [
                {
                  model: Address,
                  attributes: ["id", "state", "city", "district", "village"],
                },
                {
                  model: File,
                },
              ],
            },
          ],
        },
        {
          model: Department,
          attributes: ["id", "name"],
        },
        {
          model: Position,
          attributes: ["id", "name"],
        },
        {
          model: User,
          required: false, // Ensures it's a LEFT JOIN, so ServiceProviders without a User are included
          attributes: [], // No attributes from User are retrieved
        },
      ],
      where: {
        "$User.providerId$": null, // Filter for ServiceProviders with no associated User
      },
    });
    res.json(serviceProviders);
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving service providers." });
  }
};

// Get a single ServiceProvider by ID with associated data
exports.getServiceProviderById = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findByPk(req.params.id, {
      include: [
        {
          model: Volunteer,
          include: [
            {
              model: Person,
              include: [
                {
                  model: Address,
                },
              ],
            },
          ],
        },
        {
          model: Department,
        },
        {
          model: Position,
        },
      ],
    });

    if (!serviceProvider) {
      return res.status(404).json({ error: "ServiceProvider not found" });
    }

    res.json(serviceProvider);
  } catch (error) {
    console.error("Error fetching service provider:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while retrieving the service provider.",
      });
  }
};

// Create a new ServiceProvider along with associated data
exports.createServiceProvider = async (req, res) => {
  const { personData, volunteerData, serviceProviderData } = req.body;

  try {
    // Create Address if provided in personData
    // let address = null;
    // if (personData.address) {
    //   address = await Address.create(personData.address);
    // }

    const person = await Person.create({
      fname: personData.fname,
      lname: personData.lname,
      mname: personData.mname,
      momname: personData.momname,
      phone: personData.phone,
      email: personData.email,
      bDate: personData.bDate,
      gender: personData.gender,
      study: personData.study,
      work: personData.work,
      compSkill: personData.compSkill,
      koboSkill: personData.koboSkill,
      prevVol: personData.prevVol,
      fixPhone: personData.fixPhone,
      nationalNumber: personData.nationalNumber,
      note: personData.note,
      smoking: personData.smoking,
      addressId: personData.addressId, // Associate the person with the address
      fileId: personData.fileId,
    });

    // Create Volunteer associated with the person
    const volunteer = await Volunteer.create({
      personId: person.id,
      ...volunteerData,
    });

    // Create ServiceProvider with Volunteer association
    const serviceProvider = await ServiceProvider.create({
      volunteerId: volunteer.volunteerId,
      ...serviceProviderData,
    });

    res.status(201).json(serviceProvider);
  } catch (error) {
    console.error("Error creating service provider:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while creating the service provider.",
      });
  }
};

// Update an existing ServiceProvider and associated data
exports.updateServiceProvider = async (req, res) => {
  await ServiceProvider.update(req.body, {
    where: { providerId: req.params.id },
  });
  res.json({ message: "ServiceProvider updated" });
};

// Delete a ServiceProvider and associated data
exports.deleteServiceProvider = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findByPk(req.params.id, {
      include: [{ model: Volunteer, include: [Person] }],
    });

    if (!serviceProvider) {
      return res.status(404).json({ error: "ServiceProvider not found" });
    }

    const person = serviceProvider.Volunteer.Person;
    // const addressId = person ? person.addressId : null;

    // Delete ServiceProvider
    await serviceProvider.destroy();

    // Delete associated Volunteer and Person if they exist
    await serviceProvider.Volunteer.destroy();
    if (person) {
      await person.destroy();
      // if (addressId) {
      //   await Address.destroy({ where: { id: addressId } });
      // }
    }

    res.json({
      message: "ServiceProvider and associated data deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting service provider:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while deleting the service provider.",
      });
  }
};

// const { ServiceProvider, Person , Address , Volunteer } = require("../models");

// exports.getAllServiceProviders = async (req, res) => {
//   const serviceProviders = await ServiceProvider.findAll({
//     attributes: ["providerId"],
//     include: [
//       {
//         model: Person,
//         attributes: [
//           "fname",
//           "lname",
//           "mname",
//           "phone",
//           "email",
//           "bDate",
//           "gender",
//           "study",
//           "work",
//         ],
//       },
//     ],
//   });
//   res.json(serviceProviders);
// };

// exports.createServiceProvider = async (req, res) => {
//   const { personData, volunteerData ,  serviceProviderData } = req.body; // Expecting person and serviceProvider data separately in the request body

//   try {
//     // Step 1: Create the address first if it's part of personData
//     let address = null;
//     if (personData.address) {
//       address = await Address.create(personData.address); // Save the address in the database
//     }

//     // Step 2: Create the person and associate it with the address
//     const person = await Person.create({
//       fname: personData.fname,
//       lname: personData.lname,
//       mname: personData.mname,
//       phone: personData.phone,
//       email: personData.email,
//       bDate: personData.bDate,
//       gender: personData.gender,
//       study: personData.study,
//       work: personData.work,
//       addressId: address ? address.id : null,  // Associate the person with the address if available
//     });
//     const volunteer = await Volunteer.create({
//       personId: person.id,
//       ...volunteerData

//     });

//     // Step 3: Create the service provider and associate it with the person
//     const serviceProvider = await ServiceProvider.create({
//       volunteerId : volunteer.volunteerId ,
//       ...serviceProviderData,   // Spread the service provider data

//              // Associate the service provider with the person by personId
//     });

//     // Send the created service provider as the response
//     res.status(201).json(serviceProvider);
//   } catch (error) {
//     console.error("Error creating service provider:", error);
//     res.status(500).json({ error: 'An error occurred while creating the service provider' });
//   }
// };

// exports.getServiceProviderById = async (req, res) => {
//   const serviceProvider = await ServiceProvider.findByPk(req.params.id);
//   res.json(serviceProvider);
// };

// exports.updateServiceProvider = async (req, res) => {
//   await ServiceProvider.update(req.body, {
//     where: { providerId: req.params.id },
//   });
//   res.json({ message: "ServiceProvider updated" });
// };

// exports.deleteServiceProvider = async (req, res) => {
//   await ServiceProvider.destroy({ where: { providerId: req.params.id } });
//   res.json({ message: "ServiceProvider deleted" });
// };
