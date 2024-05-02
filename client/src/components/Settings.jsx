import React, { Fragment } from "react";
import FrenquencyChart from "./charts/FrenquencyChart";
import CumulatedFrenquencyChart from "./charts/CumulatedFrenquencyChart";
import Box from "./shared/Box";
import DoubleBellChart from "./charts/DoubleBellChart";
import axios from "axios";
import { useEffect, useState } from "react";
import LimitSettings from "./utils/settings/LimitSettings";
import GeneralSettings from "./utils/settings/GeneralSettings";

import DeviceSchedule from "./utils/settings/DeviceSchedule";
import UserManagement from "./utils/settings/UserManagement";
import LimitConfig from "./utils/settings/LimitSettings";
import AlertsSettings from "./utils/settings/AlertsSettings";
import HeatmapConfig from "./utils/settings/HeatmapSettings";

export default function Settings() {
  const [rol, setRol] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("/api/auth", {
        withCredentials: true,
      })
      .then((res) => {
        // console.log(res);
        // setLoaded(true);
        if (res.data.Status === "Success") {
          // setAuth(true);
          setName(res.data.username);
          setRol(res.data.rol);

          //   navigate("/");
          //
        } else {
          // setAuth(false);
          // navigate("/login");
          // setMessage(res.data.Error);
        }
      });
  });

  return (
    <Fragment>
      {rol === "admin" ? (
        <SettingsDisplay></SettingsDisplay>
      ) : (
        "No tienes permiso"
      )}{" "}
    </Fragment>
  );
}

export function SettingsDisplay() {
  return (
    <div className="grid grid-cols-2 w-full gap-4 p-4">
      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <DeviceSchedule
            chartName={"Horario del Sistema"}
            serverType={"settings"}
            dataPath={"schedule"}
          ></DeviceSchedule>
        </Box>

        <Box>
          <HeatmapConfig
            chartName={"Configuración de Heatmap"}
            serverType={"settings"}
            dataPath={"upload"}
          />
        </Box>

        <Box>
          <LimitSettings
            chartName={"Ajustes de límites"}
            serverType={"settings"}
            dataPath={"limits"}
          />
        </Box>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <UserManagement
            chartName={"Gestión de Usuarios"}
            serverType={"users"}
            dataPath={"clients"}
          ></UserManagement>
        </Box>

        <Box>
          <GeneralSettings
            chartName={"Ajustes generales"}
            serverType={"settings"}
            dataPath={"general"}
          />
        </Box>

        {/* <Box>
          <AlertsSettings chartName={"Configuración de Alertas"} />
        </Box> */}
      </div>
    </div>
  );
}
