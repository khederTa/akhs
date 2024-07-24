module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      action: DataTypes.STRING,
      resourceName: DataTypes.STRING,
      resourceId: DataTypes.STRING,
      date: DataTypes.DATE,
      time: DataTypes.TIME
    }, {
      tableName: 'Logs',
      timestamps: false
    });
  
    Log.associate = (models) => {
      Log.belongsTo(models.User, {foreignKey: "userId"})
    };
    return Log;
  };
  