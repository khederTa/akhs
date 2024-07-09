module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    tableName: 'Roles',
    timestamps: false
  });

  Role.associate = (models) => {
    Role.hasMany(models.RolePermission, { foreignKey: 'roleId' });
  };

  return Role;
};
