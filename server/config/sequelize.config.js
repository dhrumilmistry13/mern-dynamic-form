require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_MYSQL_DATABASE,
  process.env.DB_MYSQL_USERNAME,
  process.env.DB_MYSQL_PASSWORD,
  {
    dialect: 'mysql',
    port: process.env.DB_MYSQL_PORT,
    host: process.env.DB_MYSQL_HOST,
    timezone: process.env.TIME_ZONE,
    logging: console.log,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log('MySQL DB Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
