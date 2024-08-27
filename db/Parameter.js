const { Sequelize } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "Parameter",
    {
      product_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          model: "Products",
          key: "product_id",
        },
      },

      parameter_name: {
        type: Sequelize.STRING(255),
      },

      parameter_value: {
        type: Sequelize.STRING(255),
      },
    },
    {
      timestamps: true,
      tableName: "param",
    }
  );
};
