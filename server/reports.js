import { Router } from "express";
import keys from "./keys.js";
import bodyParser from "body-parser";

import mysql from "mysql";

const ReportsRouter = Router();

// ChartsRouter.use(cors());
// ChartsRouter.use(express.json());
// ChartsRouter.use(cookieParser());
ReportsRouter.use(bodyParser.json());

export default ReportsRouter;

const db = mysql.createPool({
  host: keys.dbHost,
  user: keys.dbUser,
  password: keys.dbPassword,
  database: keys.dbName,
  port: keys.dbPort,
  timeout: 60000,
});

ReportsRouter.get("/", (req, res) => {
  console.log("ReportsRouter");
  res.send("ReportsRouter");
});

// ReportsRouter.get("/monthly", (req, res) => {
//   console.log("ReportsRouter/monthly");
//   const sqlSelect = "SELECT * FROM monthly_reports";
//   db.query(sqlSelect, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     res.send(result);
//   });
// });

ReportsRouter.get("/totalhours", (req, res) => {
  // Obtenemos el intervalo de data
  // var dates = req.body.dateRange;

  // Get the schedule from the database
  const sqlSelect = "SELECT * FROM persistent_data WHERE tag = 'schedule'";

  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Error in the query" });
    }

    let schedule = JSON.parse(result[0].json);

    let weekdays = schedule.weekdays;
    let sumDays = weekdays.reduce((a, b) => a + b, 0);

    let maxHours = 4 * sumDays * (schedule.endHour - schedule.initHour);

    // Get the data from the database with the time interval make the query
    var query = `
    SELECT * FROM local_data 
    WHERE YEAR(date) = YEAR(CURDATE())
    order by date;
    `;
    db.query(query, (err, data) => {
      if (err) return res.json({ Error: "Error in the query" });

      var array_in = data.map((row) => JSON.parse(row.data));
      var array_out = [];
      var array1 = Array(12).fill(0);
      var array2 = Array(12).fill(0);
      var array3 = Array(12).fill(0);

      [array1, array2, array3] = cumulatedMonthly(array_in, maxHours);

      return res.json({
        Status: "Success",
        payload: { array1, array2, array3 },
      });
    });
  });
});

export function cumulatedMonthly(arr, maxHours = 220) {
  // declara un array con 7 arrays dentro, uno para cada estado, con valores iniciales de 0
  // el 7 es para efectivo
  let horasPorMes = new Array(7).fill(0).map(() => new Array(12).fill(0));
  // let horasEfectivas = new Array(12).fill(0);
  let resultado = [];
  let rindex = 0;

  let resultado2 = [];
  let rindex2 = 0;
  let sumArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (arr[0].carga >= 2 && arr[0].state >= 3) {
    arr[0]["efecstate"] = 6;
  } else {
    arr[0]["efecstate"] = 0;
  }
  // Declaramos el primer valor de resultado
  resultado[rindex] = {
    fInit: new Date(arr[0].timestamp),
    fEnd: new Date(arr[0].timestamp),
    state: arr[0].state,
    efecstate: arr[0]["efecstate"],
    hours: 0,
    month: new Date(arr[0].timestamp).getMonth(),
  };
  rindex++;

  resultado2[rindex2] = {
    fInit: new Date(arr[0].timestamp),
    fEnd: new Date(arr[0].timestamp),
    efecstate: arr[0]["efecstate"],
    hours: 0,
    month: new Date(arr[0].timestamp).getMonth(),
  };
  rindex2++;

  let array1 = new Array(12);
  let array2 = new Array(12);
  let array3 = new Array(12);

  for (let i = 1; i < arr.length; i++) {
    // if (arr[i].state == -1) {
    //   continue; // Ignorar intervalos con state igual a -1
    // }
    // Obtenemos el efectivo
    if (arr[i].carga >= 2 && arr[i].state >= 3) {
      arr[i]["efecstate"] = 6;
    } else {
      arr[i]["efecstate"] = 0;
    }
    if (arr[i].state !== arr[i - 1].state) {
      // Cada que hay un cambio declaramos el nuevo item
      resultado[rindex] = {
        fInit: new Date(arr[i].timestamp),
        fEnd: new Date(arr[i].timestamp),
        state: arr[i].state,
        efecstate: arr[i]["efecstate"],
        hours: 0,
        month: new Date(arr[i].timestamp).getMonth(),
      };

      // Y con ello actualizamos el item anterior
      resultado[rindex - 1].fEnd = new Date(arr[i].timestamp);
      resultado[rindex - 1].hours =
        (resultado[rindex - 1].fEnd.getTime() -
          resultado[rindex - 1].fInit.getTime()) /
        (60 * 60 * 1000);

      // Actualizamos las horas acumuladas
      if (resultado[rindex - 1].state !== -1) {
        horasPorMes[resultado[rindex - 1].state][resultado[rindex - 1].month] +=
          resultado[rindex - 1].hours;
      }

      // console.log(horasPorMes);
      rindex++;
    }
  }
  for (let i = 1; i < arr.length; i++) {
    // if (arr[i].state == -1) {
    //   continue; // Ignorar intervalos con state igual a -1
    // }
    // Obtenemos el efectivo
    if (arr[i].carga >= 2 && arr[i].state >= 3) {
      arr[i]["efecstate"] = 6;
    } else {
      arr[i]["efecstate"] = -1;
    }
    if (arr[i].efecstate !== arr[i - 1].efecstate) {
      // Cada que hay un cambio declaramos el nuevo item
      resultado2[rindex2] = {
        fInit: new Date(arr[i].timestamp),
        fEnd: new Date(arr[i].timestamp),
        efecstate: arr[i]["efecstate"],
        hours: 0,
        month: new Date(arr[i].timestamp).getMonth(),
      };

      // Y con ello actualizamos el item anterior
      resultado2[rindex2 - 1].fEnd = new Date(arr[i].timestamp);
      resultado2[rindex2 - 1].hours =
        (resultado2[rindex2 - 1].fEnd.getTime() -
          resultado2[rindex2 - 1].fInit.getTime()) /
        (60 * 60 * 1000);

      // Actualizamos las horas acumuladas
      if (resultado2[rindex2 - 1].efecstate !== -1) {
        horasPorMes[resultado2[rindex2 - 1].efecstate][
          resultado2[rindex2 - 1].month
        ] += resultado2[rindex2 - 1].hours;
      }

      // console.log(horasPorMes);
      rindex2++;
    }
  }
  // Get the sum of hours of the 6 states

  // console.log(horasPorMes);
  // sum the 6 arrays and get 1 12 array with the total hours per month

  // console.log(sumArray);

  // array 1 de horas de uso por mes
  array1 = horasPorMes[3].map((x, i) => {
    return x + horasPorMes[4][i] + horasPorMes[5][i];
  });

  // arra 2 de horas efectivas de uso por mes
  array2 = horasPorMes[6];

  // return the three arrays
  return [array1, array2];
}
