const db = require("../module/db");

function clearTable(tableName) {
  const query = `DELETE FROM ${tableName}`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Ошибка при удалении данных:", error);
      return;
    }
    console.log("Все данные успешно удалены из таблицы");
  });
}

module.exports = clearTable;
