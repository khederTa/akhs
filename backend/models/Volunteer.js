module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define('Volunteer', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      disable: DataTypes.BOOLEAN,
      disable_status: DataTypes.STRING
    }, {
      tableName: 'Volunteers',
      timestamps: false
    });
  
    Volunteer.associate = models => {
      Volunteer.belongsTo(models.Person, { foreignKey: 'personId' });
      Volunteer.hasOne(models.ServiceProvider, { foreignKey: "volunteerId" });
      Volunteer.belongsToMany(models.Session, { through: 'VolunteerAttendedSessions' });
      Volunteer.belongsToMany(models.Activity, { through: 'VolunteerAttendedActivity' });
    };
  
    return Volunteer;
  };
  