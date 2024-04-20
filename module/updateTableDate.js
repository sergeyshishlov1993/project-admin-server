// const db = require("../module/db");
// const _ = require("lodash");

// async function addMissingElements(dataArr, data, tableName, tableColumn) {
//   // const dataStr = data.map((arr) => arr.map((item) => String(item))).sort();
//   // const dataArrStr = dataArr
//   //   .map((arr) => arr.map((item) => String(item)))
//   //   .sort();
//   // for (let i = 0; i < dataArrStr.length; i++) {
//   //   if (!dataStr.some((row) => _.isEqual(row, dataArrStr[i]))) {
//   //     const addMissingEl = `INSERT INTO ${tableName} (${tableColumn.join(
//   //       ","
//   //     )}) VALUES (?)`;
//   //     console.log(dataArrStr[i]);
//   //     await new Promise((resolve, reject) => {
//   //       db.query(addMissingEl, [dataArrStr[i]], (err, result) => {
//   //         if (err) {
//   //           console.error("Ошибка при вставке категорий в базу данных:", err);
//   //           reject(err);
//   //         } else {
//   //           // console.log(
//   //           //   "Данные о категориях успешно добавлены в базу данных:",
//   //           //   result
//   //           // );
//   //           resolve();
//   //         }
//   //       });
//   //     });
//   //   }
//   // }
//   //==========================-------============

//   const dataStr = data.map((arr) => arr.map((item) => String(item))).sort();
//   const dataArrStr = dataArr
//     .map((arr) => arr.map((item) => String(item)))
//     .sort();

//   async function insertData() {
//     for (const item of dataArrStr) {
//       if (!dataStr.some((row) => _.isEqual(row, item))) {
//         const addMissingEl = `INSERT INTO ${tableName} (${tableColumn.join(
//           ","
//         )}) VALUES (?)`;

//         try {
//           await new Promise((resolve, reject) => {
//             db.query(addMissingEl, [item], (err, result) => {
//               if (err) {
//                 console.error(
//                   "Ошибка при вставке категорий в базу данных:",
//                   err
//                 );
//                 reject(err);
//               } else {
//                 // console.log(
//                 //   "Данные о категориях успешно добавлены в базу данных:"
//                 // );
//                 resolve();
//               }
//             });
//           });
//         } catch (error) {
//           console.error("Ошибка:", error);
//         }
//       }
//     }
//   }

//   insertData();
// }

// async function updateDataInTable(tableName, tableColumn, dataArr) {
//   try {
//     const table = `SELECT * FROM ${tableName}`;

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

//     if (dataStr.length !== dataArrStr.length) {
//       await addMissingElements(dataArr, data, tableName, tableColumn);
//     }

//     await Promise.all(
//       dataArr.map(async (rowData) => {
//         const updatePromises = tableColumn.map(async (col, index) => {
//           const updateTable = `UPDATE ${tableName} SET ${col} = ? WHERE ${tableColumn[0]} = ?`;
//           const params = [rowData[index], rowData[0]];

//           await new Promise((resolve, reject) => {
//             db.query(updateTable, params, (error, results) => {
//               if (error) {
//                 console.error("Ошибка при выполнении запроса:", error);
//                 reject(error);
//               } else {
//                 resolve(results);
//               }
//             });
//           });
//         });
//         await Promise.all(updatePromises);
//       })
//     );
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

// module.exports = updateDataInTable;

const db = require("../module/db");
const _ = require("lodash");

// async function addMissingElements(dataArr, data, tableName, tableColumns) {
//   const existingData = new Set(data.map((item) => JSON.stringify(item.sort())));
//   const newData = dataArr.filter(
//     (item) => !existingData.has(JSON.stringify(item.sort()))
//   );

//   for (const item of newData) {
//     const query = `INSERT INTO ${tableName} (${tableColumns.join(
//       ","
//     )}) VALUES ?`;
//     try {
//       await new Promise((resolve, reject) => {
//         db.query(query, [[item]], (err, result) => {
//           if (err) {
//             console.error("Ошибка при вставке данных в базу:", err);
//             reject(err);
//           } else {
//             resolve();
//           }
//         });
//       });
//     } catch (error) {
//       console.error("Ошибка при добавлении новых данных:", error);
//     }
//   }
// }

async function addMissingElements(dataArr, data, tableName, tableColumns) {
  const existingData = new Set(data.map((item) => JSON.stringify(item.sort())));
  const newData = dataArr.filter(
    (item) => !existingData.has(JSON.stringify(item.sort()))
  );

  for (const item of newData) {
    const query = `INSERT INTO ${tableName} (${tableColumns.join(
      ","
    )}) VALUES ?`;
    // console.log("Trying to insert:", item); // Вивід в консоль даних для вставки
    try {
      // await new Promise((resolve, reject) => {
      //   db.query(query, [[item]], (err, result) => {
      //     if (err) {
      //       console.error("Ошибка при вставке данных в базу:", err);
      //       reject(err);
      //     } else {
      //       resolve();
      //     }
      //   });
      // });
    } catch (error) {
      console.error("Ошибка при добавлении новых данных:", error);
    }
  }
}

async function updateDataInTable(tableName, tableColumns, dataArr) {
  const query = `SELECT ${tableColumns.join(", ")} FROM ${tableName}`;
  try {
    const existingData = await new Promise((resolve, reject) => {
      db.query(query, (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const existingDataFormatted = existingData.map((row) =>
      tableColumns.map((col) => row[col])
    );
    await addMissingElements(
      dataArr,
      existingDataFormatted,
      tableName,
      tableColumns
    );

    // for (const rowData of dataArr) {
    //   const updatePromises = tableColumns.map(async (col, index) => {
    //     const updateQuery = `UPDATE ${tableName} SET ${col} = ? WHERE ${tableColumns[0]} = ?`;
    //     console.log(
    //       "Updating:",
    //       col,
    //       "with value:",
    //       rowData[index],
    //       "where",
    //       tableColumns[0],
    //       "=",
    //       rowData[0]
    //     ); // Логування оновлень
    //     await new Promise((resolve, reject) => {
    //       db.query(
    //         updateQuery,
    //         [rowData[index], rowData[0]],
    //         (error, results) => {
    //           if (error) {
    //             console.error("Ошибка при обновлении данных:", error);
    //             reject(error);
    //           } else {
    //             resolve();
    //           }
    //         }
    //       );
    //     });
    //   });

    //   await Promise.all(updatePromises);
    // }
  } catch (error) {
    console.error("Ошибка при обработке данных:", error);
  }
}

// async function updateDataInTable(tableName, tableColumns, dataArr) {
//   const query = `SELECT ${tableColumns.join(", ")} FROM ${tableName}`;
//   try {
//     const existingData = await new Promise((resolve, reject) => {
//       db.query(query, (error, results) => {
//         if (error) {
//           console.error("Ошибка при выполнении запроса:", error);
//           reject(error);
//         } else {
//           resolve(results);
//         }
//       });
//     });

//     const existingDataFormatted = existingData.map((row) =>
//       tableColumns.map((col) => row[col])
//     );
//     await addMissingElements(
//       dataArr,
//       existingDataFormatted,
//       tableName,
//       tableColumns
//     );

//     for (const rowData of dataArr) {
//       const updatePromises = tableColumns.map(async (col, index) => {
//         const updateQuery = `UPDATE ${tableName} SET ${col} = ? WHERE ${tableColumns[0]} = ?`;
//         await new Promise((resolve, reject) => {
//           db.query(
//             updateQuery,
//             [rowData[index], rowData[0]],
//             (error, results) => {
//               if (error) {
//                 console.error("Ошибка при обновлении данных:", error);
//                 reject(error);
//               } else {
//                 resolve();
//               }
//             }
//           );
//         });
//       });

//       await Promise.all(updatePromises);
//     }
//   } catch (error) {
//     console.error("Ошибка при обработке данных:", error);
//   }
// }

module.exports = updateDataInTable;
