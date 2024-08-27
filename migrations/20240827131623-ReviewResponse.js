"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ReviewResponses", {
      response_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      review_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Reviews",
          key: "review_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      user_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      admin_response: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("ReviewResponses");
  },
};
