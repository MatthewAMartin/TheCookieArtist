const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

// Import route libraries
const orders = require('./lib/orders/app.js');
const packages = require('./lib/packages/app.js');
const collections = require('./lib/collections/app.js');
const customers = require('./lib/customers/app.js');
const cookies = require('./lib/cookies/app.js');
const invoices = require('./lib/invoices/app.js');

// Initialise express and port
const app = express();
const port = process.env.PORT || 5000;

// Parsing Middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// MySQL
// Create database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Soyoung.2308",
  database: "the_cookie_artist",
});

// Import all route queries
app.use(cookies);
app.use(packages);
app.use(collections);
app.use(orders);
app.use(customers);
app.use(invoices);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
