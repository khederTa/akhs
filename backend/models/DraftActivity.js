module.exports = (sequelize, DataTypes) => {
    const DraftActivity = sequelize.define(
      "DraftActivity",
      {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        trainingtypeId: { type: DataTypes.INTEGER },
        sessionsId: { type: DataTypes.JSON },
        done: { type: DataTypes.BOOLEAN },
      },
      {
        tableName: "DraftActivities",
        timestamps: false,
      }
    );
  
    DraftActivity.associate = (models) => {
      DraftActivity.belongsTo(models.TrainingType, {
        foreignKey: "trainingtypeId",
      });
    };
  
    return DraftActivity;
  };
  