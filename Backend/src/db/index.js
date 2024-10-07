import { Connection, Request } from "tedious";
import dotenv from "dotenv";

dotenv.config();

const config = {
  server: "103.231.43.48", // DB_HOST
  authentication: {
    type: "default",
    options: {
      userName: "sa", // DB_USER
      password: "softvent@123$$", // DB_PASSWORD
    },
  },
  options: {
    database: "vCracker", // DB_NAME
    port: 16052, // DB_PORT
    encrypt: false, // Set to true if using Azure SQL
    trustServerCertificate: true, // For local development only, not recommended for production
  },
};

export function executeQuery(query) {
  return new Promise((resolve, reject) => {
    // Create connection instance
    const connection = new Connection(config);

    connection.on("connect", (err) => {
      if (err) {
        console.error("Connection Failed:", err);
        reject(err);
      } else {
        console.log("SQL Server Connection established");

        const request = new Request(query, (err) => {
          if (err) {
            console.error("SQL Query Execution Error:", err);
            reject(err);
          }
        });

        const results = [];

        // Listen for rows returned from the query
        request.on("row", (columns) => {
          const row = {};
          columns.forEach((column) => {
            row[column.metadata.colName] = column.value;
          });
          results.push(row);
        });

        // Listen for any errors during the query execution
        request.on("error", (err) => {
          console.error("Error during query execution:", err);
          reject(err);
        });

        // Resolve the promise when the query is complete
        request.on("requestCompleted", () => {
          resolve(results);
        });

        // Execute the SQL query
        connection.execSql(request);

        // Additional logging to confirm method execution
        console.log("Query has been executed, waiting for results...");
      }
    });

    // Connect to the database
    connection.connect();
  });
}
