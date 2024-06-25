module.exports = (sequelize, DataTypes) => {
    const UserPermission = sequelize.define('UserPermission', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'userId' }},
      permissionId: { type: DataTypes.INTEGER, references: { model: 'Permissions', key: 'id' }}
    }, {
      tableName: 'UserPermissions',
      timestamps: false
    });
  
    return UserPermission;
  };
  