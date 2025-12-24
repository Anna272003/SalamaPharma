const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", 
  database: "pharmacie_app"
});

module.exports = db;
