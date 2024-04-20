// const { Router } = require("express");
// const router = Router();
// const axios = require("axios");
// const xml2js = require("xml2js");

// const { updateDataInTable, test } = require("../module/updatePartialTableData");

// const parser = new xml2js.Parser({ explicitArray: false });

// router.put("/", async (req, res) => {
//   try {
//     //получвю данные с загрузочной ссылки
//     const response = await axios.get(
//       "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
//     );

//     //конвертирую данные
//     parser.parseString(response.data, (err, result) => {
//       if (err) {
//         res.status(500).json({ message: "Ошибка при парсинге XML" });
//       } else {
//         //из данных забираю нужные переменые

//         const { offers } = result.yml_catalog.shop;

//         const product = [];
//         const probuctsByData = [];
//         const param = [];
//         const pictures = [];

//         // обработка товаров
//         offers.offer.forEach((el) => {
//           if (el.param) {
//             for (let i = 0; i < el.param.length; i++) {
//               param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
//             }
//           }

//           if (el.picture) {
//             for (let i = 0; i < el.picture.length; i++) {
//               pictures.push([el.$.id, el.picture[0]]);
//             }
//           }

//           product.push([
//             el.$.id,
//             // el.categoryId,
//             el.description.replace(/\n/g, ""),
//             el.name,
//             el.price,
//             // el.$.available,
//           ]); // Добавляем элементы product
//         });

//         //вызов функций для обновления данных
//         // updateTableDate("category", ["id", "category_name"], categoryProd);

//         // updateTableDate(
//         //   "sub_category",
//         //   ["sub_category_id", "parent_id", "sub_category_name"],
//         //   subCategories
//         // );

//         console.log("rout", test);
//         updateDataInTable(
//           "products",
//           ["product_id", "product_description", "product_name", "price"],
//           product
//         );

//         // Отправка ответа клиенту
//         res.status(200).json({
//           message: "Данные успешно обновлены",
//           product,
//           test,
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Ошибка при получении данных из API:", error);
//     res.status(500).json({ message: "Ошибка при получении данных из API" });
//   }
// });

// module.exports = router;

//======== = = ====== ========================= ========     ==========

// const { Router } = require("express");
// const router = Router();
// const axios = require("axios");
// const xml2js = require("xml2js");
// const db = require("../module/db");
// const { updateDataInTable } = require("../module/updatePartialTableData");

// const parser = new xml2js.Parser({ explicitArray: false });
// let dataTable = null;

// //получаю данные из таблицы мое db
// async function getTableData(tableName, tableColumn) {
//   try {
//     const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`;

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

//     return (dataTable = data.map((row) => JSON.stringify(row)).sort());

//     // const dataArrStr = dataArr.map((row) => JSON.stringify(row)).sort();
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

// console.log("test", dataTable);

// router.put("/", async (req, res) => {
//   try {
//     // Получаем данные с загрузочной ссылки
//     const response = await axios.get(
//       "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
//     );

//     // Конвертируем данные
//     parser.parseString(response.data, async (err, result) => {
//       if (err) {
//         res.status(500).json({ message: "Ошибка при парсинге XML" });
//       } else {
//         // Извлекаем нужные переменные из данных
//         const { offers } = result.yml_catalog.shop;
//         const product = [];
//         const param = [];
//         const pictures = [];

//         // Обработка товаров
//         offers.offer.forEach((el) => {
//           if (el.param) {
//             for (let i = 0; i < el.param.length; i++) {
//               param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
//             }
//           }

//           if (el.picture) {
//             for (let i = 0; i < el.picture.length; i++) {
//               pictures.push([el.$.id, el.picture[0]]);
//             }
//           }

//           product.push([
//             el.$.id,
//             el.description.replace(/\n/g, ""),
//             el.name,
//             el.price,
//           ]); // Добавляем элементы product
//         });

//         // Получаем текущие данные из таблицы
//         const data = await getTableData("products", [
//           "product_id",
//           "product_description",
//           "product_name",
//           "price",
//         ]);

//         await updateDataInTable(
//           "products",
//           ["product_id", "product_description", "product_name", "price"],
//           product,
//           data
//         );

//         //преобразовую данные в строки и сортирую
//         const productsByData = data.map((row) => JSON.stringify(row)).sort();
//         const dataLink = product.map((row) => JSON.stringify(row)).sort();

//         //если массивы разной длины редирект на роут с добаленем нового елемента
//         if (productsByData.length !== dataLink.length) {
//           console.log("не раверн");
//           res.redirect("http://localhost:8000/api/update-data");
//         } else {
//           // Отправляем ответ клиенту
//           res.status(200).json({
//             message: "Данные успешно обновлены",
//             product,
//           });
//         }
//       }
//     });
//   } catch (error) {
//     console.error("Ошибка при получении данных из API:", error);
//     res.status(500).json({ message: "Ошибка при получении данных из API" });
//   }
// });

// module.exports = router;

//-----------------------------------------------------------------------

// const { Router } = require("express");
// const router = Router();
// const axios = require("axios");
// const xml2js = require("xml2js");
// const util = require("util");
// const db = require("../module/db");
// const parser = new xml2js.Parser({ explicitArray: false });
// const parseStringPromise = util.promisify(parser.parseString);

// // Отримуємо дані з таблиці бази даних
// async function getTableData(tableName, tableColumn) {
//   try {
//     const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`;

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

//     return data;
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

// //отримуємо данні з посилання
// async function getLinkDate() {
//   try {
//     const response = await axios.get(
//       "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
//     );
//     const result = await parseStringPromise(response.data);
//     const { offers } = result.yml_catalog.shop;
//     const product = [];
//     const param = [];
//     const pictures = [];

//     offers.offer.forEach((el) => {
//       if (el.param) {
//         for (let i = 0; i < el.param.length; i++) {
//           param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
//         }
//       }

//       if (el.picture) {
//         for (let i = 0; i < el.picture.length; i++) {
//           pictures.push([el.$.id, el.picture[i]]);
//         }
//       }

//       product.push([
//         el.$.id,
//         el.description.replace(/\n/g, ""),
//         el.name,
//         el.price,
//       ]);
//     });

//     return {
//       product: product.sort(),
//       pictures: pictures.sort(),
//       param: param.sort(),
//     };
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса или парсинге XML:", error);
//     throw error; // Кидаємо помилку для подальшої обробки
//   }
// }

// // Маршрут для оновлення даних
// router.put("/", async (req, res) => {
//   try {
//     const data = await getTableData("products", [
//       "product_id",
//       "product_description",
//       "product_name",
//       "price",
//     ]);

//     const linkData = await getLinkDate();
//     res.json({ data, linkData }); // Відправляємо дані у відповідь
//   } catch (error) {
//     res.status(500).json({ message: "Виникла помилка", error: error.message });
//   }
// });

// module.exports = router;

// фффффыфыыбьвфыьвыавымьвыаьбмавьмавьбм

const { Router } = require("express");
const router = Router();
const axios = require("axios");
const xml2js = require("xml2js");
const util = require("util");
const db = require("../module/db");
const parser = new xml2js.Parser({ explicitArray: false });
const parseStringPromise = util.promisify(parser.parseString);
const _ = require("lodash");
const addDataToTable = require("../module/addDataToTable");

// async function getTableData(tableName, tableColumn) {
//   try {
//     const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`;

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

//     return data;
//   } catch (error) {
//     console.error("Ошибка при выполнении запроса:", error);
//   }
// }

async function getTableData(tableName, tableColumn) {
  try {
    const table = `SELECT ${tableColumn.join(", ")} FROM ${tableName}`;

    const data = await new Promise((resolve, reject) => {
      db.query(table, (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
          reject(error);
        } else {
          resolve(
            results.map((row) =>
              tableColumn.map(
                (col) => String(row[col]).replace(/\n/g, "") // Преобразование в строку и удаление переводов строк
              )
            )
          );
        }
      });
    });

    return data;
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
  }
}

async function updateProduct(product) {
  try {
    const query = `UPDATE products SET product_description = ?, product_name = ?, price = ? WHERE product_id = ?`;
    const values = [
      product.description,
      product.name,
      product.price,
      product.id,
    ];
    await db.query(query, values);
    console.log(`Product updated: ${product.id}`);
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
  }
}

function compareArrays(array1, array2) {
  // Перевірка на рівність масивів

  const newArray1 = array1.map((el) => {
    return el.map((supEl) => {
      return String(supEl);
    });
  });

  const newArray2 = array2.map((el) => {
    return el.map((supEl) => {
      return String(supEl);
    });
  });

  // const arraysAreEqual = _.isEqual(newArray1, newArray2);
  const arraysAreEqual = newArray1.forEach((el, i) => {
    // console.log(_.isEqual(el, newArray2[i]));
    console.log("равны ", JSON.stringify(el) === JSON.stringify(newArray2[i]));
  });
  console.log("Масиви однакові:", arraysAreEqual);

  // Знаходження відсутніх елементів
  const missingFromArray1 = _.difference(newArray1, newArray2);
  const missingFromArray2 = _.difference(newArray1, newArray2);

  // console.log("djkdj", missingFromArray1);
  // console.log("aaaaaa", missingFromArray2);

  return {
    arraysAreEqual,
    missingFromArray1,
    missingFromArray2,
  };
}

async function syncProducts(data, linkData) {
  console.log("Синхронізація продуктів...");
  console.log(`Кількість даних з бази: ${data.length}`);
  console.log(`Кількість даних з XML: ${linkData.length}`);

  console.log("data", data);
  console.log("link", linkData);

  const updates = [];

  linkData.forEach((product) => {
    // Знайдіть відповідний продукт у базі даних, перевіряючи product_id проти id
    const productData = data.find((p) => p[0] === product.id);
    if (productData) {
      let needUpdate = false;
      // Перевірка імені, опису і ціни
      if (productData[2] !== product.name) {
        console.log(`Зміна назви для продукту ID: ${product.id}`);
        needUpdate = true;
      }
      if (productData[1] !== product.description) {
        console.log(`Зміна опису для продукту ID: ${product.id}`);
        needUpdate = true;
      }
      if (+productData[3] !== +product.price) {
        // Перетворення строк в числа для порівняння цін
        console.log(`Зміна ціни для продукту ID: ${product.id}`);
        needUpdate = true;
      }
      if (needUpdate) {
        updates.push(updateProduct(product));
      }
    } else {
      console.log(
        `Продукт ID: ${product.id} не знайдено в базі, потрібне додавання.`
      );
      updates.push(addNewProduct(product)); // Припускаючи, що у вас є така функція
    }
  });

  if (updates.length > 0) {
    await Promise.all(updates);
    console.log(`Оновлено/Додано продуктів: ${updates.length}`);
  } else {
    console.log("Немає продуктів для оновлення або додавання.");
  }
}

// //отримуємо данні з посилання
async function getLinkData() {
  try {
    const response = await axios.get(
      "https://procraft.ua/ua/index.php?route=extension/feed/unixml/Market_plase"
    );
    const result = await parseStringPromise(response.data);
    const { offers } = result.yml_catalog.shop;
    const product = [];
    const param = [];
    const pictures = [];

    // START
    offers.offer.forEach((x) => {
      // ТУТ МИ ШУКАЄМО ЧИ Є ТАКИЙ ТОВАР
      const query = `SELECT * FROM products WHERE product_name = '${x.name}'`;

      db.query(query, (error, results) => {
        if (error) {
          console.error("Ошибка при выполнении запроса:", error);
          console.log("->>> REJECT", error);
        } else {
          if (results.length > 0) {
            // Кейс якщо такий товар вже є, то ми перевіряємо його поля, якщо треба оновити оновлюємо, якщо ні - ігноруємо
            const receivedProduct = results[0];

            if (
              receivedProduct.name === x.name &&
              receivedProduct.price == x.price
            ) {
              const query = `UPDATE products SET product_name = "${x.name}",  price = "${x.price}"  WHERE product_id = "${receivedProduct.id}"`;
              db.query(query, (error, results) => {
                if (error) {
                  console.error("Ошибка при выполнении запроса:");
                  // console.log("->>> REJECT", error);
                } else {
                  console.log(
                    "->>> PRODUCT WAS SUCCESSFULLY UPDATED: id - " +
                      receivedProduct.id
                  );
                }
              });
            }
          } else {
            // Кейс якщо немає такого товару - тоді створюємо новий запис
            console.log("X.ID", x.$.id);
            console.log("X.NAME", x.name);
            console.log("X.PRICE", x.price);

            // Треба записати нові данні в таблицю
            const query = `INSERT INTO products (product_id, product_name, price, available) VALUES (?, ?, ?, ?)`;

            db.query(query, [x.$.id, x.name, x.price, "true"], (error) => {
              if (error) {
                console.error("ОШИБКА", error.message);
              } else {
                console.log(
                  "->>> PRODUCT WAS SUCCESSFULLY INSERTED: id - " + x.$.id
                );
              }
            });
          }
        }
      });
    });
    // END

    // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

    offers.offer.forEach((el) => {
      if (el.param) {
        for (let i = 0; i < el.param.length; i++) {
          param.push([el.$.id, el.param[i].$.name, el.param[i]._]);
        }
      }

      if (el.picture) {
        for (let i = 0; i < el.picture.length; i++) {
          pictures.push([el.$.id, el.picture[i]]);
        }
      }

      product.push([
        el.$.id,
        el.description.replace(/\n/g, ""),
        el.name,
        el.price,
      ]);
    });

    return {
      product: product.sort(),
      pictures: pictures.sort(),
      param: param.sort(),
    };
  } catch (error) {
    console.error("Ошибка при выполнении запроса или парсинге XML:", error);
    throw error; // Кидаємо помилку для подальшої обробки
  }
}

router.put("/", async (req, res) => {
  try {
    const tableColumns = [
      "product_id",
      "product_description",
      "product_name",
      "price",
    ];
    const data = await getTableData("products", tableColumns);

    const linkData = await getLinkData();

    // console.log("data", data);
    // console.log("linkData", linkData.product);

    // compareArrays(data, linkData.product);

    // await syncProducts(data, linkData.product);
    res.json({ message: "Data synchronized" });
  } catch (error) {
    res.status(500).json({ message: "Виникла помилка", error: error.message });
  }
});

module.exports = router;
