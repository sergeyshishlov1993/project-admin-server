const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test", "root", "Shishlov1993", {
  dialect: "mysql",
  host: "127.0.0.1",
});

const Products = require("./Products")(sequelize);
const Pictures = require("./Pictures")(sequelize);
const Parameter = require("./Parameter")(sequelize);

Products.hasMany(Pictures, {
  as: "pictures",
  foreignKey: "product_id", // установка внешнего ключа
});
Pictures.belongsTo(Products, {
  foreignKey: "product_id",
});

Products.hasMany(Parameter, {
  as: "param",
  foreignKey: "product_id", // установка внешнего ключа
});
Parameter.belongsTo(Products, {
  foreignKey: "product_id",
});

module.exports = {
  // sequelize: sequelize.sync({ force: true }),
  sequelize: sequelize.sync(),
  products: Products,
  pictures: Pictures,
  parameter: Parameter,
};
