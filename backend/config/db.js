const mysql = require('mysql2/promise');
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQL_URL_PUBLIC;

const connectionConfig = databaseUrl || {
  host: process.env.DB_HOST || process.env.MYSQLHOST || process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306),
  user: process.env.DB_USER || process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'hepatitis_system',
};

const pool = mysql.createPool({
  uri: typeof connectionConfig === 'string' ? connectionConfig : undefined,
  ...(typeof connectionConfig === 'string' ? {} : connectionConfig),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
