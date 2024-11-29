const { Role, Permission } = require("../models");

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

exports.getRolePermissionsById = async (req, res) => {
  const { roleId } = req.params;
  console.log("hi");
  try {
    // Find the role by ID and include associated permissions
    const role = await Role.findByPk(roleId, {
      include: [
        {
          model: Permission,
          through: { attributes: [] }, // Exclude the join table attributes
        },
      ],
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    // Extract permissions data
    const permissions = role.Permissions.map((perm) => ({
      action: perm.action,
      resource: perm.resource,
    }));

    return res.json({ permissions, role });
  } catch (error) {
    console.error("Error fetching role permissions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// exports.updateRole = async (req, res) => {
//   await Role.update(req.body, { where: { id: req.params.id } });
//   res.json({ message: "Role updated" });
// };

// exports.deleteRole = async (req, res) => {
//   await Role.destroy({ where: { id: req.params.id } });
//   res.json({ message: "Role deleted" });
// };
