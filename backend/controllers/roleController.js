const { Role } = require("../models");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error("Error fetching Roles:", error);
    res.status(500).json({ error: "An error occurred while fetching Roles" });
  }
};

// exports.createRole = async (req, res) => {
//   const role = await Role.create(req.body);
//   res.json(role);
// };

// exports.getRoleById = async (req, res) => {
//   const role = await Role.findByPk(req.params.id);
//   res.json(role);
// };

// exports.updateRole = async (req, res) => {
//   await Role.update(req.body, { where: { id: req.params.id } });
//   res.json({ message: "Role updated" });
// };

// exports.deleteRole = async (req, res) => {
//   await Role.destroy({ where: { id: req.params.id } });
//   res.json({ message: "Role deleted" });
// };
