const { Router } = require("express");
const router = Router();
const db = require("../module/db");

async function getBestsellerOrPromotionalProduct(tableColumn) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM products WHERE ${tableColumn} = ?`;

    db.query(query, ["true"], (error, results) => {
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
    const bestsellers = await getBestsellerOrPromotionalProduct("bestseller");
    const sales = await getBestsellerOrPromotionalProduct("sale");

    res.status(200).json({
      message: "Данные успешно обновлены",
      bestsellers,
      sales,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
