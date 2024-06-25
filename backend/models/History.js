module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define('History', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role: DataTypes.STRING,
      description: DataTypes.STRING,
      notes: DataTypes.STRING
    }, {
      tableName: 'Histories',
      timestamps: false
    });
  
    History.associate = models => {
      History.hasMany(models.Person, { foreignKey: 'historyId' });
    };
  
    return History;
  };
  