module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "Person",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      mname: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      bDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      study: DataTypes.STRING,
      work: DataTypes.STRING,
      city: DataTypes.STRING,
      street: DataTypes.STRING,    
    },
    {
      tableName: "Persons",
      timestamps: false,
    }
  );

  Person.associate = (models) => {
    Person.hasOne(models.ServiceProvider, { foreignKey: "personId" });
    Person.hasOne(models.Volunteer, { foreignKey: "personId" });
    Person.hasOne(models.User, { foreignKey: "personId" });
    // Person.belongsTo(models.Address, { foreignKey: "addressId" });
    Person.hasMany(models.History, { foreignKey: 'historyId' });
        };

  return Person;
};
