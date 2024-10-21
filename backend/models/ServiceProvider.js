module.exports = (sequelize, DataTypes) => {
  const ServiceProvider = sequelize.define(
    "ServiceProvider",
    {
      providerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      position: DataTypes.STRING,
    },
    {
      tableName: "ServiceProviders",
      timestamps: false,
    }
  );

  ServiceProvider.associate = (models) => {
    ServiceProvider.belongsTo(models.Volunteer, { foreignKey: "volunteerId" });
    ServiceProvider.belongsTo(models.Department, {
      foreignKey: "departmentId",
    });
    ServiceProvider.hasOne(models.User, { foreignKey: "providerId" });
    ServiceProvider.belongsToMany(models.Session, {
      through: "ServiceProviderSessions",
    });
  };

  return ServiceProvider;
};
