"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  pallet.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      qr_code: DataTypes.TEXT,
      status:{ 
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: false,
      },
      is_used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        get() {
          return this.getDataValue('is_used') ? 'Tersedia' : 'Digunakan';
        }, 
      },
      product_status: {
        type: DataTypes.ENUM('good', 'reject', 'empty', 'pending'),
        allowNull: false,
      },
      location: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "pallet",
      tableName: 'm_pallets',
    }
  );
  return pallet;
};
