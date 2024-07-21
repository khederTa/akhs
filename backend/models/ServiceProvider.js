module.exports = (sequelize, DataTypes) => {
    const ServiceProvider = sequelize.define('ServiceProvider', {
      providerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      position: DataTypes.STRING,
      role: DataTypes.STRING
    }, {
      tableName: 'ServiceProviders',
      timestamps: false
    });
  
    ServiceProvider.associate = models => {
      ServiceProvider.belongsTo(models.Person, { foreignKey: 'personId' });
      ServiceProvider.belongsToMany(models.Session, { through: 'ServiceProviderSessions' });
    };
  
    return ServiceProvider;
  };
 