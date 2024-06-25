module.exports = (sequelize, DataTypes) => {
    const Person = sequelize.define('Person', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      Mname: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      email: DataTypes.STRING,
      bDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      study: DataTypes.STRING,
      work: DataTypes.STRING,
      historyId: DataTypes.INTEGER
    }, {
      tableName: 'Persons',
      timestamps: false
    });
  
    Person.associate = models => {
      Person.hasMany(models.ServiceProvider, { foreignKey: 'personId' });
      Person.hasMany(models.Volunteer, { foreignKey: 'personId' });
    };
  
    return Person;
  };
  