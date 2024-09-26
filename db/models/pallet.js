"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class pallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      pallet.belongsTo(models.Statusproduct, {
        foreignKey: 'status_product',
        as: 'status', 
      });
    }
  }
  pallet.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      qr: DataTypes.TEXT,
      description: DataTypes.TEXT,
      status_product: {
        type: DataTypes.UUID,
      },
      is_active:{ 
        type: DataTypes.BOOLEAN,
        get() {
          return this.getDataValue('is_active') ? 'aktif' : 'tidak aktif';
        },
      },
      is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        get() {
          return this.getDataValue('is_available') ? 'Tersedia' : 'Digunakan';
        }, 
      },
    },
    {
      sequelize,
      modelName: "pallet",
      tableName: 'pallets',
    }
  );
  return pallet;
};
