const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const ModelItem = sequelize.define(
  "ModelItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = ModelItem;
