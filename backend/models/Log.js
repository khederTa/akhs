module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      actionname: DataTypes.STRING,
      date: DataTypes.DATE
    }, {
      tableName: 'Logs',
      timestamps: false
    });
  
    Log.associate = (models) => {
      Log.belongsTo(models.User, {foreignKey: "userId"})
    };
    return Log;
  };
  