const express = require("express");
const app = express.Router();
const mysql = require("mysql");

// Initialise the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Soyoung.2308",
  database: "the_cookie_artist",
});

// Get all packages
app.get("/api/packages", (req, res) => {
  // Define query string
  const sqlQuery = "SELECT p.*, c.name from package p INNER JOIN cookie c ON c.cookie_id = p.cookie_id";

  // Query the database
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

// Get all packages (ordered by amount) related to a specific cookie_id
app.get("/api/packages/:cookie_id", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT * FROM package WHERE cookie_id = ? ORDER BY amount";

  // Query the database
  db.query(sqlQuery, [req.params.cookie_id], (err, result) => {
    if (err) throw err;
    // Check results for packages
    if (result.length === 0) {
      return res
        .status(200)
        .json({ msg: `No packages for that cookie.`, result });
    } else {
      return res.status(200).json({
        msg: `Returned all packages for that cookie.`,
        result,
      });
    }
  });
});

// Get package_id of most recently created record
// app.get("/api/packages/latest", (req, res) => {
//   // Define query string
//   let sqlQuery = "SELECT LAST_INSERT_ID() as ID from package;";

//   // Query the database
//   db.query(sqlQuery, (err, result) => {
//     if (err) throw err;
//     res.status(200).json({ data: result[0].ID });
//   });
// });

// Create a new package record
app.post("/api/packages", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "INSERT into package SET ?";

  // Query the database
  db.query(sqlQuery, params, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      msg: `Added a package for cookie_id: ${params.cookie_id} successfully.`,
    });
  });
});

// Update an existing package record
app.put("/api/packages", (req, res) => {
  // Destructure the request
  const { package_id, amount, cost, active_status } = req.body;

  // Check if the package does exist
  // Define the query string
  let sqlQuery = "SELECT * from package WHERE package_id = ?";

  // Query the database
  db.query(sqlQuery, package_id, (err, result) => {
    if (err) throw err;
    // If the cookie doesn't exist, send err
    if (result.length === 0) {
      res.status(404).json({ msg: `No package with id = ${package_id}.` });
    } else {
      // If the package does exist, update it

      // Redefine the query string
      sqlQuery =
        "UPDATE package SET amount = ?, cost = ?, active_status = ? WHERE package_id = ?";

      // Query the database
      db.query(
        sqlQuery,
        [amount, cost, active_status, package_id],
        (err, result) => {
          if (err) throw err;
          res.status(200).json({ msg: `Updated the package successfully.` });
        }
      );
    }
  });
});

// Delete a package record from the database
app.delete("/api/packages", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "DELETE from package WHERE package_id = ?";

  // Query the database
  db.query(sqlQuery, params.package_id, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ msg: `Deleted package with id = ${params.package_id}.` });
  });
});

module.exports = app;
