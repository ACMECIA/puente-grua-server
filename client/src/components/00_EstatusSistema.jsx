import React, { useEffect, useState } from "react";
import DeviceDescription from "./utils/DeviceDescription";
import DeviceLocation from "./utils/DeviceLocation";
import DeviceDraw from "./utils/DeviceDraw";
import Box from "./shared/Box";
import DemoGauge from "./utils/DemoGauge";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EstatusSistema() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 ">
      <div className="flex flex-row gap-4 w-full">
        {/* <Box flex={2}> */}

        <Box>
          <DeviceDraw
            chartName={"Movimiento del sistema"}
            dataPath={"status-loc"}
            dataRate={2000}
          />
        </Box>
      </div>
      <div className="flex flex-row gap-4 w-full">
        {/* <Box flex={2}> */}
        <Box>
          <DeviceDescription
            chartName={"Descripción del sistema"}
            serverType={"settings"}
            dataPath={"status-desc"}
            dataRate={5000}
          />
        </Box>
      </div>
      {/* <div className="flex flex-row gap-4 w-full">
        <Box>
          <DemoGauge
            chartName={"Velocidad"}
            dataPath={"speed"}
            dataRate={1000}
            gaugeUnit="km/h"
            maxValue={20}
            gaugeColors={["#30BF78", "#FAAD14", "#F4664A"]}
            gaugeTicks={[0, 1 / 2, 3 / 4, 1]}
          />
        </Box>

        <Box>
          <DemoGauge
            chartName={"Carga"}
            dataPath={"load"}
            dataRate={1000}
            gaugeUnit="Tn"
            maxValue={5}
            gaugeColors={["#FAAD14", "#30BF78", "#F4664A"]}
            gaugeTicks={[0, 1 / 2, 4.5 / 5, 1]}
          />
        </Box>
      </div> */}
    </div>
  );
}
