const { Router } = require("express");
const router = Router();
const axios = require("axios");
const xml2js = require("xml2js");
const updateTableDate = require("../module/updateTableDate");

const parser = new xml2js.Parser({ explicitArray: false });

router.get("/", async (req, res) => {
  const id = req.params.category;

  try {
    //получвю данные с загрузочной ссылки
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );

    //конвертирую данные
    parser.parseString(response.data, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Ошибка при парсинге XML" });
      } else {
        //из данных забираю нужные переменые
        const { categories } = result.yml_catalog.shop;
        const { offers } = result.yml_catalog.shop;

        //создаю массивы для хранения
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

        // обработка товаров
        offers.offer.forEach((el) => {
          if (el.param) {
            for (let i = 0; i < el.param.length; i++) {
              param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
            }
          }

          if (el.picture) {
            for (let i = 0; i < el.picture.length; i++) {
              pictures.push([el.$.id, el.picture[0]]);
            }
          }

          product.push([
            el.$.id,
            el.categoryId,
            el.description.replace(/\n/g, ""),
            el.name,
            el.price,
            el.$.available,
          ]); // Добавляем элементы product
        });

        //вызов функций для обновления данных
        updateTableDate("category", ["id", "category_name"], categoryProd);

        // updateTableDate(
        //   "sub_category",
        //   ["sub_category_id", "parent_id", "sub_category_name"],
        //   subCategories
        // );

        // updateTableDate(
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

        // updateTableDate(
        //   "param",
        //   ["product_id", "parameter_name", "parameter_value"],
        //   param
        // );

        // updateTableDate("pictures", ["product_id", "pictures_name"], pictures);

        // Отправка ответа клиенту
        res.status(200).json({
          message: "Данные успешно обновлены",
          product,
        });
      }
    });
  } catch (error) {
    console.error("Ошибка при получении данных из API:", error);
    res.status(500).json({ message: "Ошибка при получении данных из API" });
  }
});

module.exports = router;
