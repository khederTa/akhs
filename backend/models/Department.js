module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      tableName: "Departments",
      timestamps: false,
    }
  );

  Department.associate = (models) => {
    Department.belongsTo(models.User, { foreignKey: "managerId" });
    // Department.hasMany(models.User, { foreignKey: "departmentId" });
    Department.hasMany(models.ServiceProvider, { foreignKey: "departmentId" });
    Department.hasMany(models.ActivityType, { foreignKey: "departmentId" });
  };
  return Department;
};
