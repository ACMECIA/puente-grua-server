import React from "react";
import FrenquencyChart from "./charts/FrenquencyChart";
import CumulatedFrenquencyChart from "./charts/CumulatedFrenquencyChart";
import Box from "./shared/Box";
import StackedBarChart from "./charts/StackedBarChart";
import TermsLegend from "./utils/TermsLegend";

export default function EstatusMensual() {
  return (
    <div className="grid grid-cols-2 w-full gap-4 p-4">
      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <FrenquencyChart
            dataPath={"frequency"}
            chartName={"Condición de equipo"}
            serverType={"charts"}
          />
        </Box>

        <Box>
          <StackedBarChart
            dataPath={"stacked"}
            chartName={"Detalle de uso mensual"}
            serverType={"charts"}
          />
        </Box>
      </div>

      <div className="col-span-1 flex flex-col gap-4">
        <Box>
          <CumulatedFrenquencyChart
            dataPath={"cfrequency"}
            chartName={"Frecuencia de uso mensual acumulado"}
            serverType={"charts"}
          />
        </Box>

        <Box>
          <TermsLegend chartName={"Leyenda de términos"} />
        </Box>
      </div>
    </div>
  );
}
