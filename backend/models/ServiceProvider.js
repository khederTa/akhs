module.exports = (sequelize, DataTypes) => {
  const ServiceProvider = sequelize.define(
    "ServiceProvider",
    {
      providerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      
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
    ServiceProvider.belongsTo(models.Position, { foreignKey: "positionId" });
    ServiceProvider.hasOne(models.User, { foreignKey: "providerId" });
    ServiceProvider.belongsToMany(models.Session, {
      through: "ServiceProviderSessions",
    });
  };

  return ServiceProvider;
};
