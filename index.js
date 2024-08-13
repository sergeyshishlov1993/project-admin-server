const express = require("express");
const app = express();
const cors = require("cors");

const home = require("./router/home");
const adminPage = require("./router/admin");
const productsPage = require("./router/products");
const sale = require("./router/sale");
const bestseller = require("./router/bestseller");
const feedback = require("./router/feedback");
const newPost = require("./router/novaPoshta");
const order = require("./router/orders");
const sliderRouter = require("./router/slider");

app.use(cors());
app.use(express.json());

//роут для админ панели
app.use("/admin", adminPage);

//начальная странцы
app.use("/home", home);

//main slider

app.use("/slider", sliderRouter);

//
app.use("/products", productsPage);

//распродвже
app.use("/sale", sale);

app.use("/feedback", feedback);

//хит продаж
app.use("/bestseller", bestseller);

//api nova poshta
app.use("/nova-poshta", newPost);

//офрмление заказов
app.use("/order", order);

app.get("/", (req, res) => {
  res.send("Привет, мир!");
});

app.listen(8000, () => {
  console.log("Приложение запущено на http://localhost:8000");
});
