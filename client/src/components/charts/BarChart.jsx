import React, { Fragment } from "react";

import Chart from "./highcharts/Chart";
// import Highcharts from 'highcharts'
import Highcharts from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import RefreshButton from "./components/RefreshButton";

import { getHostPath } from "../../utils/host";
import useLocalStorage from "use-local-storage";
import { websiteColors } from "../lib/utils/colors";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);

const array1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function BarChart({
  chartName,
  dataPath,
  dataRate,
  serverType,
  varName,
  yLabel = "Porcentaje (%)",
  units = "",
}) {
  const [data1, setData1] = useLocalStorage(`${dataPath}`, array1);

  // const [data1, setData1] = useState(array1);
  // const [data2, setData2] = useState(array2);
  const [isFetching, setIsFetching] = useState(false);

  const onClickFunction = () => {
    // console.log(dateRange);
    fetchData();
  };

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data.payload);
          setData1(data.payload.array1);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const chartOptions = {
    chart: {
      animation: false,
      // events: {
      //   load: function () {
      //     // set up the updating of the chart each second
      //     var series1 = this.series[0];
      //     var series2 = this.series[1];

      //     setInterval(function () {
      //       if (!!series1.data) {
      //         var x = new Date().getTime(), // current time
      //           y = Math.round(Math.random() * 100);
      //         series1.addPoint([x, y]);
      //       }
      //     }, 1000);

      //     setInterval(function () {
      //       if (!!series2.data) {
      //         var x = new Date().getTime(), // current time
      //           y = Math.round(Math.random() * 100);Frecuencia de uso
      //         series2.addPoint([x, y]);
      //       }
      //     }, 1000);
      //   },
      // },
      type: "column",
      // height: (9/20 * 100) + '%'
    },

    title: {
      align: "center",
      text: " ",
    },
    // subtitle: {
    //     align: 'left',
    //     text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
    // },
    accessibility: {
      announceNewData: {
        enabled: true,
      },
    },

    yAxis: {
      title: {
        text: yLabel,
      },
      // min: 0,
      // max: 100,
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

    plotOptions: {
      series: {
        animation: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: `{point.y:.2f}${units}`,
        },
        states: {
          inactive: {
            opacity: 1,
          },
        },
        events: {
          legendItemClick: function () {
            return false;
          },
        },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        `<td style="padding:0"><b>{point.y:.2f} ${units}</b></td></tr>`,
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },

    xAxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      crosshair: true,
    },

    series: [
      {
        animation: false,
        name: `${varName}`,
        color: `${websiteColors["komatsu-blue"]}`,
        data: data1,
      },
    ],
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className=" mt-3 flex flex-1 text-xs ">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row justify-center gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <Chart options={chartOptions} highcharts={Highcharts} />
        </ResponsiveContainer>
      </div>
      <div className="flex flex-row justify-center gap-4">
        <RefreshButton onClickFunction={onClickFunction} />
      </div>
    </Fragment>
  );
}
