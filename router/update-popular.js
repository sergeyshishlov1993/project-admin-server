const { Router } = require("express");
const router = Router();
const db = require("../module/db");

async function updateBestsellerProduct(tableColumn, productId) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE products SET ${tableColumn} = 'true'  WHERE product_id = ?`;

    db.query(query, [productId], (error, results) => {
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
    await updateBestsellerProduct("bestseller", req.params.id);

    res.status(200).json({
      message: "Данные успешно обновлены",
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
