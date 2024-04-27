const { Sequelize } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "Pictures",
    {
      product_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
      },

      pictures_name: {
        type: Sequelize.STRING(255),
      },
    },
    {
      timestamps: true,
      tableName: "pictures",
    }
  );
};
