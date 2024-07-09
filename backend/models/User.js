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
      fname: DataTypes.STRING,
      lname: DataTypes.STRING,
      email: DataTypes.STRING,
      position: DataTypes.STRING,
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
          }
        },
        beforeUpdate: async (user) => {
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.UserRole, { foreignKey: "userId" });
    User.hasMany(models.UserPermission, { foreignKey: "userId" }); // New association
  };

  User.prototype.validatePassword = async function (password) {
    const comp = await bcrypt.compare(password, this.password);
    return comp;
  };

  return User;
};
