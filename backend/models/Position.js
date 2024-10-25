module.exports = (sequelize, DataTypes) => {
    const Position = sequelize.define(
      "Position",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
      },
      {
        tableName: "Positions",
        timestamps: false,
      }
    );
  
    // Add associations here if necessary
    Position.associate = (models) => {
        Position.hasMany(models.ServiceProvider, { foreignKey: "positionId" });
    };
  
    return Position;
  };
  