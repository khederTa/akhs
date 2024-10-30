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
      pdfFile: {
        type: DataTypes.BLOB('long'), // Use 'long' for large files
        allowNull: true, // Set to true if it's optional
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
    
  };

  return Person;
};
