module.exports = (sequelize, DataTypes) => {
  const TrainingType = sequelize.define(
    "TrainingType",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      prerequest: DataTypes.JSON,
    },
    {
      tableName: "TrainingTypes",
      timestamps: false,
    }
  );

  return TrainingType;
};
