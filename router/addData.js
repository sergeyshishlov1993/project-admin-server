const { Router } = require("express");
const router = Router();
const axios = require("axios");
const xml2js = require("xml2js");
const clearTable = require("../module/clearTable");
const addDataToTable = require("../module/addDataToTable");
const db = require("../module/db");

const parser = new xml2js.Parser({ explicitArray: false });

router.get("/", async (req, res) => {
  const id = req.params.category;

  try {
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    parser.parseString(response.data, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Ошибка при парсинге XML" });
      } else {
        const { categories } = result.yml_catalog.shop;
        const { offers } = result.yml_catalog.shop;
        const categoryProd = [];
        const subCategories = [];
        const product = [];
        const param = [];
        const pictures = [];

        // Обработка категорий
        if (categories && categories.category) {
          categories.category.forEach((el) => {
            if (!el.$.parentId) {
              categoryProd.push([el.$.id, el._]);
            } else {
              subCategories.push([el.$.id, el.$.parentId, el._]);
            }
          });
        }

        offers.offer.forEach((el) => {
          if (el.param) {
            for (let i = 0; i < el.param.length; i++) {
              param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
            }
          }

          if (el.picture) {
            for (let i = 0; i < el.picture.length; i++) {
              pictures.push([el.$.id, el.picture[i]]);
            }
          }

          product.push([
            el.$.id,
            el.categoryId,
            el.description,
            el.name,
            el.price,
            el.$.available,
          ]); // Добавляем элементы product
        });

        const data = [];

        async function test() {
          const table = `SELECT * FROM param`;

          try {
            const results = await new Promise((resolve, reject) => {
              db.query(table, (error, results) => {
                if (error) {
                  console.error("Ошибка при выполнении запроса:", error);
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            });

            // Присваиваем результат запроса переменной data
            res.status(200).json({
              message: "Данные успешно обработаны и добавлены в базу данных",
              results,
            });

            // Далее можно продолжить выполнение операций с полученными данными
          } catch (error) {
            // Обработка ошибки, если необходимо
            console.error("Ошибка при выполнении запроса:", error);
          }
        }

        test();

        console.log(data);

        addDataToTable("category", ["id", "category_name"], categoryProd);
        // addDataToTable(
        //   "sub_category",
        //   ["sub_category_id", "parent_id", "sub_category_name"],
        //   subCategories
        // );

        // addDataToTable(
        //   "products",
        //   [
        //     "product_id",
        //     "sub_category_id",
        //     "product_description",
        //     "product_name",
        //     "price",
        //     "available",
        //   ],
        //   product
        // );

        // addDataToTable(
        //   "param",
        //   ["product_id", "parameter_name", "parameter_value"],
        //   param
        // );
        // addDataToTable("pictures", ["product_id", "pictures_name"], pictures);

        // Отправка ответа клиенту
      }
    });
  } catch (error) {
    console.error("Ошибка при получении данных из API:", error);
    res.status(500).json({ message: "Ошибка при получении данных из API" });
  }
});

module.exports = router;
