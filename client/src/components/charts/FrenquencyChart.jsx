import React, { Fragment } from "react";
import Plot from "react-plotly.js";
import { useState } from "react";

import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import { ResponsiveContainer } from "recharts";
// import useSessionStorage from "react-use-sessionstorage";
import useLocalStorage from "use-local-storage";
import { websiteColors } from "../lib/utils/colors";

var nombresMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

var stateNames = ["Uso", "No Uso"];

function generateTrace(hours, month, fInit, fEnd, state, sw) {
  // if (state == "init") {
  //   var colorT = "rgba(216,217,219,0.8)";
  //   var colorB = "rgba(98,106,106,1)";
  // }
  var colorT = websiteColors["komatsu-blue-a"];
  var colorB = websiteColors["komatsu-blue-a"];
  var stateName = stateNames[0];

  if (Number(state) === 1) {
    colorT = websiteColors["komatsu-blue-a"];
    colorB = websiteColors["komatsu-blue"];
    stateName = stateNames[0];
  }
  if (Number(state) === 0) {
    colorT = websiteColors["komatsu-gray-a"];
    colorB = "rgba(200,200,200,1)";
    stateName = stateNames[1];
  }
  //if (state =='Mantenimiento'){ var colorT = 'rgba(255,20,51,0.8)'; var colorB = 'rgba(255,20,51,1)';}

  var trace = {
    x: [hours],
    y: [month],
    name: stateName,
    orientation: "h",
    marker: {
      color: colorT,
      width: 1,
      line: {
        color: colorB,
        width: 2,
      },
    },
    type: "bar",
    showlegend: sw,
    text: ["<br><b>Inicio</b>: " + fInit + "<br><b>Fin</b>: " + fEnd],
    hovertemplate:
      "<b>" +
      stateName +
      "</b>" +
      "<br>" +
      "<br>" +
      "<b>Horas</b>: %{x:.2f}" +
      "<br>%{text}" +
      "<extra></extra>",
  };

  return trace;
}

function convertISOToReadableDateTime(isoDate) {
  const date = new Date(isoDate);
  const options = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formatter = new Intl.DateTimeFormat("es-ES", options);
  const formattedDateTime = formatter.format(date);

  return formattedDateTime;
}

//Initialize chart
// const fecha = new Date();
const mesActual = 3; //fecha.getMonth() + 1;
var mes_init = nombresMeses[mesActual];
//traceInitM = generateTrace(0.0001, mes_init, '000/00/00 00:00', '0000/00/00 00:00', 'Mantenimiento',true)//'2022/11/24 10:50:16'
var traceInitUE = generateTrace(
  0.0001,
  mes_init,
  "000/00/00 00:00",
  "0000/00/00 00:00",
  1,
  true
);
// var traceInitNU = generateTrace(
//   0.0001,
//   mes_init,
//   "000/00/00 00:00",
//   "0000/00/00 00:00",
//   "negativo",
//   true
// );
var traceInitUC = generateTrace(
  0.0001,
  mes_init,
  "000/00/00 00:00",
  "0000/00/00 00:00",
  0,
  true
);
var data_init = [traceInitUE, traceInitUC]; //,traceInitM];

export default function FrenquencyChart({
  dataPath,
  chartName,
  dataRate,
  serverType,
}) {
  const [data_chart, setData] = useLocalStorage(`${dataPath}`, data_init);
  // const [data_chart, setData] = useState(data_init);

  // const [data_chart, setData] = useState(data_init);
  const [isFetching, setIsFetching] = useState(false);

  const onClickFunction = () => {
    fetchData();
  };

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          var trace = [];
          for (var i = 0; i < data_init.length; i++) {
            trace.push(data_init[i]); // Copia los datos existentes de data_init
          }
          // trace = [...data_init];
          for (var i = 0; i < data.payload.length; i++) {
            var traceAdd = generateTrace(
              data.payload[i].hours,
              data.payload[i].month,
              convertISOToReadableDateTime(data.payload[i].fInit),
              convertISOToReadableDateTime(data.payload[i].fEnd),
              data.payload[i].state,
              false
            );
            trace.push(traceAdd);
          }
          setData(trace);
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

  //   // Configurar un intervalo para ejecutar fetchData cada 500 milisegundos
  //   // const intervalId = setInterval(fetchData, dataRate);

  //   // // Limpieza cuando el componente se desmonta
  //   // return () => {
  //   //   clearInterval(intervalId);
  //   // };
  // }, []);

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="overflow:hidden w-full h-full ">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <PlotlyChart data={data_chart} />
        </ResponsiveContainer>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <RefreshButton onClickFunction={onClickFunction} />
      </div>
    </Fragment>
  );
}

function PlotlyChart({ data }) {
  return (
    <Plot
      data={data}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      layout={{
        //title: 'FRECUENCIA DE USO MENSUAL',
        // height: 350,  // HERE IS THE IMPORTANT
        // width: "100%",
        barmode: "stack",
        xaxis: {
          title: {
            text: "Horas (h)",
          },
        },
        showlegend: true,
        legend: { orientation: "v" },
        hovermode: "closest",
        hoverlabel: {
          align: "left",
          bordercolor: "#000",
          font: {
            color: "#000",
            family: "Times New Roman",
            size: 15,
          },
        },

        //hoverlabel: { bgcolor: "#FFF" }
      }}
      // config={{ responsive: false }}
      config={{ responsive: true, displayModeBar: false }}
    />
  );
}
