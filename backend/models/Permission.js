module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING
    }, {
      tableName: 'Permissions',
      timestamps: false
    });
  
    return Permission;
  };
  