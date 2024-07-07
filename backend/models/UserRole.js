module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'userId' }},
      roleId: { type: DataTypes.INTEGER, references: { model: 'Roles', key: 'id' }}
    }, {
      tableName: 'UserRoles',
      timestamps: false
    });
  
    return UserRole;
  };
  