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
const array4 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const array5 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const array6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function StackedBarChart({
  chartName,
  dataPath,
  dataRate,
  serverType,
}) {
  const [data1, setData1] = useLocalStorage(`${dataPath}`, array1);
  const [data2, setData2] = useLocalStorage(`${dataPath}2`, array2);
  const [data3, setData3] = useLocalStorage(`${dataPath}3`, array3);
  const [data4, setData4] = useLocalStorage(`${dataPath}4`, array4);
  const [data5, setData5] = useLocalStorage(`${dataPath}5`, array5);
  const [data6, setData6] = useLocalStorage(`${dataPath}6`, array6);

  // const [data1, setData1] = useState(array1);
  // const [data2, setData2] = useState(array2);
  // const [data3, setData3] = useState(array3);
  // const [data4, setData4] = useState(array4);
  // const [data5, setData5] = useState(array5);
  // const [data6, setData6] = useState(array6);

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
          setData2(data.payload.array2);
          setData3(data.payload.array3);
          setData4(data.payload.array4);
          setData5(data.payload.array5);
          setData6(data.payload.array6);
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
      type: "column",
    },
    title: {
      align: "center",
      text: " ",
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
    yAxis: {
      title: {
        text: "Horas (h)",
      },
      // min: 0,
      // max: 100,
    },
    // legend: {
    //   align: "left",
    //   x: 70,
    //   verticalAlign: "top",
    //   y: 70,
    //   floating: true,
    //   backgroundColor:
    //     Highcharts.defaultOptions.legend.backgroundColor || "white",
    //   borderColor: "#CCC",
    //   borderWidth: 1,
    //   shadow: false,
    // },
    legend: {
      enabled: true,
      align: "center",
    },
    exporting: {
      enabled: false,
    },

    credits: {
      enabled: false,
    },

    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat:
        "{series.name}: {point.percentage:.2f} %<br/>Horas: {point.y:.2f}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        dataLabels: {
          enabled: false,
        },
      },
    },
    series: [
      {
        name: "Efectivo",
        data: data6,
        color: "rgb(14,18,113)",
      },
      {
        name: "Traslado con carga",
        data: data5,
        color: "rgb(0,148,206)",
      },
      {
        name: "Espera con carga",
        data: data4,
        color: "rgb(142,202,230)",
      },
      {
        name: "Subida o bajada",
        data: data3,
        color: "rgb(170,170,170)",
      },
      {
        name: "Traslado sin carga",
        data: data2,
        color: "rgb(100,100,100)",
      },
      {
        name: "Espera sin carga",
        data: data1,
        color: "rgb(40,40,40)",
      },
    ],
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className=" mt-3 flex flex-1 text-xs ">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
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
