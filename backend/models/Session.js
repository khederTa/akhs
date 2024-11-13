  module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      hall_name: DataTypes.STRING,
      city: DataTypes.STRING,
      street: DataTypes.STRING,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME
    }, {
      tableName: 'Sessions',
      timestamps: false
    });

    Session.associate = (models) => {
      Session.belongsTo(models.Activity, {foreignKey: "activityId",} );
      // Session.belongsTo(models.Address, {foreignKey: "addressId",} );
      Session.belongsToMany(models.ServiceProvider, { through: 'ServiceProviderSessions' });
Session.belongsToMany(models.Volunteer, {
  through: models.VolunteerAttendedSessions,
  foreignKey: 'sessionId',
  otherKey: 'volunteerId'
});


  
  
    };
  
    return Session;
  };
  