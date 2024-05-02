import express from "express";
import ChartsRouter from "./charts.js";
import AuthRouter from "./auth.js";
import UtilsRouter from "./utils.js";
import UsersRouter from "./users.js";
import SettingsRouter from "./settings.js";
import AlertsRouter from "./alerts.js";
import bodyParser from "body-parser";
import ReportsRouter from "./reports.js";

const app = express();

// Para hacer la carpeta publica para react
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", AuthRouter);

app.use("/api/charts", ChartsRouter);

app.use("/api/utils", UtilsRouter);

app.use("/api/users", UsersRouter);

app.use("/api/settings", SettingsRouter);

app.use("/api/alerts", AlertsRouter);

app.use("/api/reports", ReportsRouter);

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
