// models/VolunteerAttendedActivity.js
module.exports = (sequelize, DataTypes) => {
    const VolunteerAttendedActivity = sequelize.define(
      "VolunteerAttendedActivity",
      {
        volunteerId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Volunteers",
            key: "volunteerId",
          },
        },
        activityId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          references: {
            model: "Activities",
            key: "id",
          },
        },
        status:  DataTypes.STRING, 
        
      },
      {
        tableName: "VolunteerAttendedActivity",
        timestamps: false,
      }
    );
  
    return VolunteerAttendedActivity;
  };
  