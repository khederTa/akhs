const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      password: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
    },
    {
      tableName: "Users",
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log(`Password hashed during create: ${user.password}`);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            // Only hash if the password field has been modified
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            console.log(`Password hashed during update: ${user.password}`);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Log, { foreignKey: "userId" });
    User.hasMany(models.SpecificAttributePermission, { foreignKey: "userId" });
    User.belongsTo(models.ServiceProvider, { foreignKey: "providerId" });
    User.belongsTo(models.Role, { foreignKey: "roleId" });

    User.hasOne(models.Department, { foreignKey: "managerId" });
    User.belongsToMany(models.Permission, { through: "UserPermission" });
  };

  User.prototype.validatePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log(`Comparing: ${password} with ${this.password} -> ${isMatch}`);
    return isMatch;
  };

  return User;
};
