module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      hall_name: DataTypes.STRING,
      providerId: DataTypes.INTEGER,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME
    }, {
      tableName: 'Sessions',
      timestamps: false
    });

    Session.associate = (models) => {
      Session.belongsTo(models.Activity, {foreignKey: "ActivityId",} );
      Session.belongsTo(models.Address, {foreignKey: "AddressId",} );
      Session.belongsToMany(models.ServiceProvider, { through: 'ServiceProviderSessions' });
      Session.belongsToMany(models.Volunteer, { through: 'VolunteerAttendedSessions' });

  
  
    };
  
    return Session;
  };
  