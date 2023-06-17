require('dotenv').config();
// this is important!
module.exports = {
  development: {
    username: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    host: process.env.DB_MYSQL_HOST,
    dialect: 'mysql',
    timezone: process.env.TIME_ZONE,
  },
  production: {
    username: process.env.DB_MYSQL_USERNAME,
    password: process.env.DB_MYSQL_PASSWORD,
    database: process.env.DB_MYSQL_DATABASE,
    host: process.env.DB_MYSQL_HOST,
    dialect: 'mysql',
    timezone: process.env.TIME_ZONE,
  },
};
