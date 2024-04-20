const { Router } = require("express");
const router = Router();
const db = require("../module/db");

async function updateSaleProduct(tableColumn, productId, newPrice) {
  return new Promise((resolve, reject) => {
    const query = `UPDATE products SET  ${tableColumn} = 'false',  sale_price = ${newPrice}  WHERE product_id = ?`;

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

router.put("/:id", async (req, res) => {
  try {
    await updateSaleProduct("sale", req.params.id, 0);

    res.status(200).json({
      message: "Данные успешно обновлены",
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
