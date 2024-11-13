// models/VolunteerAttendedSessions.js
module.exports = (sequelize, DataTypes) => {
  const VolunteerAttendedSessions = sequelize.define(
    "VolunteerAttendedSessions",
    {
      volunteerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "Volunteers", key: "volunteerId" },
      },
      sessionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: "Sessions", key: "id" },
      },
      status:  DataTypes.STRING, 
    },
    {
      tableName: "VolunteerAttendedSessions",
      timestamps: false,
    }
  );

  return VolunteerAttendedSessions;
};
