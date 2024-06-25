module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
      country: DataTypes.STRING,
      state: DataTypes.STRING,
      city: DataTypes.STRING,
      street: DataTypes.STRING,
      buildingname: DataTypes.STRING
    }, {
      tableName: 'Addresses',
      timestamps: false
    });
  
    return Address;
  };
  