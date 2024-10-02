'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Outlet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Outlet.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    franchise: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      get() {
        return this.getDataValue('franchise') ? 'ya' : 'tidak';
      }, 
    },
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    status:{ 
      type: DataTypes.BOOLEAN,
      get() {
        return this.getDataValue('is_active') ? 'aktif' : 'tidak aktif';
      },
    }
  }, {
    sequelize,
    modelName: 'Outlet',
    tableName: 'm_outlet',
  });
  return Outlet;
};