const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
const query = (text, params) => pool.query(text, params);
pool.connect((err) => {
  if (err) {
    console.error("Database connection failed!", err);
  } else {
    console.log("Connected to the database!");
  }
});

module.exports = {
  query,
  pool,
};
