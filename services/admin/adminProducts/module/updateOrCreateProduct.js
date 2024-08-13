const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util");
const parser = new xml2js.Parser({ explicitArray: false });
const parseStringPromise = util.promisify(parser.parseString);

const {
  products: Products,
  pictures: Pictures,
  parameter: Parameter,
} = require("../../../../db");

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
    parameter_name: param ? param.$?.name : undefined,
    parameter_value: param ? param["_"] : undefined,
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
      let discount = ((+x.oldprice - x.price) * 100) / x.price;
      if (x.oldprice) {
        const [product, created] = await Products.findOrCreate({
          where: { product_id: x.$.id },
          defaults: {
            sub_category_id: x.categoryId,
            product_description: x.description,
            product_name: x.name,
            price: x.oldprice,
            sale_price: x.price,
            sale: x.oldprice ? "true" : "false",
            discount: Math.floor(discount),
            available: x.$.available,
          },
        });
      }

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
          price: x.oldprice || x.price,
          sale_price: x.oldprice ? x.price : 0,
          sale: x.oldprice ? "true" : "false",
          discount: discount || 0,
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

module.exports = updateOrCreateProductsFromFeed;
