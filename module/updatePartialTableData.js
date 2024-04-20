// const db = require("../module/db");
// const _ = require("lodash");

// async function updateDataInTable(tableName, tableColumn, dataArr) {
//   try {
//     const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`; // Объединяем названия колонок в строку

//     const data = await new Promise((resolve, reject) => {
//       db.query(table, (error, results) => {
//         if (error) {
//           console.error("Ошибка при выполнении запроса:", error);
//           reject(error);
//         } else {
//           resolve(results.map((row) => tableColumn.map((col) => row[col])));
//         }
//       });
//     });

//     const dataStr = data.map((row) => JSON.stringify(row)).sort();
//     const dataArrStr = dataArr.map((row) => JSON.stringify(row)).sort();

//     // Если массивы не равны, обновляем данные в таблице
//     if (!_.isEqual(dataStr, dataArrStr)) {
//       await Promise.all(
//         dataArr.map(async (rowData) => {
//           const updatePromises = tableColumn.map(async (col, index) => {
//             const updateTable = `UPDATE ${tableName} SET ${col} = ? WHERE ${tableColumn[0]} = ?`;
//             const params = [rowData[index], rowData[0]];

//             await new Promise((resolve, reject) => {
//               db.query(updateTable, params, (error, results) => {
//                 if (error) {
//                   console.error("Ошибка при выполнении запроса:", error);
//                   reject(error);
//                 } else {
//                   resolve(results);
//                 }
//               });
//             });
//           });
//           await Promise.all(updatePromises);
//         })
//       );
//       console.log("Данные успешно обновлены");
//     } else {
//       console.log("Массивы данных совпадают, обновление не требуется");
//     }
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

// module.exports = {
//   updateDataInTable,
// };

//===========================================

const db = require("../module/db");
const _ = require("lodash");

async function updateDataInTable(tableName, tableColumn, dataArr, data) {
  try {
    const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`;

    const data = await new Promise((resolve, reject) => {
      db.query(table, (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
          reject(error);
        } else {
          resolve(results.map((row) => tableColumn.map((col) => row[col])));
        }
      });
    });

    const dataStr = data.map((row) => JSON.stringify(row)).sort();
    const dataArrStr = dataArr.map((row) => JSON.stringify(row)).sort();

    //console.log("table", dataStr);
    //console.log("link", dataArrStr);

    if (!_.isEqual(dataStr, dataArrStr)) {
      for (const rowData of dataArr) {
        const updatePromises = tableColumn.map(async (col, index) => {
          const updateTable = `UPDATE ${tableName} SET ${col} = ? WHERE ${tableColumn[0]} = ?`;
          const params = [rowData[index], rowData[0]];

          try {
            await new Promise((resolve, reject) => {
              db.query(updateTable, params, (error, results) => {
                if (error) {
                  console.error("Ошибка при выполнении запроса:", error);
                  reject(error);
                } else {
                  resolve(results);
                }
              });
            });
          } catch (error) {
            console.error("Ошибка:", error);
          }
        });
        await Promise.all(updatePromises);
      }
      console.log("Данные успешно обновлены (main)");
    } else {
      console.log("Массивы данных совпадают, обновление не требуется");
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

module.exports = {
  updateDataInTable,
};
