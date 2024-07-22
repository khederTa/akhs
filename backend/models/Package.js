module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define(
    "Package",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
    },
    {
      tableName: "Packages",
      timestamps: false,
    }
  );

  Package.associate = (models) => {
    Package.hasMany(models.ActivityType, {
      foreignKey: "packageId",
    });

    Package.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
  };

  return Package;
};
