const db = require("../module/db");

function addMissingElement(dataArr, data, tableName, tableColumn) {
  let missingElement;
  const dataStr = data.map((arr) => arr.map((item) => String(item)));
  const dataArrStr = dataArr.map((arr) => arr.map((item) => String(item)));

  for (let i = 0; i < dataArrStr.length; i++) {
    let found = false;

    for (let j = 0; j < dataStr.length; j++) {
      if (JSON.stringify(dataArrStr[i]) === JSON.stringify(dataStr[j])) {
        found = true;
        break;
      }
    }

    if (!found) {
      missingElement = dataArr[i];
      break;
    }
  }

  let idMisingEl = +missingElement[0];
  missingElement[0] = idMisingEl;

  const addMissingEl = `INSERT INTO ${tableName} (${tableColumn.join(
    ","
  )}) VALUES (?)`;

  db.query(addMissingEl, [missingElement], (err, result) => {
    if (err) {
      console.error("Ошибка при вставке категорий в базу данных:", err);
      return;
    }

    console.log("Данные о категориях успешно добавлены в базу данных:", result);
  });
}

//---------------------------------------------------------------------------

async function updateDataInTable(tableName, tableColumn, dataArr) {
  //формирую запрос к sql
  const table = `SELECT * FROM ${tableName}`;
  let data = [];

  //аминхроно получаем даные с таблицы
  try {
    const results = await new Promise((resolve, reject) => {
      db.query(table, (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    //перебираю данные из таблицы и записываю в результируюштй массив
    await results.forEach((el) => {
      const row = [];
      tableColumn.forEach((col) => {
        row.push(el[col]);
      });
      data.push(row);
    });

    //отсортировую данные в массиве с таблицы и массиве с загрузочного файла
    data.sort();
    dataArr.sort();

    if (data.length !== dataArr.length) {
      addMissingElement(dataArr, data, tableName, tableColumn);
    } else {
      console.log("else");
      console.log("data", data.length);
      console.log("dataArr", dataArr.length);
    }

    //циклом перебираю масивы и сравниваю значение
    for (let i = 0; i < dataArr.length; i++) {
      //перебор массива колонок для таблицы

      tableColumn.forEach((el, index) => {
        const updateTable = `UPDATE ${tableName} SET ${el} = ? WHERE ${tableColumn[0]} = ?`;
        // Параметры для запроса

        const params = [dataArr[i][index], dataArr[i][0]];
        // Выполнение запроса с использованием параметров

        db.query(updateTable, params, (error, results) => {
          if (error) {
            console.error("Ошибка при выполнении запроса:", error);
          } else {
            // console.log("Данные успешно обновлены:");
          }
        });
      });
    }
  } catch (error) {
    // Обработка ошибки, если необходимо
    console.error("Ошибка при выполнении запроса:", error);
  }
}

module.exports = updateDataInTable;
