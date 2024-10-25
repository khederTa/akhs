const jwt = require("jsonwebtoken");
const { User, Permission } = require("../models"); // Adjust the path as needed
const db = require("../models");
const { QueryTypes } = require("sequelize");
const { utils } = require("../utils/utils");

const authenticateRole = async (req, res, next) => {
  try {
    const { resourceName, action } = utils(req);
    const permissions = await db.sequelize.query(
      `SELECT * FROM akhs.permissions WHERE id IN (
        SELECT permissionId FROM akhs.rolePermission WHERE roleId = (
          SELECT roleId FROM akhs.users WHERE userId = :userId
        )
      )`,
      {
        replacements: { userId: req.user.userId },
        type: QueryTypes.SELECT,
      }
    );

    // console.log(permissions);
    // console.log(resourceName);
    // console.log(action);

    if (
      permissions.length === 0 ||
      !permissions.some(
        (permission) =>
          permission.action === action && permission.resource === resourceName
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};
const authenticatePermission = async (req, res, next) => {
  try {
    const { resourceName, action } = utils(req);
    const permissions = await db.sequelize.query(
      `SELECT * FROM Permissions WHERE id IN (
        SELECT permissionId FROM userpermission WHERE UserUserId = :userId
      )`,
      {
        replacements: { userId: req.user.userId },
        type: QueryTypes.SELECT,
      }
    );

    if (
      permissions.length === 0 ||
      !permissions.some(
        (permission) =>
          permission.action === action && permission.resource === resourceName
      )
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
};

module.exports = { authenticateRole, authenticatePermission };
