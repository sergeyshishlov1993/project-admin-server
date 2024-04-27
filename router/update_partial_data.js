const { Router } = require("express");
const router = Router();
const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util");
const db = require("../module/db");
const parser = new xml2js.Parser({ explicitArray: false });
const parseStringPromise = util.promisify(parser.parseString);
const _ = require("lodash");

//gpt
async function getLinkData() {
  try {
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    const result = await parseStringPromise(response.data);
    const { offers } = result.yml_catalog.shop;

    offers.offer.forEach((x) => {
      const queryCheck = `SELECT * FROM products WHERE product_id = ?`;

      console.log("x", x);

      db.query(queryCheck, [x.$.id], (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
        } else {
          if (results.length > 0) {
            // Товар уже существует, обновляем данные
            const queryUpdate = `UPDATE products SET product_description = ?,product_name = ?, price = ? WHERE product_id = ?`;
            db.query(
              queryUpdate,
              [x.description, x.name, x.price, x.$.id],
              (error, results) => {
                if (error) {
                  console.error(
                    "Ошибка при выполнении запроса при обновлении:",
                    error
                  );
                } else {
                  console.log(
                    "->>> PRODUCT WAS SUCCESSFULLY UPDATED: id - " + x.$.id
                  );
                }
              }
            );
          } else {
            // Товара нет, создаем новый
            const queryInsert = `INSERT INTO products (product_id, sub_category_id, product_description, product_name,  price, available) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(
              queryInsert,
              [x.$.id, x.categoryId, x.description, x.name, x.price, "true"],
              (error) => {
                if (error) {
                  console.error(
                    "Ошибка при выполнении запроса при добавлении нового товара:",
                    error.message
                  );
                } else {
                  console.log(
                    "->>> PRODUCT WAS SUCCESSFULLY INSERTED: id - " + x.$.id
                  );
                }
              }
            );
          }
        }
      });
    });
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
}

//gpt end

router.put("/", async (req, res) => {
  try {
    const tableColumns = [
      "product_id",
      "product_description",
      "product_name",
      "price",
    ];

    const linkData = await getLinkData();

    res.json({ message: "Data synchronized" });
  } catch (error) {
    res.status(500).json({ message: "Виникла помилка", error: error.message });
  }
});

module.exports = router;




