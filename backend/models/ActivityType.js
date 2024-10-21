module.exports = (sequelize, DataTypes) => {
  const ActivityType = sequelize.define(
    "ActivityType",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      active_status: DataTypes.STRING,
    },
    {
      tableName: "ActivityTypes",
      timestamps: false,
    }
  );

  ActivityType.associate = (models) => {
    ActivityType.hasMany(models.Activity, {
      foreignKey: "activityTypeId",
    });
    ActivityType.hasMany(models.Package, {
      foreignKey: "packageId",
    });

    // Self-referential many-to-many relationship for prerequisites
    ActivityType.belongsToMany(ActivityType, {
      as: "Prerequisites",
      through: "ActivityTypePrerequisites",
      foreignKey: "activityTypeId",
      otherKey: "prerequisiteId",
      timestamps: false
    });
    ActivityType.belongsTo(models.Department, { foreignKey: "departmentId" });
  };

  return ActivityType;
};
