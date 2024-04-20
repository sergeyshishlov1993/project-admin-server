const { Router } = require("express");
const router = Router();
const db = require("../module/db");

async function getProductsBySubCategory(tableName, id, column_name) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column_name} = ${id}`;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Ошибка при выполнении запроса:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

router.get("/:id", async (req, res) => {
  try {
    const productsBySubCategory = await getProductsBySubCategory(
      "products",
      req.params.id,
      "sub_category_id"
    );

    const pictures = productsBySubCategory.map(async (el) => {
      return await getProductsBySubCategory(
        "pictures",
        el.product_id,
        "product_id"
      );
    });

    const param = productsBySubCategory.map(async (el) => {
      return await getProductsBySubCategory(
        "param",
        el.product_id,
        "product_id"
      );
    });

    const picturesBySubCategory = await Promise.all(pictures);
    const paramBySubCategory = await Promise.all(param);

    const productsWithPicturesAndParams = [];

    productsBySubCategory.forEach((product) => {
      const pictures = picturesBySubCategory.flatMap((picture) =>
        picture.filter((picture) => picture.product_id === product.product_id)
      );

      const params = paramBySubCategory.flatMap((params) =>
        params.filter((param) => param.product_id === product.product_id)
      );

      productsWithPicturesAndParams.push({
        ...product,
        pictures,
        params,
      });
    });

    res.status(200).json({
      message: "Данные отправленны успешно",
      productsWithPicturesAndParams,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
