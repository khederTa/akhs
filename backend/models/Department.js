module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define('Department', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      managerId: DataTypes.INTEGER
    }, {
      tableName: 'Departments',
      timestamps: false
    });
  
    return Department;
  };
  