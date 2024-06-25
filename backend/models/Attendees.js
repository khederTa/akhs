module.exports = (sequelize, DataTypes) => {
    const Attendees = sequelize.define('Attendees', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      volunteerId: { type: DataTypes.INTEGER, references: { model: 'Volunteers', key: 'volunteerId' }},
      sessionId: { type: DataTypes.INTEGER, references: { model: 'Sessions', key: 'id' }},
      notes: DataTypes.STRING
    }, {
      tableName: 'Attendees',
      timestamps: false
    });
  
    return Attendees;
  };
  