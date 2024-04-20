const { Router } = require("express");
const router = Router();
const db = require("../module/db");

async function getCatalogData(tableName) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} `;

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

router.get("/", async (req, res) => {
  try {
    const category = await getCatalogData("category");
    const subCategory = await getCatalogData("sub_category");

    res.status(200).json({
      message: "Данные отправленны успешно",
      category,
      subCategory,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
