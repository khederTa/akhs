module.exports = (sequelize, DataTypes) => {
    const File = sequelize.define(
      "File",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        file: {
          type: DataTypes.BLOB('long'), // Storing file as binary data
          allowNull: false,
        },
      },
      {
        tableName: "Files",
        timestamps: false,
      }
    );
  
    return File;
  };
  