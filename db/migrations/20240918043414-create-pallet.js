'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pallets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        unique: true
      },
      qr: { 
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      status_product: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'status_product',
            schema: 'public'
          },
          key: 'id'
        },
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pallets');
  }
};