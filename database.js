const Sequelize = require("sequelize");
const sequelize = new Sequelize("userDB", "postgres", "asdqwe1234", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = { sequelize, testDatabaseConnection };
