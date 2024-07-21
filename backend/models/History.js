module.exports = (sequelize, DataTypes) => {
    const History = sequelize.define('History', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      description: DataTypes.STRING,
      notes: DataTypes.STRING
    }, {
      tableName: 'Histories',
      timestamps: false
    });
  
    History.associate = models => {
      History.belongsTo(models.Person, { foreignKey: 'historyId' });
    };
  
    return History;
  };
  