const db = require("../models");
const { utils } = require("../utils/utils");
const { QueryTypes } = require("sequelize");

const blacklistAccess = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resourceId, resourceName, action } = utils(req);
    const blacklists = await db.sequelize.query(
      "SELECT * FROM blacklists WHERE userId = :userId AND resourceName = :resourceName AND action = :action AND resourceId = :resourceId",
      {
        replacements: {
          userId,
          resourceName,
          action,
          resourceId
        },
        type: QueryTypes.SELECT,
      }
    );

    if (!blacklists || blacklists.length === 0) {
      return next();
    }

    if (resourceId) {
      const filteredBlacklists = blacklists.filter(
        (item) => item.resourceId === resourceId && item.action === action
      );
      if (!filteredBlacklists || filteredBlacklists.length === 0) {
        return next();
      }
    }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("Error fetching blacklists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = blacklistAccess;
