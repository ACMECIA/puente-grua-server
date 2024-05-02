import { Router } from "express";
import keys from "./keys.js";
import bodyParser from "body-parser";

import mysql from "mysql";

const AlertsRouter = Router();

AlertsRouter.use(bodyParser.json());

export default AlertsRouter;

const db = mysql.createPool({
  host: keys.dbHost,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbName,
  port: keys.dbPort,
  timeout: 60000,
});

AlertsRouter.get("/", (req, res) => {
  console.log("AlertsRouter");
  res.send("AlertsRouter");
});

AlertsRouter.get("/status", (req, res) => {
  var query = "SELECT `json` FROM `persistent_data` where `tag`='alert_flag'";
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });
    // console.log(data[0].json);
    return res.json({ Status: "Success", payload: data[0].json });
  });
});
AlertsRouter.get("/statusoff", (req, res) => {
  var query =
    "UPDATE `persistent_data` SET `json` = '0' WHERE `persistent_data`.`tag` = 'alert_flag'";
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });
    return res.json({ Status: "Success" });
  });
});

AlertsRouter.get("/statuson", (req, res) => {
  var query =
    "UPDATE `persistent_data` SET `json` = '1' WHERE `persistent_data`.`tag` = 'alert_flag'";
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });
    return res.json({ Status: "Success" });
  });
});

AlertsRouter.get("/load", (req, res) => {
  var query = "SELECT * FROM `alerts` ORDER BY `id` DESC";
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });
    // console.log(data);
    return res.json({ Status: "Success", payload: data });
  });
});

AlertsRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { maintenanceType, checklist, comments } = req.body;

  let query = "UPDATE alerts SET ";
  let params = [];

  if (maintenanceType !== undefined) {
    query += "mant_type = ?, ";
    params.push(maintenanceType);
  }

  if (checklist !== undefined) {
    query += "checklist = ?, ";
    params.push(checklist);
  }

  if (comments !== undefined) {
    query += "comments = ?, ";
    params.push(comments);
  }

  // Remove last comma and space
  query = query.slice(0, -2);

  query += " WHERE id = ?";
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Error in the query" });
    }

    // console.log(result);
    return res.json({ Status: "Success", payload: result });
  });
});

const alertTypes = [
  "Batería baja",
  "Mantenimiento - Inicio",
  "Mantenimiento - Fin",
  "Mantenimiento preventivo 1",
  "Mantenimiento preventivo 2",
  "Mantenimiento preventivo 3",
];

const mantTypes = {
  correctivo: "Correctivo",
  preventivo: "Preventivo",
};

AlertsRouter.post("/download", (req, res) => {
  var dates = req.body.dateRange;

  var query = `SELECT * FROM alerts WHERE 
  date >= FROM_UNIXTIME(${dates[0]}) AND date <= FROM_UNIXTIME(${dates[1]})
  ORDER BY date;
  `;
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });

    var array_in = data;
    console.log("array in", array_in);
    var array_out = [];

    if (array_in.length === 0) {
      return res.json({
        Status: "Success",
        payload: { data: "No data", filename: "no_data" },
      });
    } else {
      for (var i = 0; i < array_in.length; i++) {
        array_out[i] = {};
        array_out[i].timestamp = unixTimestampToHumanReadable(array_in[i].date);
        array_out[i].tipo_alerta = alertTypes[array_in[i].alert_type];
        array_out[i].codigo_activo = array_in[i].code_device;
        array_out[i].horometro = array_in[i].hourmeter;
        array_out[i].tonelaje = array_in[i].ton;
        array_out[i].tipo_mantenimiento = mantTypes[array_in[i].mant_type];
        array_out[i].comentarios = array_in[i].comments;
      }

      console.log("array out", array_out);
      var filename = `Alertas desde ${
        array_out[0].timestamp.split(" ")[0]
      } hasta ${array_out[array_out.length - 1].timestamp.split(" ")[0]}`;

      var csvString = arrayToCSV(array_out);

      return res.json({
        Status: "Success",
        payload: { data: csvString, filename: filename },
      });
    }
  });
});

AlertsRouter.get("/legend", (req, res) => {
  var query =
    "SELECT * FROM `persistent_data` WHERE `persistent_data`.`tag` = 'mant_prevs'";
  db.query(query, (err, data) => {
    if (err) return res.json({ Error: "Error in the query" });
    return res.json({ payload: JSON.parse(data[0].json), Status: "Success" });
  });
});

// GENERAL FUNCTIONS

function unixTimestampToHumanReadable(unixTimestamp) {
  const date = new Date(unixTimestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function arrayToCSV(data) {
  if (data.length === 0) {
    return "";
  }

  const keys = Object.keys(data[0]);
  const headerRow = keys.join(",");

  const csvRows = [];
  csvRows.push(headerRow);

  for (const obj of data) {
    const values = keys.map((key) => obj[key]);
    const csvRow = values.join(",");
    csvRows.push(csvRow);
  }

  return csvRows.join("\n");
}
