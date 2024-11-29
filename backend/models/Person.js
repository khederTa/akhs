module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "Person",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      mname: DataTypes.STRING,
      momname: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      bDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      study: DataTypes.STRING,
      work: DataTypes.STRING,
      nationalNumber:{
        type: DataTypes.STRING,
        unique: true, // Ensures this column is unique
        allowNull: false
      },
      fixPhone: DataTypes.STRING,
      smoking: DataTypes.STRING,
      note: DataTypes.STRING,
      prevVol: DataTypes.STRING,
      compSkill: DataTypes.STRING,
      koboSkill: DataTypes.STRING,
     
    },
    {
      tableName: "Persons",
      timestamps: false,
    }
  );

  Person.associate = (models) => {
    Person.hasOne(models.Volunteer, { foreignKey: "personId" });
    Person.belongsTo(models.Address, { foreignKey: "addressId" });
    Person.belongsTo(models.File, { foreignKey: "fileId" }); // Person has one File through fileId
  };

  return Person;
};
