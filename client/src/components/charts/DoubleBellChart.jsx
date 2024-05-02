import React, { Fragment } from "react";
import Bell from "./highcharts/Bell";
import Highcharts from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import { useState } from "react";

import useLocalStorage from "use-local-storage";

require("highcharts/modules/histogram-bellcurve")(Highcharts);
require("highcharts/indicators/indicators")(Highcharts);
require("highcharts/indicators/pivot-points")(Highcharts);
require("highcharts/indicators/macd")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

// Función para calcular la media de un array
function calcularMedia(arr) {
  const sum = arr.reduce((acc, valor) => acc + valor, 0);
  return sum / arr.length;
}

// Función para calcular la desviación estándar de un array
function calcularDesviacionEstandar(arr) {
  const media = calcularMedia(arr);
  const sumDiferenciasCuadradas = arr.reduce(
    (acc, valor) => acc + Math.pow(valor - media, 2),
    0
  );
  const varianza = sumDiferenciasCuadradas / arr.length;
  return Math.sqrt(varianza);
}

function getIdealData(media, desviacionEstandar) {
  // Crear un rango de valores para el eje X (por ejemplo, -3 a 3 desviaciones estándar)
  const paso = 0.1;
  const valoresX = [];
  for (
    let x = media - 3 * desviacionEstandar;
    x <= media + 3 * desviacionEstandar;
    x += paso
  ) {
    valoresX.push(x);
  }

  // Calcular los valores de la curva de Gauss para cada punto en el rango
  const valoresY = valoresX.map(
    (x) =>
      (1 / (desviacionEstandar * Math.sqrt(2 * Math.PI))) *
      Math.exp(-Math.pow(x - media, 2) / (2 * Math.pow(desviacionEstandar, 2)))
  );

  return { valoresX, valoresY };
}

function getBellData(datos) {
  const media = calcularMedia(datos);
  const desviacionEstandar = calcularDesviacionEstandar(datos);

  // Crear un rango de valores para el eje X (por ejemplo, -3 a 3 desviaciones estándar)
  const paso = 0.1;
  const valoresX = [];
  for (
    let x = media - 3 * desviacionEstandar;
    x <= media + 3 * desviacionEstandar;
    x += paso
  ) {
    valoresX.push(x);
  }

  // Calcular los valores de la curva de Gauss para cada punto en el rango
  const valoresY = valoresX.map(
    (x) =>
      (1 / (desviacionEstandar * Math.sqrt(2 * Math.PI))) *
      Math.exp(-Math.pow(x - media, 2) / (2 * Math.pow(desviacionEstandar, 2)))
  );

  return { valoresX, valoresY };
}

export default function BellChart({
  chartName,
  dataPath,
  serverType = "charts",
}) {
  const { valoresX, valoresY } = getIdealData(100, 20);

  const [datax, setDataX] = useLocalStorage(`${dataPath}`, [0]);
  const [datay, setDataY] = useLocalStorage(`${dataPath}2`, [0]);

  // Valores para la gráfica en Toneladas
  const [lowerLimit, setLowerLimit] = useState(0);
  const [upperLimit, setUpperLimit] = useState(1);
  const [mean, setMean] = useState(0.5);

  // const [datax, setDataX] = useState([0]);
  // const [datay, setDataY] = useState([0]);

  const [dateRange, setDates] = useState([]);

  // INIT CHART
  // useEffect(() => {
  //   // Llamar a asyncFetch inmediatamente al cargar el componente.
  //   asyncFetch();
  // }, [dataPath]);

  const [isFetching, setIsFetching] = useState(false);

  const onRangeChange = (date_values, dateStrings) => {
    console.log(date_values);
    setDates(date_values.map((item) => Math.round(item.valueOf() / 1000)));
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
          // Divide data.payload elementwise by mean
          const data2 = data.payload.map((item) => (100 * item) / mean);
          const { valoresX, valoresY } = getBellData(data2);
          setDataX(valoresX);
          setDataY(valoresY);
          console.log(valoresX);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const ChartOptions = {
    title: {
      text: "",
      align: "left",
    },
    tooltip: {
      valueDecimals: 2,
    },
    exporting: {
      enabled: false,
    },
    credits: {
      enabled: false,
    },
    // subtitle: {
    //   text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
    //   align: "left",
    // },

    yAxis: {
      title: {
        text: "",
      },
    },

    // xAxis: {
    //   accessibility: {
    //     rangeDescription: "Range: 2010 to 2020",
    //   },
    // },
    xAxis: {
      plotLines: [
        {
          color: "#FF0000", // Red
          width: 2,
          value: (100 * lowerLimit) / mean, // Position, you'll have to translate this to the values on your x axis
        },
        {
          color: "#00FF00", // Red
          width: 2,
          value: (100 * upperLimit) / mean, // Position, you'll have to translate this to the values on your x axis
        },
      ],
    },

    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },

    // plotOptions: {
    //   series: {
    //     label: {
    //       connectorAllowed: false,
    //     },
    //     pointStart: 2010,
    //   },
    // },
    plotOptions: {
      area: {
        fillOpacity: 0.5,
      },
    },

    series: [
      {
        name: "Curva Real",
        type: "area",
        color: "rgb(0,148,206)",
        data: datay.map((y1, i1) => [datax[i1], y1]),
        fillColor: "rgba(0,148,206,0.5)",
        fillOpacity: 0.5,
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <Fragment>
      <div className="flex flex-row justify-between">
        <strong className="text-gray-700 font-medium">{chartName}</strong>
      </div>

      <div className="mt-3 flex flex-1 text-xs ">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row justify-center gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <Bell options={ChartOptions} highcharts={Highcharts} />
        </ResponsiveContainer>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <div>
          <DatePickerComponent onRangeChange={onRangeChange} />
        </div>

        <RefreshButton onClickFunction={onClickFunction} />
      </div>
    </Fragment>
  );
}
