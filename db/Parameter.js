const { Sequelize } = require("sequelize");

module.exports = function (sequelize) {
  return sequelize.define(
    "Parameter",
    {
      product_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        references: {
          // Вказуємо, що це внешний ключ
          model: "Products", // назва таблиці, до якої він відноситься
          key: "product_id", // поле в таблиці Products, на яке він вказує
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
