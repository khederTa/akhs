const jwt = require("jsonwebtoken");
const { User, Role, Permission } = require("../models"); // Adjust the path as needed

const authenticateRole = async (req, res, next) => {
  try {
    
    const user = await User.findByPk(req.user.userId, {
      include: [Role],
    });
    console.log("roleId => ");
    console.log(user.dataValues.roleId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const userRole = user.Role.name;
    if (userRole !== "admin" ) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

const authenticatePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        include: [Permission],
      });

      console.log(user);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userPermissions = user.Permissions.map(
        (permission) => permission.action
      );
      if (!userPermissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed" });
    }
  };
};

module.exports = { authenticateRole, authenticatePermission };
