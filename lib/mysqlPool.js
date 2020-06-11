const mysql = require('mysql2/promise');

const mysqlPool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST || '10.0.0.4',
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE || "tarpaulin",
  user: process.env.MYSQL_USER || "app",
  password: process.env.MYSQL_PASSWORD || "hunter2"
});

module.exports = mysqlPool;
