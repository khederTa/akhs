module.exports = (sequelize, DataTypes) => {
    const ServiceProvider = sequelize.define('ServiceProvider', {
      providerId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      personId: { type: DataTypes.INTEGER, references: { model: 'Persons', key: 'id' }},
      role: DataTypes.STRING
    }, {
      tableName: 'ServiceProviders',
      timestamps: false
    });
  
    ServiceProvider.associate = models => {
      ServiceProvider.belongsTo(models.Person, { foreignKey: 'personId' });
    };
  
    return ServiceProvider;
  };
  