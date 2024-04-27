const express = require("express");
const app = express();
const cors = require("cors");

const updateData = require("./router/update-data");
const updatePopular = require("./router/update-popular");
const updateSale = require("./router/update-sale");
const updatePartialData = require("./router/update_partial_data");

const getPopularAndPromotional = require("./router/get-popular-and-promotional");
const getCatalogData = require("./router/get-catalog-data");
const getProductsBySubCategoryId = require("./router/get-products-by-id");

const deletePopular = require("./router/delete-popular");
const deleteSale = require("./router/delete-sale");

const updateOrCreateProduct = require("./router/updateOrCreateProduct ");

app.use(cors());
app.use(express.json());

app.use("/api/update-data", updateData);

app.use("/products/get-popular-and-promotional", getPopularAndPromotional);
app.use("/get-catalog-data", getCatalogData);
app.use("/products/get-products-by-id", getProductsBySubCategoryId);

app.use("/products/update-popular", updatePopular);
app.use("/products/update-sale", updateSale);
app.use("/products/update_partial_data", updatePartialData);

app.use("/products/delete-popular", deletePopular);
app.use("/products/delete-sale", deleteSale);

app.use("/products/updateOrCreateProduct", updateOrCreateProduct);

app.get("/", (req, res) => {
  res.send("Привет, мир!");
});

app.listen(8000, () => {
  console.log("Приложение запущено на http://localhost:8000");
});
