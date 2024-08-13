const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util");
const parser = new xml2js.Parser({ explicitArray: false });
const parseStringPromise = util.promisify(parser.parseString);

const {
  category: Category,
  subCategory: SubCategory,
} = require("../../../../db");

//основная функция
const addCategoryValue = async () => {
  try {
    //парсим загрузочную ссылку
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    const result = await parseStringPromise(response.data);
    const { categories } = await result.yml_catalog.shop;
    const category = [];
    const subCategory = [];

    categories.category.forEach(async (x) => {
      if (x.$.parentId) {
        subCategory.push(x);
        try {
          await SubCategory.create({
            sub_category_id: x.$.id,
            parent_id: x.$.parentId,
            sub_category_name: x._,
          });
        } catch (error) {
          console.error("Помилка при створенні підкатегорії:", error);
        }
      } else {
        category.push(x);
        try {
          await Category.create({
            id: x.$.id,
            category_name: x._,
          });
        } catch (error) {
          console.error("Помилка при створенні категорії:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error during feed processing: ", error);
  }
};

module.exports = addCategoryValue;
