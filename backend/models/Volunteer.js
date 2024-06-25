module.exports = (sequelize, DataTypes) => {
    const Volunteer = sequelize.define('Volunteer', {
      volunteerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      personId: { type: DataTypes.INTEGER, references: { model: 'Persons', key: 'id' }},
      disable: DataTypes.BOOLEAN,
      disable_status: DataTypes.STRING
    }, {
      tableName: 'Volunteers',
      timestamps: false
    });
  
    Volunteer.associate = models => {
      Volunteer.belongsTo(models.Person, { foreignKey: 'personId' });
    };
  
    return Volunteer;
  };
  