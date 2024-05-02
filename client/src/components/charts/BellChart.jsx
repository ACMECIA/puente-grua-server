import React, { Fragment, useCallback, useRef } from "react";
import Bell from "./highcharts/Bell";
import Highcharts from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import { useState } from "react";
import { useEffect } from "react";

require("highcharts/modules/histogram-bellcurve")(Highcharts);
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

var ideal_data = [
  100, 100, 100, 100, 100, 100, 150, 100, 100, 95, 95, 105, 105,
];
var real_data = [100, 100, 100, 100, 100, 10];

export default function BellChart() {
  const [data, setData] = useState(real_data);
  const chartRef = useRef();
  useEffect(() => {
    if (!!chartRef.current) {
      console.log("exists");
    }
  }, [chartRef.current]);

  const bellChartOptions = {
    chart: {
      type: "area",
      // width: 700,
    },

    title: {
      text: "",
    },

    // subtitle: {
    //     text:
    //     'Subtitle '
    // },
    xAxis: {
      alignTicks: false,
    },

    yAxis: {
      title: { text: null },
    },
    legend: {
      enabled: true,
    },

    exporting: {
      enabled: false,
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      valueDecimals: 2,
    },

    series: [
      {
        name: "Curva Real",
        type: "bellcurve",
        color: "rgb(0,148,206)",
        baseSeries: 1,
        zIndex: -1,
      },
      {
        name: "Curva Real",
        data: real_data,
        visible: false,
        showInLegend: false,
      },

      {
        name: "Curva Ideal",
        type: "bellcurve",
        color: "rgb(14,18,113)",
        fillColor: "transparent",
        baseSeries: 2,
        zIndex: -1,
        data: ideal_data,
      },
    ],

    // series: [
    //   {
    //     name: "Curva Real",
    //     type: "bellcurve",
    //     color: "rgb(0,148,206)",
    //     zIndex: 1,
    //     fillColor: "transparent",
    //     data: real_data,
    //   },
    //   {
    //     name: "Curva Ideal",
    //     type: "bellcurve",
    //     color: "rgb(14,18,113)",
    //     data: ideal_data,
    //   },
    // ],
  };

  const onStart = useCallback(
    (chart) => {
      chartRef.current = chart;
    },
    [chartRef]
  );

  return (
    <Fragment>
      <div className="flex flex-row justify-between">
        <strong className="text-gray-700 font-medium">Campana de Gauss</strong>
      </div>

      <div className="mt-3 flex flex-1 text-xs ">
        <ResponsiveContainer>
          <Bell
            options={bellChartOptions}
            highcharts={Highcharts}
            onStart={onStart}
          />
        </ResponsiveContainer>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <div>
          <DatePickerComponent />
        </div>

        <RefreshButton />
      </div>
    </Fragment>
  );
}
