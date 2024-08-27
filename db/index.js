const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test", "root", "Shishlov1993", {
  dialect: "mysql",
  host: "127.0.0.1",
  logging: false,
});

const Products = require("./Products")(sequelize);
const Pictures = require("./Pictures")(sequelize);
const Parameter = require("./Parameter")(sequelize);
const Review = require("./Review")(sequelize);
const ReviewResponse = require("./ReviewResponse")(sequelize);
const Feedback = require("./Feedback")(sequelize);
const Category = require("./Category")(sequelize);
const SubCategory = require("./SubCategory")(sequelize);
const Order = require("./Orders")(sequelize);
const OrderItem = require("./OrderItems")(sequelize);
const SliderImg = require("./SliderImg")(sequelize);
const Admin = require("./Login")(sequelize);

Products.hasMany(Pictures, {
  as: "pictures",
  foreignKey: "product_id", // установка внешнего ключа
  onDelete: "CASCADE",
});

Pictures.belongsTo(Products, {
  foreignKey: "product_id",
});

Products.hasMany(Parameter, {
  as: "param",
  foreignKey: "product_id", // установка внешнего ключа
  onDelete: "CASCADE",
});

Parameter.belongsTo(Products, {
  foreignKey: "product_id",
});

Products.hasMany(Review, {
  as: "review",
  foreignKey: "product_id", // установка внешнего ключа
  onDelete: "CASCADE",
});

Review.belongsTo(Products, {
  foreignKey: "product_id",
});

Review.hasMany(ReviewResponse, {
  as: "reviewResponses", // Виправлено псевдонім
  foreignKey: "review_id", // Виправлено ключ з'єднання
  onDelete: "CASCADE",
});

ReviewResponse.belongsTo(Review, {
  foreignKey: "review_id", // Виправлено ключ з'єднання
});

Order.hasMany(OrderItem, {
  as: "orderItem", // Виправлено псевдонім
  foreignKey: "order_id", // Виправлено ключ з'єднання
  onDelete: "CASCADE",
});

OrderItem.belongsTo(Order, {
  foreignKey: "order_id", // Виправлено ключ з'єднання
});

module.exports = {
  // sequelize: sequelize.sync({ force: true }),
  sequelize: sequelize.sync(),
  products: Products,
  pictures: Pictures,
  parameter: Parameter,
  review: Review,
  reviewResponses: ReviewResponse,
  feedback: Feedback,
  category: Category,
  subCategory: SubCategory,
  order: Order,
  orderItem: OrderItem,
  slider: SliderImg,
  admin: Admin,
};
