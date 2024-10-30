module.exports = (sequelize, DataTypes) => {
  const Person = sequelize.define(
    "Person",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      mname: DataTypes.STRING,
      momName: DataTypes.STRING,
      phone: DataTypes.STRING,
      email: DataTypes.STRING,
      bDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      study: DataTypes.STRING,
      work: DataTypes.STRING,
      nationalNumber: DataTypes.STRING,
      fixPhone: DataTypes.STRING,
      smoking: DataTypes.BOOLEAN,
      notes: DataTypes.STRING,
      prevVol: DataTypes.STRING,
      compSkilles: DataTypes.STRING,
      fileId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Files", // Reference the Files table
          key: "id",
        },
        allowNull: true, // Set to true if file is optional
      },
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
