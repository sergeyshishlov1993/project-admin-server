const express = require("express");
const app = express();
const cors = require("cors");
const addData = require("./router/addData");
const updateData = require("./router/updateData");

app.use(cors());
app.use(`/api/addData`, addData);
app.use("/api/updateData", updateData);

app.get("/", (req, res) => {
  res.send("Привет, мир!");
});

app.listen(8000, () => {
  console.log("Приложение запущено на http://localhost:8000");
});
