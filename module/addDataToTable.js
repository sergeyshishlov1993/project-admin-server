const db = require("../module/db");

// Вставка данных о категориях в базу данных
function addDataToTable(tableName, tableColumn, dataArr) {
  const arrSql = `INSERT INTO ${tableName} (${tableColumn.join(",")}) VALUES ?`;
  const nullValues = Array(tableColumn.length).fill(null);
  const arrValues = dataArr.length > 0 ? dataArr : [nullValues];

  db.query(arrSql, [arrValues], (err, result) => {
    if (err) {
      console.error("Ошибка при вставке категорий в базу данных:", err);
      res.status(500).json({ message: "Ошибка сервера при вставке категорий" });
      return;
    }

    console.log("Данные о категориях успешно добавлены в базу данных:", result);
  });
}

module.exports = addDataToTable;
