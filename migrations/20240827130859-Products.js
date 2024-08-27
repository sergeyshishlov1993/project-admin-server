"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      product_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        primaryKey: true,
      },

      sub_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      product_description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      product_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },

      available: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      bestseller: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "false",
      },

      sale: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: "false",
      },

      sale_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0,
      },

      discount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      custom_product: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    await queryInterface.dropTable("products");
  },
};
