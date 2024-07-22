module.exports = (sequelize, DataTypes) => {
  const ActivityType = sequelize.define(
    "ActivityType",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      prerequest: DataTypes.JSON,
    },
    {
      tableName: "ActivityTypes",
      timestamps: false,
    }
  );

  ActivityType.associate = (models) => {
    ActivityType.hasMany(models.Activity, {
      foreignKey: "ActivityTypeId",
    });
    ActivityType.hasMany(models.Package, {
      foreignKey: "packageId",
    });
  };

  return ActivityType;
};
