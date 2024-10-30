const {
  User,
  Person,
  Volunteer,
  ServiceProvider,
  Department,
  Role,
  Position,
  Address
} = require("../models"); // Adjust the path as necessary

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: ServiceProvider,
          include: [
            { model: Volunteer, include: [{ model: Person, include: [{model: Address}] }] },
            { model: Department },
            { model: Position },
          ],
        },
<<<<<<< HEAD
        {
          model: Department,
          attributes: ["name", "description"],
        },
        {
          model: ServiceProvider,
          attributes: ["name", "description"],
        },
        {
          model: Role,
          attributes: ["name", "description"],
        },
        // { model: Department, attributes: ["name", "description"] },
=======
        { model: Role },
>>>>>>> b7e454ce18fb38298473d29666c74af9c0a004fd
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

exports.createUser = async (req, res) => {
  const { personData, volunteerData, serviceProviderData, userData } = req.body;

  try {
    // Step 1: Create the address first (if provided in personData)
    let address = null;
    if (personData.address) {
      address = await Address.create(personData.address); // Create the address
    }

    // Step 2: Create the person and link the addressId (if address exists)
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
      nationalNumber: personData.nationalNumber,
      fixPhone: personData.fixPhone,
      smoking: personData.smoking,
      notes: personData.notes,
      compSkills: personData.compSkills,
      prevVol: personData.prevVol,
      fileId: personData.fileId,
      addressId: address.id,
    });

    const volunteer = await Volunteer.create({
      personId: person.id,
      ...volunteerData,
    });

    const serviceProvider = await ServiceProvider.create({
      volunteerId: volunteer.id,
      ...serviceProviderData,
    });

    // // Step 3: Create the department
    // let department = null;
    // if (departmentData && departmentData.name) {
    //   department = await Department.create({
    //     name: departmentData.name,
    //   });
    // }

    // // Step 4: Create the role
    // let role = null;
    // if (roleData && roleData.role) {
    //   role = await Role.create({
    //     role: roleData.role,
    //   });
    // }

    // Step 5: Create the user and associate it with the person, department, and role
    const user = await User.create({
      password: userData.password,

      providerId: serviceProvider.providerId,

      departmentId: userData.departmentId, // Link departmentId if department exists
      roleId: userData.roleId, // Link roleId if role exists
    });

    // Send the created user as the response
    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
  }
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  await User.update(req.body, { where: { userId: req.params.id } });
  res.json({ message: "User updated" });
};

exports.deleteUser = async (req, res) => {
  await User.destroy({ where: { userId: req.params.id } });
  res.json({ message: "User deleted" });
};
