const { Router } = require("express");
const { Sequelize } = require("sequelize");
const { order: Order, orderItem: OrderItems, order } = require("../db");
const router = Router();

router.post("/add-order", async (req, res) => {
  const {
    order_id,
    name,
    secondName,
    phone,
    payment,
    city,
    warehouses,
    totalPrice,
    orders,
    courierDeliveryAddress,
    qwery,
  } = req.body;

  try {
    const order = await Order.create({
      order_id: order_id,
      name: name,
      second_name: secondName,
      phone: phone,
      payment_method: payment,
      city: city,
      postal_office: warehouses,
      total_price: totalPrice,
      courier_delivery_address: courierDeliveryAddress,
      qwery: qwery,
    });

    for (const item of orders) {
      await OrderItems.create({
        order_id: order_id,
        order_name: item.orderName,
        count: item.count,
        product_id: item.product_id,
        product_img: item.img,
        price: item.price,
        discount: item.discount,
        discounted_product: item.discountProduct,
      });
    }

    res.status(200).json({ message: "Замовлення успішно додано." });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.put("/change-status/:id", async (req, res) => {
  const { status } = req.query;
  try {
    const order = await Order.update(
      {
        status: status,
      },
      {
        where: {
          order_id: req.params.id,
        },
      }
    );

    res.status(200).json({ message: "Статус зміненно" });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.put("/delete/:parentId/:itemId", async (req, res) => {
  const { totalPrice } = req.query;
  try {
    const orderItem = await OrderItems.destroy({
      where: { item_id: req.params.itemId },
    });

    const order = await Order.update(
      {
        total_price: totalPrice,
      },

      {
        where: {
          order_id: req.params.parentId,
        },
      }
    );

    res.status(200).json({ message: "товар видаленно" });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const order = await Order.destroy({
      where: { order_id: req.params.id },
    });

    res.status(200).json({ message: "замовлення видаленно" });
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

router.get("/all-orders", async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const whereCondition = {};

    if (search.trim()) {
      whereCondition.phone = {
        [Sequelize.Op.like]: `%${search.trim()}%`,
      };
    }

    const orders = await Order.findAndCountAll({
      distinct: true,
      where: whereCondition,
      include: [
        {
          model: OrderItems,
          as: "orderItem",
        },
      ],

      offset: (page - 1) * limit,
      limit: limit,
      order: [["createdAt", "DESC"]],
    });

    if (orders.count === 0) {
      return res.status(200).json({
        message: "Нічого не знайдено в базі",
        notFound: true,
        orders: orders.rows,
        totalItems: orders.count,
        totalPages: Math.ceil(orders.count / limit),
        currentPage: parseInt(page),
      });
    }

    res.status(200).json({
      message: "Заказы",
      orders: orders.rows,
      totalItems: orders.count,
      totalPages: Math.ceil(orders.count / limit),
      currentPage: parseInt(page),
      notFound: false,
    });
  } catch (error) {
    console.error("Ошибка при получение:", error);
    res.status(500).json({ message: "Ошибка при обновлении данных" });
  }
});

module.exports = router;
