import React, { Fragment } from "react";

import Chart from "./highcharts/Chart";
// import Highcharts from 'highcharts'
import Highcharts, { chart } from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import RefreshButton from "./components/RefreshButton";
import useLocalStorage from "use-local-storage";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/map")(Highcharts);

const array1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const array2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const array3 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const data1t = [10, 30, 42, 78, 90, 50, 40, 90, 45, 43, 25, 50];
const data2t = [10, 20, 32, 58, 60, 30, 20, 40, 15, 13, 5, 20];
// division de (data2t / data1t) *100
const data3t = [
  100, 66.66, 76.19, 74.35, 66.66, 60, 50, 44.44, 33.33, 30.23, 20, 40,
];

export default function CumulatedFrequencyChart({
  chartName,
  dataPath,
  dataRate,
  serverType,
}) {
  const [data1, setData1] = useLocalStorage(`${dataPath}`, array1);
  const [data2, setData2] = useLocalStorage(`${dataPath}2`, array2);
  const [data3, setData3] = useLocalStorage(`${dataPath}3`, array3);

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
          setData1(data.payload.array_uso);
          setData2(data.payload.array_efectivo);
          setData3(data.payload.array_porcentaje_efectivo);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  // useEffect(() => {
  //   // Ejecutar fetchData inicialmente
  //   fetchData();

  //   // Configurar un intervalo para ejecutar fetchData
  //   // const intervalId = setInterval(fetchData, dataRate);

  //   // // Limpieza cuando el componente se desmonta
  //   // return () => {
  //   //   clearInterval(intervalId);
  //   // };
  // }, []);

  const chartOptions = {
    chart: {
      // animation: false,
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
      //           y = Math.round(Math.random() * 100);
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
    // xAxis: {
    //   type: "category",
    // },
    yAxis: {
      title: {
        text: "Porcentaje (%)",
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
        // animation: false,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{point.y:.1f}%",
        },
        // states: {
        //   inactive: {
        //     opacity: 1,
        //   },
        // },
        // events: {
        //   // legendItemClick: function () {
        //   //   return false;
        //   // },
        // },
      },
    },

    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },

    xAxis: {
      categories: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      crosshair: true,
    },

    series: [
      {
        // animation: false,
        name: "Frecuencia de uso",
        color: "rgb(14,18,113)",
        data: data1,
      },
      {
        // animation: false,
        name: "Frecuencia efectiva de uso ",
        color: "rgb(0,148,206)",
        data: data2,
      },
      {
        // animation: false,
        name: "Porcentaje efectivo ",

        color: "rgb(142,202,230)",
        data: data3,
        type: "line",
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
