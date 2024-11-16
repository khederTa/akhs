module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      done: { type: DataTypes.BOOLEAN },
      title: DataTypes.STRING,
      numSessions: DataTypes.INTEGER,
      minSessions: DataTypes.INTEGER
    },
    {
      tableName: "Activities",
      timestamps: false,
    }
  );

  Activity.associate = (models) => {
    Activity.belongsTo(models.ActivityType, {
      foreignKey: "activityTypeId",
    });
    Activity.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });

    Activity.hasMany(models.Session, { foreignKey: "activityId" });
    Activity.belongsToMany(models.Volunteer, {
      through: models.VolunteerAttendedActivity,
      foreignKey: "activityId",
      otherKey: "volunteerId",
    });
    
    
  };

  return Activity;
};
