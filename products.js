const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const ModelItem = require("./modelItem");

const Products = sequelize.define(
  "Products",
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ModelItem,
        key: 'id',
      },
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primarykey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shippingFee: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
    },
    pricePerUnit: {
        type: DataType.DECIMAL(10,2),
        allowNull: false,
    },
    taxDetails: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    shippingTime: {
        type: DataTypes.Integer,
        allowNull: false,
    }
  }
);

module.exports = Products;
