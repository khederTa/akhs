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
  
    Department.associate = (models) => {
      Department.belongsTo(models.User, { foreignKey: "managerId" }); 
      Department.hasMany(models.User, { foreignKey: "departmentId" }); 
    };
    return Department;
  };
  