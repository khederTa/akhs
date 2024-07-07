module.exports = (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      permssionId: { type: DataTypes.INTEGER, references: { model: 'Permissions', key: 'id' }},
      roleId: { type: DataTypes.INTEGER, references: { model: 'Roles', key: 'id' }}
    }, {
      tableName: 'RolePermissions',
      timestamps: false
    });
  
    return RolePermission;
  };  