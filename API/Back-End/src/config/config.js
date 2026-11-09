function obterJwtSecret() {
  const segredo = process.env.JWT_SECRET;
  if (!segredo || !segredo.trim()) {
    throw new Error(
      "JWT_SECRET não definido. Preencha a variável no arquivo .env (veja .env.example).",
    );
  }
  return segredo;
}

require("dotenv").config();

module.exports = {
  obterJwtSecret,
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "radar_ufla",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME_TEST || "radar_ufla_test",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },
};
