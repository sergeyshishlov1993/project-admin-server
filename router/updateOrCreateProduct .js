// const { Router } = require("express");
// const router = Router();
// const axios = require("axios");
// const xml2js = require("xml2js");
// const util = require("util");
// const parser = new xml2js.Parser({ explicitArray: false });
// const parseStringPromise = util.promisify(parser.parseString);

// const {
//   products: Products,
//   pictures: Pictures,
//   parameter: Parameter,
// } = require("../db");

// const updateOrCreateProductsFromFeed = async () => {
//   try {
//     const response = await axios.get(
//       "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
//     );
//     const result = await parseStringPromise(response.data);
//     const { offers } = result.yml_catalog.shop;

//     offers.offer.forEach(async (x) => {
//       const data = await Products.findAll({
//         where: {
//           product_id: [x.$.id],
//         },
//       });

//       if (data.length > 0) {
//         // Товар уже существует, обновляем данные
//         Products.update(
//           {
//             product_description: x.description,
//             product_name: x.name,
//             price: x.price,
//           },
//           {
//             where: {
//               product_id: [x.$.id],
//             },
//           }
//         );

//         await Pictures.destroy({
//           where: { product_id: x.$.id },
//         });

//         // Додаємо нові зображення

//         const pictures = Array.isArray(x.picture) ? x.picture : [x.picture];
//         const picturesData = pictures.map((picture) => ({
//           product_id: x.$.id,
//           pictures_name: picture,
//         }));

//         await Pictures.bulkCreate(picturesData);

//         //table param

//         await Parameter.destroy({
//           where: { product_id: x.$.id },
//         });

//         const parameter = Array.isArray(x.param) ? x.param : [x.param];

//         const parameterData = parameter.map((param) => ({
//           product_id: x.$.id,
//           parameter_name: param ? param["_"] : undefined,
//           parameter_value: param ? param.$?.name : undefined,
//         }));

//         await Parameter.bulkCreate(parameterData);
//       } else {
//         const product = await Products.create({
//           product_id: x.$.id,
//           sub_category_id: x.categoryId,
//           product_description: x.description,
//           product_name: x.name,
//           price: x.price,
//           available: x.$.available,
//         });

//         // Перевіряємо, чи x.pictures є масивом. Якщо ні - робимо з нього масив.
//         const pictures = Array.isArray(x.picture) ? x.picture : [x.picture];

//         // Тепер обробляємо кожне зображення в масиві pictures
//         const picturesData = pictures.map((picture) => ({
//           product_id: x.$.id, // Використовуємо id створеного продукту
//           pictures_name: picture, // Припускаємо, що picture - це просто назва файлу
//         }));

//         // Створюємо всі зображення одночасно
//         await Pictures.bulkCreate(picturesData);

//         //table param

//         const parameter = Array.isArray(x.param) ? x.param : [x.param];

//         const parameterData = parameter.map((param) => ({
//           product_id: x.$.id,
//           parameter_name: param ? param["_"] : undefined,
//           parameter_value: param ? param.$?.name : undefined,
//         }));

//         await Parameter.bulkCreate(parameterData);
//       }
//     });
//   } catch (error) {}
// };

// router.put("/", async (req, res) => {
//   try {
//     updateOrCreateProductsFromFeed();
//     res.json({ message: "Data synchronized" });
//   } catch (error) {
//     res.status(500).json({ message: "Виникла помилка", error: error.message });
//   }
// });

// module.exports = router;

const { Router } = require("express");
const router = Router();
const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util");
const parser = new xml2js.Parser({ explicitArray: false });
const parseStringPromise = util.promisify(parser.parseString);

const {
  products: Products,
  pictures: Pictures,
  parameter: Parameter,
} = require("../db");

//наполняем дочернюю таблицу ссылок на изображение
async function handlePictures(product_id, pictures) {
  await Pictures.destroy({ where: { product_id } });
  const picturesData = (Array.isArray(pictures) ? pictures : [pictures]).map(
    (picture) => ({
      product_id,
      pictures_name: picture,
    })
  );
  await Pictures.bulkCreate(picturesData);
}

//наполняем дочернюю таблицу параметров
async function handleParameters(product_id, parameters) {
  await Parameter.destroy({ where: { product_id } });
  const parameterData = (
    Array.isArray(parameters) ? parameters : [parameters]
  ).map((param) => ({
    product_id,
    parameter_name: param ? param["_"] : undefined,
    parameter_value: param ? param.$?.name : undefined,
  }));
  await Parameter.bulkCreate(parameterData);
}

//основная функция
const updateOrCreateProductsFromFeed = async () => {
  try {
    //парсим загрузочную ссылку
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    const result = await parseStringPromise(response.data);
    const { offers } = result.yml_catalog.shop;

    //получаем массив продуктов
    offers.offer.forEach(async (x) => {
      //заполняем таблицу продукты
      const [product, created] = await Products.findOrCreate({
        where: { product_id: x.$.id },
        defaults: {
          sub_category_id: x.categoryId,
          product_description: x.description,
          product_name: x.name,
          price: x.price,
          available: x.$.available,
        },
      });

      //если создан то обновляем его
      if (!created) {
        await product.update({
          product_description: x.description,
          product_name: x.name,
          price: x.price,
        });
      }

      //вызываем функцию для наполнение и обновление дочерних таблиц
      await handlePictures(x.$.id, x.picture);
      await handleParameters(x.$.id, x.param);
    });
  } catch (error) {
    console.error("Error during feed processing: ", error);
  }
};

router.put("/", async (req, res) => {
  try {
    await updateOrCreateProductsFromFeed();
    res.json({ message: "Data synchronized" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error synchronizing data", error: error.message });
  }
});

module.exports = router;
