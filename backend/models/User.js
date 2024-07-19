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
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      addressId: {
        type: DataTypes.INTEGER,
        references: { model: "Addresses", key: "id" },
      },

      position: DataTypes.STRING,
      password: DataTypes.STRING,
      refreshToken: DataTypes.STRING,
      roleId: { type: DataTypes.INTEGER, references: { model: 'Roles', key: 'id' }}
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
        // beforeUpdate: async (user) => {
        //   if (user.password) {
        //     const salt = await bcrypt.genSalt(10);
        //     user.password = await bcrypt.hash(user.password, salt);
        //     console.log(`Password hashed during update: ${user.password}`);
        //   }
        // },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.UserPermission, { foreignKey: "userId" }); // New association
  };

  User.prototype.validatePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    console.log(`Comparing: ${password} with ${this.password} -> ${isMatch}`);
    return isMatch;
  };

  return User;
};
