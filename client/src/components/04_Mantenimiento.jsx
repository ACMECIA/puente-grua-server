import React from "react";
import RealTimeChart from "./charts/RealTimeChart";
import Box from "./shared/Box";
import DownloadData from "./utils/DownloadData";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoubleBellChart from "./charts/DoubleBellChart";
import BarChart from "./charts/BarChart";
import BarChart2 from "./charts/BarChart2";
export default function Mantenimiento() {
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
    <div className="grid grid-cols-2 w-full gap-4 p-4">
      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <BarChart
            dataPath={"disponibilidad"}
            serverType={"charts"}
            chartName={"Disponibilidad"}
            varName={"Disponibilidad"}
            yLabel={"Porcentaje (%)"}
            units={"%"}
          />
        </Box>

        <Box>
          <BarChart2
            dataPath={"detenciones"}
            serverType={"charts"}
            chartName={"Horas de detenciones"}
            labelName1={"Mantenimiento correctivo"}
            labelName2={"Mantenimiento preventivo"}
          />
        </Box>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <BarChart
            dataPath={"confiabilidad"}
            serverType={"charts"}
            chartName={"Confiabilidad"}
            varName={"Confiabilidad"}
            yLabel={"Confiabilidad"}
          />
        </Box>

        <Box></Box>
      </div>
    </div>
  );
}
