import express, { response } from "express";
import mysql from "mysql";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

import { Router } from "express";
import keys from "./keys.js";

const AuthRouter = Router();

export default AuthRouter;

AuthRouter.use(cors());
AuthRouter.use(express.json());
AuthRouter.use(cookieParser());
AuthRouter.use(bodyParser.json());
AuthRouter.use(
  session({
    secret: "secret", //secret key to encrypt session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    }, //Session cookie properties
  })
);

const db = mysql.createPool({
  host: keys.dbHost,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbName,
  port: keys.dbPort,
  timeout: 60000,
});

// db.connect((err) => {
//   if (err) {
//     console.error("Error connecting to MySQL:", err);
//     return;
//   }
//   console.log("MySql connected");
// });
const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token not okay" });
      } else {
        req.username = decoded.username;
        req.rol = decoded.rol;
        next();
      }
    });
  }
};

AuthRouter.get("/", verifyUser, (req, res) => {
  console.log(req.username);
  // res.send("Hello");
  return res.json({ Status: "Success", username: req.username, rol: req.rol });
});

AuthRouter.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

AuthRouter.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ? AND password = ? ";
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.json({ Errror: "Log in error server" });
    if (data.length > 0) {
      const username = data[0].username;
      const rol = data[0].rol;
      const token = jwt.sign({ username, rol }, "jwt-secret-key", {
        expiresIn: "1d",
      });

      res.cookie("token", token);
      //   console.log(name);
      return res.json({ Status: "Success" });
    } else {
      return res.json({ Error: "Wrong email or password" });
    }
  });
});
