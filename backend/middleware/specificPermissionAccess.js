const db = require("../models");
const { utils } = require("../utils/utils");
const { QueryTypes } = require("sequelize");

const specificPermissionAccess = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resourceId, resourceName, action } = utils(req);
    // console.log(resourceId, resourceName, action, userId);

    const specificPermissionAccess = await db.sequelize.query(
      "SELECT * FROM specificattributepermissions WHERE userId = :userId AND resourceName = :resourceName AND action = :action AND resourceId = :resourceId",
      {
        replacements: {
          userId,
          resourceName,
          action,
          resourceId,
        },
        type: QueryTypes.SELECT,
      }
    );

    // console.log("specificPermissionAccess");
    // console.log(specificPermissionAccess);

    if (specificPermissionAccess.length > 0) {
      return next();
    }

    // if (resourceId) {
    //   const filteredBlacklists = blacklists.filter(
    //     (item) => item.resourceId === resourceId && item.action === action
    //   );
    //   if (!filteredBlacklists || filteredBlacklists.length === 0) {
    //     return next();
    //   }
    // }

    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("Error fetching blacklists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = specificPermissionAccess;
