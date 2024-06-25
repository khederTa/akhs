module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'userId' }},
      actionname: DataTypes.STRING,
      date: DataTypes.DATE
    }, {
      tableName: 'Logs',
      timestamps: false
    });
  
    return Log;
  };
  