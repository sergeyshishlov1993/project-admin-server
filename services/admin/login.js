// const { Router } = require("express");
// const router = Router();
// const bcrypt = require("bcryptjs");
// const {
//   generateAccessToken,
//   generateRefreshToken,
// } = require("../../auth/tokenService");
// const { admin: Admin } = require("../../db");

// // Функція для додавання адміністратора
// const addAdmin = async (username, password) => {
//   try {
//     const hash = await bcrypt.hash(password, 10);
//     const admin = await Admin.create({
//       name: username,
//       password: hash,
//     });
//     console.log("Admin added", admin.id);
//   } catch (err) {
//     console.error("Error adding admin:", err);
//   }
// };

// // Роут для створення нового адміністратора
// router.post("/add-admin", async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     await addAdmin(username, password);
//     res.status(200).json({ message: "Адміністратор доданий успішно." });
//   } catch (error) {
//     console.error("Ошибка при додаванні адміністратора:", error);
//     res.status(500).json({ message: "Ошибка при додаванні адміністратора" });
//   }
// });

// // Основний роутер для тестування
// // router.post("/", async (req, res) => {
// //   const { username, password } = req.body;
// //   try {
// //     const admins = await Admin.findAll();

// //     const user = admins.find((u) => u.name === username);
// //     const isMatch = await bcrypt.compare(password, user.password);

// //     if (!user) {
// //       return res.status(401).send("User not found");
// //     }

// //     if (!isMatch) {
// //       return res.status(401).send("Password is incorrect");
// //     }

// //     res.status(200).json({
// //       message: "Admin data retrieved successfully",
// //       admin: admins,
// //     });
// //   } catch (error) {
// //     console.error("Ошибка при получении данных администратора:", error);
// //     res.status(500).send("Ошибка при получении данных администратора");
// //   }
// // });

// // ---------------------------------------
// const fs = require("fs");
// const path = require("path");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const cron = require("node-cron");

// function generateSecret() {
//   return crypto.randomBytes(64).toString("hex");
// }

// function updateEnv() {
//   const newAccessTokenSecret = generateSecret();
//   const newRefreshTokenSecret = generateSecret();

//   const envPath = path.join(__dirname, ".env");
//   const envConfig = dotenv.parse(fs.readFileSync(envPath));

//   envConfig.ACCESS_TOKEN_SECRET = newAccessTokenSecret;
//   envConfig.REFRESH_TOKEN_SECRET = newRefreshTokenSecret;

//   let newEnvContent = "";
//   for (const key in envConfig) {
//     newEnvContent += `${key}=${envConfig[key]}\n`;
//   }

//   fs.writeFileSync(envPath, newEnvContent);
//   console.log("Environment variables updated!");
// }

// // Запуск ротації секретів щомісяця
// cron.schedule("0 0 1 * *", () => {
//   updateEnv();
// });

// // ---------------------------------------

// router.post("/", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const admins = await Admin.findAll();
//     const user = admins.find((u) => u.name === username);

//     if (!user) {
//       return res.status(401).send("User not found");
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).send("Password is incorrect");
//     }

//     // Генерація токенів
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user);

//     res.status(200).json({
//       message: "Admin data retrieved successfully",
//       accessToken,
//       refreshToken,
//       admin: admins,
//     });
//   } catch (error) {
//     console.error("Ошибка при получении данных администратора:", error);
//     res.status(500).send("Ошибка при получении данных администратора");
//   }
// });

// router.post("/token", (req, res) => {
//   const { token } = req.body;
//   if (!refreshTokens.includes(token)) {
//     return res.sendStatus(403);
//   }
//   jwt.verify(token, refreshTokenSecret, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const newToken = generateAccessToken({ name: user.name, role: user.role });
//     res.json({ accessToken: newToken });
//   });
// });

// router.post("/logout", (req, res) => {
//   const { token } = req.body;
//   refreshTokens = refreshTokens.filter((t) => t !== token);
//   res.send("Logout successful");
// });

// module.exports = router;

const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../auth/tokenService");
const { admin: Admin } = require("../../db");
const jwt = require("jsonwebtoken");

// Функція для додавання адміністратора
const addAdmin = async (username, password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      name: username,
      password: hash,
    });
    console.log("Admin added", admin.id);
  } catch (err) {
    console.error("Error adding admin:", err);
  }
};

// Роут для створення нового адміністратора
router.post("/add-admin", async (req, res) => {
  const { username, password } = req.body;

  try {
    await addAdmin(username, password);
    res.status(200).json({ message: "Адміністратор доданий успішно." });
  } catch (error) {
    console.error("Ошибка при додаванні адміністратора:", error);
    res.status(500).json({ message: "Ошибка при додаванні адміністратора" });
  }
});

// Роут для аутентифікації
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admins = await Admin.findAll();
    const user = admins.find((u) => u.name === username);

    if (!user) {
      return res.status(401).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send("Password is incorrect");
    }

    // Генерація токенів
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "Admin data retrieved successfully",
      accessToken,
      refreshToken,
      admin: user, // змінено з admins на user для більшої точності у відповіді
    });
  } catch (error) {
    console.error("Ошибка при получении данных администратора:", error);
    res.status(500).send("Ошибка при получении данных администратора");
  }
});

// Роут для оновлення токена
router.post("/token", (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }
  jwt.verify(token, refreshTokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
});

// Роут для виходу
router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.send("Logout successful");
});

module.exports = router;
