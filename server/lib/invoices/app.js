const express = require('express');
const app = module.exports = express();     // Accessible from server/app.js
const mysql = require('mysql');

// MySQL
// Create database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "the_cookie_artist",
  });

app.get("/invoices", (req, res) => {
    let sql =
      "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.send("Posts table created");
    });
  });