module.exports = (sequelize, DataTypes) => {
  const SpecificAttributePermission = sequelize.define(
    "SpecificAttributePermission",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      action: DataTypes.STRING,
      resourceName: DataTypes.STRING,
      resourceId: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      tableName: "SpecificAttributePermissions",
      timestamps: false,
    }
  );

  SpecificAttributePermission.associate = (models) => {
    SpecificAttributePermission.belongsTo(models.User, { foreignKey: "userId" });    
  };

  return SpecificAttributePermission;
};
