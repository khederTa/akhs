const {
  User,
  Person,
  Volunteer,
  ServiceProvider,
  Department,
  Role,
  Position,
  Address,
  File,
} = require("../models"); // Adjust the path as necessary

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: ServiceProvider,
          include: [
            {
              model: Volunteer,
              include: [
                {
                  model: Person,
                  include: [{ model: Address }, { model: File }],
                },
              ],
            },
            { model: Department },
            { model: Position },
          ],
        },
        { model: Role },
      ],
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

exports.createUser = async (req, res) => {
  const { personData, volunteerData, serviceProviderData, userData } = req.body;
  console.log(req.body);
  try {
    // Step 1: Create the person and link the addressId
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
      nationalNumber: personData.nationalNumber,
      fixPhone: personData.fixPhone,
      smoking: personData.smoking,
      note: personData.note,
      compSkill: personData.compSkill,
      koboSkill: personData.koboSkill,
      prevVol: personData.prevVol,
      fileId: personData.fileId,
      addressId: personData.addressId, // Fixed the ID assignment here
    });

    // Step 2: Create the volunteer and link the personId
    const volunteer = await Volunteer.create({
      personId: person.id, // Link person ID
      ...volunteerData,
    });

    // Step 3: Create the service provider and link volunteerId, departmentId, and positionId
    const serviceProvider = await ServiceProvider.create({
      volunteerId: volunteer.volunteerId, // Link volunteer ID
      departmentId: serviceProviderData.departmentId,
      positionId: serviceProviderData.positionId,
    });

    // Step 4: Create the user and associate it with serviceProvider, role, and other required fields
    const user = await User.create({
      password: userData.password,
      providerId: serviceProvider.providerId, // Fixed provider ID assignment
      roleId: userData.roleId,
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
