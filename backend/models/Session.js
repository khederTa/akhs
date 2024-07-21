module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      hall_name: DataTypes.STRING,
      address: DataTypes.STRING,
      trainerId: DataTypes.INTEGER,
      providerId: DataTypes.INTEGER,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME
    }, {
      tableName: 'Sessions',
      timestamps: false
    });

    Session.associate = (models) => {

      Session.belongsTo(models.Activity, {foreignKey: "ActivityId",} );
  
  
    };
  
    return Session;
  };
  