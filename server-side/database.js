// Set up the MySQL connection
const mysql = require("mysql2");
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "asisten_jadwal_dosen",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Connected to the database");
});

// Function to query data from the database
function queryDatabase(query_string, params = []) {
  return new Promise((resolve, reject) => {
    db.query(query_string, params, (err, results) => {
      if (err) {
        console.error("Error executing query:", err.stack);
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(results); // Resolve the promise with query results
      }
    });
  });
}

// Export the functions so they can be used in other files
module.exports = {
  queryDatabase,
};
