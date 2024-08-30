const { Router } = require("express");
const router = Router();
const Sequelize = require("sequelize"); // Базовий імпорт Sequelize
const { Op } = Sequelize; // Якщо ви використовуєте оператори Sequelize
const {
  products: Product,
  review: Review,
  pictures: Pictures,
  parameter: Parameter,
  reviewResponses: ReviewResponse,
  category: Category,
  subCategory: SubCategory,
} = require("../db");

router.get("/search", async (req, res) => {
  try {
    const query = req.query.search;

    const products = await Product.findAll({
      where: {
        product_name: {
          [Op.like]: "%" + query + "%",
        },
      },
      limit: 5,
      include: [
        {
          model: Pictures,
          as: "pictures",
        },
        {
          model: Parameter,
          as: "param",
        },
        {
          model: Review,
          as: "review",
          include: [
            {
              model: ReviewResponse,
              as: "reviewResponses",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Продукти знайдено успішно",
      products: products,
    });
  } catch (error) {
    console.error("Ошибка при поиске продуктов:", error);
    res.status(500).json({ message: "Ошибка при поиске продуктов" });
  }
});

//категории
router.get("/category", async (req, res) => {
  try {
    const category = await Category.findAll();
    const subCategory = await SubCategory.findAll();

    res.status(200).json({
      message: "категорії товару отримано",
      category: category,
      subCategory: subCategory,
    });
  } catch (error) {
    console.log(Feedback);
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.get("/category/:category_id", async (req, res) => {
  try {
    const subCategory = await SubCategory.findAll({
      where: {
        parent_id: req.params.category_id,
      },
    });

    res.status(200).json({
      message: `підкатегорія ${req.params.category_id}`,

      subCategory: subCategory,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

//под категория
router.get("/category/:sub_category", async (req, res) => {
  try {
    const subCategory = await SubCategory.findAll({
      where: {
        sub_category_id: req.params.sub_category,
      },
    });

    res.status(200).json({
      message: `підкатегорія ${req.params.sub_category}`,

      subCategory: subCategory,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.put("/category/:sub_category/update", async (req, res) => {
  const { path } = req.body;
  try {
    const subCategory = await SubCategory.update(
      {
        pictures: path,
      },

      {
        where: { sub_category_id: req.params.sub_category },
      }
    );

    res.status(200).json({
      message: `обкладенку успішно змінено ${req.params.sub_category}`,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.delete("/category/:sub_category/delete", async (req, res) => {
  try {
    const subCategory = await SubCategory.destroy({
      where: { sub_category_id: req.params.sub_category },
    });

    res.status(200).json({
      message: `категорію успішно видалено ${req.params.sub_category}`,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

// все товары и отзывы
router.get("/:sub_category_id", async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { sub_category_id: req.params.sub_category_id },
      include: [
        {
          model: Pictures,
          as: "pictures",
        },
        {
          model: Parameter,
          as: "param",
        },
        {
          model: Review,
          as: "review",
          include: [
            {
              model: ReviewResponse,
              as: "reviewResponses",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "продукты",
      products: products,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.get("/:id/review", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const reviews = await Review.findAndCountAll({
      where: { product_id: req.params.id },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: `Це відгуки продукта id ${req.params.id}`,
      reviews: reviews.rows,
      total: reviews.count,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(reviews.count / limit),
    });
  } catch (error) {
    console.error("Помилка при отриманні даних:", error);
    res.status(500).json({ message: "Помилка при отриманні даних" });
  }
});

router.get("/:id/review/:reviewId/responses", async (req, res) => {
  try {
    const all = req.query.all === "true";
    const limit = all ? undefined : 1; // Якщо запит на всі дані, не обмежуємо кількість записів
    const offset = all ? undefined : parseInt(req.query.offset) || 0;

    // Використання findAndCountAll для отримання як даних, так і загальної кількості
    const { count, rows } = await ReviewResponse.findAndCountAll({
      where: { review_id: req.params.reviewId },
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      message: `Это отзывы продукта id ${req.params.id}`,
      totalResponses: count,
      reviewResponse: rows,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

//один товар и отзыв о нем
router.get("/:sub_category_id/:id", async (req, res) => {
  try {
    const product = await Product.findAll({
      where: { product_id: req.params.id },
      include: [
        {
          model: Pictures,
          as: "pictures",
        },
        {
          model: Parameter,
          as: "param",
        },
        {
          model: Review,
          as: "review",
          include: [
            {
              model: ReviewResponse,
              as: "reviewResponses",
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: `продукт с id ${req.params.id}`,
      product: product,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

//cоздаем один товар не из загрузочной ссылки
router.post("/add", async (req, res) => {
  try {
    const addProduct = await Product.create({
      product_id: req.body.id,
      sub_category_id: req.body.sub_category_id,
      product_description: req.body.product_description,
      product_name: req.body.product_name,
      price: req.body.price,
      available: req.body.available,
    });

    //картинки к кастамному товару
    const picturesData = (
      Array.isArray(req.body.pictures) ? req.body.pictures : [req.body.pictures]
    ).map((picture) => ({
      product_id: req.body.id,
      pictures_name: picture,
    }));
    await Pictures.bulkCreate(picturesData);

    //параметры к кастамному товару
    const parameterData = (
      Array.isArray(req.body.parameters)
        ? req.body.parameters
        : [req.body.parameters]
    ).map((param) => ({
      product_id: req.body.id,
      parameter_name: param.name,
      parameter_value: param.value,
    }));
    await Parameter.bulkCreate(parameterData);

    res.status(200).json({
      message: "товар успешно добавлен",
    });
  } catch (error) {
    console.error("Ошибка при добаление товара:", error);
    res.status(500).json({ message: "Ошибка при добаление товара" });
  }
});

//конструктор для создания отзыва и ответа на отзыв
async function createFeedback(
  id,
  nikname,
  comment,
  rating,
  tableName,
  isAdmin,
  column_id
) {
  try {
    const newFeedback = await tableName.create({
      [column_id]: id,
      user_name: nikname,
      comment: comment,
      rating: rating,
      admin_response: isAdmin,
    });
    console.log("Відгук успішно створений:", newFeedback);
  } catch (error) {
    console.error("Помилка при створенні відгуку:", error);
  }
}

//оставить отзыв об одном товаре
router.post("/:id/review", async (req, res) => {
  try {
    await createFeedback(
      req.params.id,
      req.body.nikname,
      req.body.review,
      req.body.rating,
      Review,
      null,
      "product_id"
    );
    res.status(200).json({
      message: "отзыв успешно добавлен",
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.post("/:id/review/:reviewId/responses", async (req, res) => {
  console.log("id", req.params.reviewId);
  try {
    if (req.body.nikname === "saw store") {
      await createFeedback(
        req.params.reviewId,
        req.body.nikname,
        req.body.review,
        null,
        ReviewResponse,
        1,
        "review_id"
      );
    } else {
      await createFeedback(
        req.params.reviewId,
        req.body.nikname,
        req.body.review,
        null,
        ReviewResponse,
        0,
        "review_id"
      );
    }
    res.status(200).json({
      message: "отзыв успешно добавлен",
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
