// const { Router } = require("express");
// const router = Router();
// const axios = require("axios");
// const xml2js = require("xml2js");
// const updateTableDate = require("../module/updateTableDate");

// const parser = new xml2js.Parser({ explicitArray: false });

// router.put("/", async (req, res) => {
//   try {
//     //получвю данные с загрузочной ссылки
//     const response = await axios.get(
//       "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
//     );

//     //конвертирую данные
//     parser.parseString(response.data, (err, result) => {
//       if (err) {
//         res.status(500).json({ message: "Ошибка при парсинге XML" });
//       } else {
//         //из данных забираю нужные переменые
//         const { categories } = result.yml_catalog.shop;
//         const { offers } = result.yml_catalog.shop;

//         //создаю массивы для хранения
//         const categoryProd = [];
//         const subCategories = [];
//         const product = [];
//         const param = [];
//         const pictures = [];

//         // Обработка категорий
//         if (categories && categories.category) {
//           categories.category.forEach((el) => {
//             if (!el.$.parentId) {
//               categoryProd.push([el.$.id, el._]);
//             } else {
//               subCategories.push([el.$.id, el.$.parentId, el._]);
//             }
//           });
//         }

//         // обработка товаров
//         offers.offer.forEach((el) => {
//           if (el.param) {
//             for (let i = 0; i < el.param.length; i++) {
//               param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
//             }
//           }

//           if (el.picture) {
//             for (let i = 0; i < el.picture.length; i++) {
//               pictures.push([el.$.id, el.picture[i]]);
//             }
//           }

//           product.push([
//             el.$.id,
//             el.categoryId,
//             // el.description.replace(/\n/g, ""),
//             el.description,
//             el.name,
//             el.price,
//             el.$.available,
//           ]); // Добавляем элементы product
//         });

//         //вызов функций для обновления данных

//         updateTableDate(
//           "products",
//           [
//             "product_id",
//             "sub_category_id",
//             "product_description",
//             "product_name",
//             "price",
//             "available",
//           ],

//           product
//         );

//         updateTableDate(
//           "param",
//           ["product_id", "parameter_name", "parameter_value"],
//           param
//         );

//         // updateTableDate("pictures", ["product_id", "pictures_name"], pictures);

//         // Отправка ответа клиенту
//         res.status(200).json({
//           message: "Данные успешно обновлены (redirect) ",
//           product,
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Ошибка при получении данных из API:", error);
//     res.status(500).json({ message: "Ошибка при получении данных из API" });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const updateTableDate = require("../module/updateTableDate");

const router = express.Router();
const parser = new xml2js.Parser({ explicitArray: false });

router.put("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    const result = await parser.parseStringPromise(response.data);

    const { categories, offers } = result.yml_catalog.shop;
    const categoryProd = [];
    const subCategories = [];
    const product = [];
    const param = [];
    const pictures = [];

    if (categories && categories.category) {
      categories.category.forEach((el) => {
        if (!el.$.parentId) {
          categoryProd.push([el.$.id, el._]);
        } else {
          subCategories.push([el.$.id, el.$.parentId, el._]);
        }
      });
    }

    // offers.offer.forEach((el) => {
    //   if (el.param) {
    //     // el.param.forEach((p) => param.push([el.$.id, p.$.name, p._]));

    //     const paramsArray = Array.isArray(el.param)
    //       ? el.param
    //       : [el.param].filter(Boolean);

    //     // Тепер можна безпечно використовувати forEach для обходу параметрів
    //     paramsArray.forEach((param) => {
    //       if (param) {
    //         param.push([el.$.id, param.$.name, param._]);
    //       }
    //     });
    //   }

    //   if (el.picture) {
    //     // el.picture.forEach((pic) => pictures.push([el.$.id, pic]));
    //     const picturesArray = Array.isArray(el.picture)
    //       ? el.picture
    //       : [el.picture].filter(Boolean);

    //     // Тепер можна безпечно використовувати forEach
    //     picturesArray.forEach((pic) => {
    //       pictures.push([el.$.id, pic]);
    //     });
    //   }

    //   product.push([
    //     el.$.id,
    //     el.categoryId,
    //     el.description,
    //     el.name,
    //     el.price,
    //     el.$.available,
    //   ]);
    // });

    // offers.offer.forEach((el) => {
    //   if (el.param) {
    //     for (let i = 0; i < el.param.length; i++) {
    //       param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
    //     }
    //   }

    //   if (Array.isArray(el.picture)) {
    //     for (let i = 0; i < el.picture.length; i++) {
    //       pictures.push([el.$.id, el.picture[i]]);
    //     }
    //   } else {
    //     pictures.push([el.$.id, el.picture]);
    //   }

    //   product.push([
    //     el.$.id,
    //     el.categoryId,
    //     el.description,
    //     el.name,
    //     el.price,
    //     el.$.available,
    //   ]);
    // });

    offers.offer.forEach((el) => {
      // console.log(
      //   "Element processing:",
      //   el.$.id,
      //   el.categoryId,
      //   el.description,
      //   el.name,
      //   el.price,
      //   el.$.available
      // );

      if (el.param) {
        const paramsArray = Array.isArray(el.param)
          ? el.param
          : [el.param].filter(Boolean);
        paramsArray.forEach((paramItem) => {
          param.push([el.$.id, paramItem.$.name, paramItem._]);
          // console.log("Params added:", el.$.id, paramItem.$.name, paramItem._);
        });
      }

      if (el.picture) {
        const picturesArray = Array.isArray(el.picture)
          ? el.picture
          : [el.picture].filter(Boolean);
        picturesArray.forEach((pic) => {
          pictures.push([el.$.id, pic]);
          // console.log("Picture added:", el.$.id, pic);
        });
      }

      product.push([
        el.$.id,
        el.categoryId,
        el.description,
        el.name,
        el.price,
        el.$.available,
      ]);
      // console.log(
      //   "Product added:",
      //   el.$.id,
      //   el.categoryId,
      //   el.description,
      //   el.name,
      //   el.price,
      //   el.$.available
      // );
    });

    // Оновлення даних
    await updateTableDate(
      "products",
      [
        "product_id",
        "sub_category_id",
        "product_description",
        "product_name",
        "price",
        "available",
      ],
      product
    );
    await updateTableDate(
      "param",
      ["product_id", "parameter_name", "parameter_value"],
      param
    );

    res.status(200).json({ message: "Данные успешно обновлены", product });
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
    res.status(500).json({ message: "Ошибка при обработке данных" });
  }
});

module.exports = router;
