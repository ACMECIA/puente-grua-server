import React, { Fragment } from "react";

import StockChart from "./highcharts/Stock";
// import Highcharts from 'highcharts'
import Highcharts from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import useLocalStorage from "use-local-storage";

// Load Highcharts modules
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
// require('highcharts/modules/map')(Highcharts)

var array1 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

var array2 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

var array3 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

var array4 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

var array5 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

var array6 = [
  [1483401600000, 0],
  [1483488000000, 0],
  [1483574400000, 0],
  [1483660800000, 0],
];

export default function RealTimeChart({
  chartName,
  dataPath,
  dataRate = 10000,
  serverType = "charts",
}) {
  const [data1, setData1] = useLocalStorage(`${dataPath}`, array1);
  const [data2, setData2] = useLocalStorage(`${dataPath}2`, array2);
  const [data3, setData3] = useLocalStorage(`${dataPath}3`, array3);
  const [data4, setData4] = useLocalStorage(`${dataPath}4`, array4);
  const [data5, setData5] = useLocalStorage(`${dataPath}5`, array5);
  const [data6, setData6] = useLocalStorage(`${dataPath}6`, array6);

  // const [data1, setData1] = useState(array1);
  // const [data2, setData2] = useState(array2);

  const [dateRange, setDates] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const onRangeChange = (date_values, dateStrings) => {
    console.log(date_values);
    if (date_values) {
      setDates(date_values.map((item) => Math.round(item.valueOf() / 1000)));
    } else {
      setDates([]);
    }

    console.log(dateRange);
  };

  const onClickFunction = () => {
    if (dateRange.length > 0) {
      console.log(dateRange);
      fetchData();
      return;
    }

    alert("Seleccione un rango de fechas");
    // alert("Descargando datos...");
  };

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`, {
        method: "POST",
        body: JSON.stringify({ dateRange }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setData1(data.array1);
          setData2(data.array2);
          setData3(data.array3);
          setData4(data.array4);
          setData5(data.array5);
          setData6(data.array6);

          setIsFetching(false); // Marcar que la solicitud ha terminado

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
  //   const intervalId = setInterval(fetchData, dataRate);

  //   // Limpieza cuando el componente se desmonta
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);

  const stockOptions = {
    series: [
      {
        animation: false,
        name: "Eje X",
        color: "#66CC00",
        // showCheckbox: true,
        data: data1,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} m</b><br/>",
        },
      },
      {
        animation: false,
        name: "Eje Y",
        color: "#FF9933",
        // showCheckbox: true,
        data: data2,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          animation: false,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} m</b><br/>",
        },
      },
      {
        animation: false,
        name: "Altura Gancho 25 Tn",
        // color: "#FF9933",
        // showCheckbox: true,
        data: data3,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          animation: false,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} m</b><br/>",
        },
      },
      {
        animation: false,
        name: "Altura Gancho 5 Tn",
        // color: "#FF9933",
        // showCheckbox: true,
        data: data4,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          animation: false,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} m</b><br/>",
        },
      },

      {
        animation: false,
        name: "Peso gancho 25 Tn",
        // color: "#FF9933",
        // showCheckbox: true,
        data: data5,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          animation: false,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} Tn</b><br/>",
        },
      },
      {
        animation: false,
        name: "Peso gancho 5 Tn",
        // color: "#FF9933",
        // showCheckbox: true,
        data: data6,
        // data: [],

        tooltip: {
          valueDecimals: 2,
          animation: false,
          pointFormat:
            '<span style="color:{point.color}">\u25CF</span> ' +
            "{series.name}: <b>{point.y} Tn</b><br/>",
        },
      },
    ],
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
      //           y = Math.round(Math.random() * 100);
      //         series2.addPoint([x, y]);
      //       }
      //     }, 1000);
      //   },
      // },
    },

    accessibility: {
      enabled: false,
    },

    time: {
      useUTC: false,
    },

    yAxis: {
      // title: { text: "Altura (m)", align: "middle", rotation: 90, offset: 20 },
      // title: {
      //   text: 'm',
      //   align: 'high',
      //   offset: 5,
      //   rotation: 0,
      //   y: 0
      // },
    },

    // ADDED
    legend: {
      enabled: "true",
      // layout: 'vertical',
      // align: 'right',
      // verticalAlign: 'middle',
    },

    plotOptions: {
      series: {
        animation: false,
        // compare: 'percent',
        showInNavigator: true,
      },
    },

    // END ADDED

    rangeSelector: {
      buttons: [
        {
          count: 1,
          type: "day",
          text: "Hoy",
        },
        {
          count: 1,
          type: "month",
          text: "mes",
        },
        {
          count: 12,
          type: "month",
          text: "año",
        },
        {
          type: "all",
          text: "Todo",
        },
      ],
      inputEnabled: true,
      // selected: 1,
    },

    title: {
      text: "", //'DATA EN TIEMPO REAL'
    },

    exporting: {
      enabled: false,
    },

    credits: {
      enabled: false,
    },
    time: {
      useUTC: false,
      timezone: "America/Lima",
    },
  };
  // Fin del config
  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="h-full w-full mt-3 flex flex-1 text-xs ">
        <ResponsiveContainer width="100%" height="100%" className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <StockChart options={stockOptions} highcharts={Highcharts} />
        </ResponsiveContainer>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <div>
          <DatePickerComponent onRangeChange={onRangeChange} />
        </div>

        <RefreshButton width="15%" onClickFunction={onClickFunction} />
      </div>
    </Fragment>
  );
}
