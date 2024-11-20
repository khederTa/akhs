// models/Volunteer.js
module.exports = (sequelize, DataTypes) => {
  const Volunteer = sequelize.define(
    "Volunteer",
    {
      volunteerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      active_status: DataTypes.STRING,
    },
    {
      tableName: "Volunteers",
      timestamps: false,
    }
  );

  Volunteer.associate = (models) => {
    Volunteer.belongsTo(models.Person, { foreignKey: "personId" });
    Volunteer.hasOne(models.ServiceProvider, { foreignKey: "volunteerId" });

    // Many-to-Many relationship with Session through VolunteerAttendedSessions
    Volunteer.belongsToMany(models.Session, {
      through: models.VolunteerAttendedSessions,
      foreignKey: "volunteerId",
      otherKey: "sessionId",
      as: "AttendedSessions",
    });

    // One-to-Many relationship with VolunteerAttendedSessions
    Volunteer.hasMany(models.VolunteerAttendedSessions, {
      foreignKey: "volunteerId",
      as: "AttendedSessionsDetails",
    });

    Volunteer.belongsToMany(models.Activity, {
      through: models.VolunteerAttendedActivity,
      foreignKey: "volunteerId",
      otherKey: "activityId",
    });
  };

  return Volunteer;
};
