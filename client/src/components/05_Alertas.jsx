import React from "react";
import RealTimeChart from "./charts/RealTimeChart";
import Box from "./shared/Box";
import DownloadData from "./utils/DownloadData";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoubleBellChart from "./charts/DoubleBellChart";
import AlertsTable from "./utils/AlertsTable";
import AlertsReport from "./utils/AlertsReport";
import AlertsLegend from "./utils/AlertsLegend";

export default function Alertas() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 ">
      <div className="flex flex-row gap-4 w-full">
        <Box>
          <AlertsTable
            dataPath={"load"}
            serverType={"alerts"}
            tableName={"Alertas"}
          />
          <AlertsLegend serverType={"alerts"} dataPath={"legend"} />
        </Box>
      </div>

      <div className="flex flex-row gap-4 w-full">
        <Box>
          <AlertsReport dataPath={"download"} serverType={"alerts"} />
        </Box>
      </div>
    </div>
  );
}
