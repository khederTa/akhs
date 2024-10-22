module.exports = (sequelize, DataTypes) => {
  const ActivityType = sequelize.define(
    "ActivityType",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
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
    ActivityType.belongsToMany(models.Package, { through: "ActivityTypesPackages", timestamps: false });


    // Self-referential many-to-many relationship for prerequisites
    ActivityType.belongsToMany(ActivityType, {
      as: "Prerequisites",
      through: "ActivityTypePrerequisites",
      foreignKey: "activityTypeId",
      otherKey: "prerequisiteId",
      timestamps: false
    });
  };

  return ActivityType;
};
