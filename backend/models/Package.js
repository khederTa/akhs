module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define('Package', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      department: DataTypes.STRING,
      trainingTypes: DataTypes.JSON,
    }, {
      tableName: 'Packages',
      timestamps: false
    });
  
    return Package;
  };
  