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
    Role.belongsToMany(models.Permission, { through: 'RolePermission' });
    Role.hasMany(models.User, { foreignKey: "roleId" }); 
  };

  return Role;
};
