const jwt = require("jsonwebtoken");
const { User, SpecificAttributePermission } = require("../models"); // Adjust the path as needed
const { utils } = require("../utils/utils");
const db = require("../models");
const { QueryTypes } = require("sequelize");


const SpecificPermission = async (req, res ,next) => {
try{
  const userId = await req.user.userId ;
  const { resourceId, resourceName, action } = utils(req);
  const userspecificPermissions = await db.sequelize.query(
    "SELECT * FROM SpecificAttributePermission WHERE userId = :userId AND resourceName = :resourceName AND action = :action AND resourceId = :resourceId",
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

  if (!userspecificPermissions || userspecificPermissions.length===0){
    
    next();
  }


  
  return res.status(403).json({ message: "Access denied" });

}catch (error) {
  console.error("Error fetching blacklists:", error);
  res.status(500).json({ error: "Internal server error" });
}








}

module.exports =  SpecificPermission ;
