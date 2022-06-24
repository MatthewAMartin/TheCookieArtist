const express = require("express");
const app = express.Router();
const mysql = require("mysql");
const formidable = require("formidable");
const fs = require("fs");
const randomstring = require("randomstring");

// Initialise the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Soyoung.2308",
  database: "the_cookie_artist",
});

// Get all cookies
app.get("/api/cookies", (req, res) => {
  // Define query string
  const sqlQuery = "SELECT * from cookie";

  // Query the database
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

// Get all active OR inactive cookies
// app.get("/api/cookies/status", (req, res) => {
//   const params = req.body;

//   let sqlQuery = "SELECT * from cookie WHERE active_status = ?";
//   db.query(sqlQuery, params.active_status, (err, result) => {
//     if (err) throw err;
//     if (result.length === 0) {
//       res.status(400).json({ msg: `No cookies with that active status.` });
//     } else {
//       res
//         .status(200)
//         .json({ msg: `Returned all cookies with that active status.`, result });
//     }
//   });
// });

// // Get a cookie with matching ID
// app.get("/api/cookies/:id", (req, res) => {
//   const params = req.body;

//   let sqlQuery = "SELECT * from cookie WHERE cookie_id = ?";
//   db.query(sqlQuery, params.cookie_id, (err, result) => {
//     if (err) throw err;
//     if (result.length === 0) {
//       res.status(400).json({ msg: `No cookie with id = ${params.cookie_id}.` });
//     } else {
//       res.status(200).json({
//         msg: `Returned cookie with id = ${params.cookie_id}.`,
//         result,
//       });
//     }
//   });
// });

// Get all image_urls related to a specific cookie_id
app.get("/api/cookies/images/:id", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT * from cookie_image WHERE cookie_id = ?";

  // Query the database
  db.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) throw err;
    // Check results for image_urls
    if (result.length === 0) {
      return res
        .status(200)
        .json({ msg: `No stored image urls for that cookie.`, result });
    } else {
      return res.status(200).json({
        msg: `Returned all stored image urls for that cookie.`,
        result,
      });
    }
  });
});

// Get cookie_id of most recently created record
app.get("/api/cookies/latest", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT LAST_INSERT_ID() as ID from cookie;";

  // Query the database
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.status(200).json({ data: result[0].ID });
  });
});

// Create a new cookie record
app.post("/api/cookies", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "INSERT into cookie SET ?";

  // Query the database
  db.query(sqlQuery, params, (err, result) => {
    if (err) throw err;
    res.status(200).json({ msg: `Added the "${params.name}" cookie.` });
  });
});

// Create new cookie_image records
app.post("/api/cookies/images", (req, res) => {
  // Store incoming form data
  const form = new formidable.IncomingForm();

  // Parse the incoming form data
  const parseData = form.parse(req, async function (err, fields, files) {
    if (err) throw err;

    // Store the cookie_id and image_url from the form data
    let cookieId = parseInt(fields.cookie_id);
    let imageURL = saveFile(files.file);

    // Construct the query parameters
    const params = { cookie_id: cookieId, image_url: imageURL };

    // Define the query string
    let sqlQuery = "INSERT into cookie_image SET ?";

    // Query the database
    db.query(sqlQuery, params, (err, result) => {
      if (err) throw err;
      res.status(200).json({ msg: `Saved file to: "${params.image_url}".` });
    });
  });
});

// Update an existing cookie record
app.put("/api/cookies", (req, res) => {
  // Destructure the request
  const { cookie_id, name, cost, active_status } = req.body;

  // Check if the cookie does exist
  // Define the query string
  let sqlQuery = "SELECT * from cookie WHERE cookie_id = ?";

  // Query the database
  db.query(sqlQuery, cookie_id, (err, result) => {
    if (err) throw err;
    // If the cookie doesn't exist, send err
    if (result.length === 0) {
      res.status(404).json({ msg: `No cookie with id = ${cookie_id}` });
    } else {
      // If the cookie does exist, update it

      // Redefine the query string
      sqlQuery =
        "UPDATE cookie SET name = ?, cost = ?, active_status = ? WHERE cookie_id = ?";

      // Query the database
      db.query(
        sqlQuery,
        [name, cost, active_status, cookie_id],
        (err, result) => {
          if (err) throw err;
          res.status(200).json({ msg: `Updated the "${name}" cookie.` });
        }
      );
    }
  });
});

// Delete a cookie record from the database
app.delete("/api/cookies", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "DELETE from cookie WHERE cookie_id = ?";

  // Query the database
  db.query(sqlQuery, params.cookie_id, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ msg: `Deleted cookie with id = ${params.cookie_id}.` });
  });
});

// Delete an image_url from cookie_image
app.delete("/api/cookies/images", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Delete the image file from file storage
  deleteFile(params.image_url);

  // Define the query string
  let sqlQuery = "DELETE from cookie_image WHERE image_url = ?";

  // Query the database
  db.query(sqlQuery, params.image_url, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ msg: `Removed ${req.params.url} from the database.`, result });
  });
});

/**
 * saveFile is used to store files in local file storage.
 *
 * @param {*} file The File object being saved.
 * @return {*} A string defining the file save path.
 */
const saveFile = (file) => {
  //Read the file data
  const data = fs.readFileSync(file.filepath);

  // Define file url parameters
  const filePath = "../client/public/images/uploads/cookies/";
  const fileName = randomstring.generate();
  // Set fileType
  let fileType = "";
  switch (file.mimetype) {
    case "image/jpeg":
      fileType = ".jpg";
      break;
    case "image/png":
      fileType = ".png";
      break;
    case "image/svg":
      fileType = ".svg";
      break;
    default:
      // Do nothing
      break;
  }
  // Create the file URL/Path
  const fileURL = `${filePath}${fileName}${fileType}`;

  // Store the file
  fs.writeFileSync(fileURL, data);

  // Stop file link
  fs.unlinkSync(file.filepath);

  // Return the file save path/url
  return `/images/uploads/cookies/${fileName}${fileType}`;
};

/**
 * deleteFile is used to delete files from local file storage.
 *
 * @param {*} file The File object being deleted.
 */
const deleteFile = (file) => {
  // Define the file's path
  const filePath = "../client/public";
  let tempPath = filePath + file;

  // Delete the file
  fs.unlink(tempPath, (err) => {
    if (err) throw err;
  });
};

module.exports = app;
