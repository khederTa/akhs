module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define(
    "Activity",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      done: { type: DataTypes.BOOLEAN },
      title: DataTypes.STRING,
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

    Activity.hasMany(models.Session, { foreignKey: "activityId" });
    Activity.belongsToMany(models.Volunteer, { through: 'VolunteerAttendedActivity' });
    
  };

  return Activity;
};
