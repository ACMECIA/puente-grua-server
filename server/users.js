import { Router } from "express";
import keys from "./keys.js";
import bodyParser from "body-parser";

import mysql from "mysql";

const UsersRouter = Router();

// ChartsRouter.use(cors());
// ChartsRouter.use(express.json());
// ChartsRouter.use(cookieParser());
UsersRouter.use(bodyParser.json());

export default UsersRouter;

const db = mysql.createPool({
  host: keys.dbHost,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbName,
  port: keys.dbPort,
  timeout: 60000,
});

UsersRouter.get("/", (req, res) => {
  console.log("UsersRouter");
  res.send("UsersRouter");
});

// Get users emails of clients

UsersRouter.get("/clients", (req, res) => {
  console.log("UsersRouter/clients");
  const sqlSelect = "SELECT * FROM users WHERE rol = 'client'";
  db.query(sqlSelect, (err, result) => {
    // Error handling
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

UsersRouter.post("/clients/delete", (req, res) => {
  console.log("UsersRouter/clients/delete");
  // Delete users rows according to the ids obtained in an array
  const sqlDelete = "DELETE FROM users WHERE id IN (?)";

  db.query(sqlDelete, [req.body.selectedUsers], (err, result) => {
    // Error handling
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

UsersRouter.post("/clients/add", (req, res) => {
  console.log("UsersRouter/clients/add");
  // Delete users rows according to the ids obtained in an array

  console.log(req.body.values);

  //Check if mail was not registered before as client
  const sqlSelect = `SELECT * FROM users WHERE email = '${req.body.values.mail}' AND rol = 'client'`;
  db.query(sqlSelect, (err, result) => {
    // Error handling
    if (err) {
      console.log(err);
    }
    if (result.length > 0) {
      res.status(409);
      res.send({ message: "Mail already registered" });
    } else {
      const sqlInsert = `INSERT INTO users (id, email, username, password, rol, reports, alerts)
      VALUES (NULL, '${req.body.values.mail}', '${
        req.body.values.username
      }', '${req.body.values.password}', 'client', '${Number(
        req.body.values.reports
      )}', '${Number(req.body.values.alerts)}' )`;

      console.log(sqlInsert);
      db.query(sqlInsert, (err, result) => {
        // Error handling
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  });
});
