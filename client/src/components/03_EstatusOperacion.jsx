import React from "react";
import RealTimeChart from "./charts/RealTimeChart";
import Box from "./shared/Box";
import DownloadData from "./utils/DownloadData";
import GeneralReport from "./utils/GeneralReport";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoubleBellChart from "./charts/DoubleBellChart";
import HistogramChart from "./charts/HistogramChart";

export default function EstatusOperacion() {
  // const [name, setName] = useState("");
  // const navigate = useNavigate();
  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8081")
  //     .then((res) => {
  //       if (res.data.valid) {
  //         setName(res.data.username);
  //       } else {
  //         navigate("/login");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // }, []);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 ">
      <div className="flex flex-row gap-4 w-full">
        <Box>
          <RealTimeChart
            serverType={"charts"}
            chartName={"Monitoreo general de condiciones"}
            dataPath={"realtime"}
            dataRate={1000}
          />
        </Box>
      </div>

      <div className="flex flex-row gap-4 w-full ">
        <Box>
          <HistogramChart
            dataPath={"histogram2"}
            serverType={"charts"}
            chartName={"Distribución de cargas (Gancho 5 Tn)"}
            binWidth={0.5}
          ></HistogramChart>
        </Box>

        <Box>
          <HistogramChart
            dataPath={"histogram1"}
            serverType={"charts"}
            chartName={"Distribución de cargas (Gancho 25 Tn)"}
            binWidth={0.5}
          ></HistogramChart>
        </Box>
      </div>
      <div className="flex flex-row gap-4 w-full ">
        <Box>
          <DownloadData dataPath={"download"} serverType={"utils"} />
          <GeneralReport dataPath={"downloadreport"} />
        </Box>
      </div>

      <div className="flex flex-row gap-4 w-full"></div>
    </div>
  );
}
