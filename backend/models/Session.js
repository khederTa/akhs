// models/Session.js
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define(
    "Session",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      hall_name: DataTypes.STRING,
      city: DataTypes.STRING,
      street: DataTypes.STRING,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
    },
    {
      tableName: "Sessions",
      timestamps: false,
    }
  );

  Session.associate = (models) => {
    Session.belongsTo(models.Activity, { foreignKey: "activityId" });

    // Many-to-Many relationship with Volunteer through VolunteerAttendedSessions
    Session.belongsToMany(models.Volunteer, {
      through: models.VolunteerAttendedSessions,
      foreignKey: "sessionId",
      otherKey: "volunteerId",
      as: "Attendees",
    });

    // One-to-Many relationship with VolunteerAttendedSessions
    Session.hasMany(models.VolunteerAttendedSessions, {
      foreignKey: "sessionId",
      as: "AttendanceDetails",
    });

    Session.belongsToMany(models.ServiceProvider, {
      through: "ServiceProviderSessions",
    });
  };

  return Session;
};
