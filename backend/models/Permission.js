module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    action: DataTypes.STRING,
    resource: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    tableName: 'Permissions',
    timestamps: false
  });

  return Permission;
};
