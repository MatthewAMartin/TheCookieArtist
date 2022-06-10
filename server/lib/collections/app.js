const express = require("express");
const app = express.Router();
const mysql = require("mysql");

// Initialise the database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "the_cookie_artist",
});

// Get all collections
app.get("/api/collections", (req, res) => {
  // Define query string
  const sqlQuery = "SELECT * from collection";

  // Query the database
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.status(200).json(result);
  });
});

// Get collection_id of most recently created record
app.get("/api/collections/latest", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT LAST_INSERT_ID() as ID from collection;";

  // Query the database
  db.query(sqlQuery, (err, result) => {
    if (err) throw err;
    res.status(200).json({ data: result[0].ID });
  });
});

// Get all collection_cookie records related to a specific collection_id
app.get("/api/collections/cookies/:id", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT * from collection_cookie WHERE collection_id = ?";

  // Query the database
  db.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) throw err;
    // Check results for cookie_ids
    if (result.length === 0) {
      return res
        .status(200)
        .json({ msg: `No cookies added to that collection.`, result });
    } else {
      return res.status(200).json({
        msg: `Returned all cookies added to that collection.`,
        result,
      });
    }
  });
});

// Get all image_urls related to a specific collection_id
app.get("/api/collections/images/:id", (req, res) => {
  // Define query string
  let sqlQuery = "SELECT * from collection_image WHERE collection_id = ?";

  // Query the database
  db.query(sqlQuery, [req.params.id], (err, result) => {
    if (err) throw err;
    // Check results for image_urls
    if (result.length === 0) {
      return res
        .status(200)
        .json({ msg: `No stored image urls for that collection.`, result });
    } else {
      return res.status(200).json({
        msg: `Returned all stored image urls for that collection.`,
        result,
      });
    }
  });
});

// Create a new collection record
app.post("/api/collections", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "INSERT into collection SET ?";

  // Query the database
  db.query(sqlQuery, params, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      msg: `Added a collection called: ${params.name} successfully.`,
    });
  });
});

// Create a new collection_cookie record
app.post("/api/collections/cookies", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "INSERT into collection_cookie SET ?";

  // Query the database
  db.query(sqlQuery, params, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      msg: `Added cookie: ${params.cookie_id} to collection: ${params.collection_id} successfully.`,
    });
  });
});

// Create new collection_image records
app.post("/api/collections/images", (req, res) => {
  // Store incoming form data
  const form = new formidable.IncomingForm();

  // Parse the incoming form data
  const parseData = form.parse(req, async function (err, fields, files) {
    if (err) throw err;

    // Store the collection_id and image_url from the form data
    let collectionId = parseInt(fields.collection_id);
    let imageURL = saveFile(files.file);

    // Construct the query parameters
    const params = { collection_id: collectionId, image_url: imageURL };

    // Define the query string
    let sqlQuery = "INSERT into collection_image SET ?";

    // Query the database
    db.query(sqlQuery, params, (err, result) => {
      if (err) throw err;
      res.status(200).json({ msg: `Saved file to: "${params.image_url}".` });
    });
  });
});

// Update an existing collection record
app.put("/api/collections", (req, res) => {
  // Destructure the request
  const { collection_id, name, cost, active_status } = req.body;

  // Check if the collection does exist
  // Define the query string
  let sqlQuery = "SELECT * from collection WHERE collection_id = ?";

  // Query the database
  db.query(sqlQuery, collection_id, (err, result) => {
    if (err) throw err;
    // If the cookie doesn't exist, send err
    if (result.length === 0) {
      res.status(404).json({ msg: `No collection with id: ${collection_id}.` });
    } else {
      // If the collection does exist, update it

      // Redefine the query string
      sqlQuery =
        "UPDATE collection SET name = ?, cost = ?, active_status = ? WHERE collection_id = ?";

      // Query the database
      db.query(
        sqlQuery,
        [name, cost, active_status, collection_id],
        (err, result) => {
          if (err) throw err;
          res.status(200).json({ msg: `Updated the collection successfully.` });
        }
      );
    }
  });
});

// Update an existing collection_cookie record
app.put("/api/collections/cookies", (req, res) => {
  // Destructure the request
  const { collection_cookie_id, cookie_id, amount } = req.body;

  // Check if the collection_cookie does exist
  // Define the query string
  let sqlQuery =
    "SELECT * from collection_cookie WHERE collection_cookie_id = ?";

  // Query the database
  db.query(sqlQuery, collection_cookie_id, (err, result) => {
    if (err) throw err;
    // If the cookie doesn't exist, send err
    if (result.length === 0) {
      res.status(404).json({
        msg: `No collection_cookie with id: ${collection_cookie_id}.`,
      });
    } else {
      // If the collection_cookie does exist, update it
      // Redefine the query string
      sqlQuery =
        "UPDATE collection_cookie SET, cookie_id = ?, amount = ? WHERE collection_cookie_id = ?";

      // Query the database
      db.query(
        sqlQuery,
        [cookie_id, amount, collection_cookie_id],
        (err, result) => {
          if (err) throw err;
          res
            .status(200)
            .json({ msg: `Updated the collection_cookie successfully.` });
        }
      );
    }
  });
});

// Delete a collection record from the database
app.delete("/api/collections", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "DELETE from collection WHERE collection_id = ?";

  // Query the database
  db.query(sqlQuery, params.collection_id, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ msg: `Deleted collection with id: ${params.collection_id}.` });
  });
});

// Delete a collection_cookie record from the database
app.delete("/api/collections/cookies", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Define the query string
  let sqlQuery = "DELETE from collection_cookie WHERE collection_cookie_id = ?";

  // Query the database
  db.query(sqlQuery, params.collection_cookie_id, (err, result) => {
    if (err) throw err;
    res.status(200).json({
      msg: `Deleted collection_cookie with id: ${params.collection_cookie_id}.`,
    });
  });
});

// Delete an image_url from collection_image
app.delete("/api/collections/images", (req, res) => {
  // Get the query parameters from the request body
  const params = req.body;

  // Delete the image file from file storage
  deleteFile(params.image_url);

  // Define the query string
  let sqlQuery = "DELETE from collection_image WHERE image_url = ?";

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
  const filePath = "../client/public/images/uploads/collections/";
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
  return `/images/uploads/collections/${fileName}${fileType}`;
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
