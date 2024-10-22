module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define(
    "Package",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
    },
    {
      tableName: "Packages",
      timestamps: false,
    }
  );

  Package.associate = (models) => {
    Package.belongsToMany(models.ActivityType, {
      through: "ActivityTypesPackages",
      timestamps: false,
    });
  };

  return Package;
};
