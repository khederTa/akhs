module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      street: DataTypes.STRING,
      village: DataTypes.STRING,
    },
    {
      tableName: "Addresses",
      timestamps: false,
    }
  );
  Address.associate = models => {
    Address.hasOne(models.Person, { foreignKey: 'addressId' });
    Address.hasOne(models.Session, { foreignKey: 'addressId' });
   
  };

  return Address;
};
