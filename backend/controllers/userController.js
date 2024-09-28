const { User, Person, Department, Role } = require("../models"); // Adjust the path as necessary

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["userId", "position"],
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
        {
          model: Department,
          attributes: ["name", "description"],
        },
        {
          model: Role,
          attributes: ["name", "description"]
        }
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
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
