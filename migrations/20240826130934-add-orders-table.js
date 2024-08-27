"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      second_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      payment_method: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      postal_office: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      courier_delivery_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      total_price: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: "нове",
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
