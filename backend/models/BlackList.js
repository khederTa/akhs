module.exports = (sequelize, DataTypes) => {
    const BlackList = sequelize.define(
      "BlackList",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        action: DataTypes.STRING,
        resourceName: DataTypes.STRING,
        resourceId: DataTypes.STRING,
        description: DataTypes.STRING,
      },
      {
        tableName: "BlackLists",
        timestamps: false,
      }
    );
  
    BlackList.associate = (models) => {
      BlackList.belongsTo(models.User, { foreignKey: "userId" });    
    };
  
    return BlackList;
  };
  