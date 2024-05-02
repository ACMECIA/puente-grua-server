import React, { Fragment } from "react";
import Bell from "./highcharts/Bell";
import Highcharts from "highcharts/highstock";
import { ResponsiveContainer } from "recharts";
import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import { useState } from "react";

import useLocalStorage from "use-local-storage";

import { Histogram } from "@ant-design/plots";
import { websiteColors } from "../lib/utils/colors";

export default function HistogramChart({
  chartName,
  dataPath,
  serverType = "charts",
  binWidth = 0.1,
}) {
  const [data, setData] = useLocalStorage(`${dataPath}`, [0]);

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
          // Divide data.payload elementwise by mean
          console.log(data.payload);
          setData(data.payload);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const config = {
    data,
    xAxis: {
      title: {
        visible: true,
        text: "Cargas (Ton.)",
      },
    },
    yAxis: {
      // disable yAxis
      visible: false,
    },

    binField: "load",
    binWidth: binWidth,
    color: websiteColors["komatsu-blue"],

    tooltip: {
      formatter: (datum) => {
        // Redondear los valores en el tooltip
        const roundedCount = datum.count;
        const total = data.length;
        const percentage = ((roundedCount / total) * 100).toFixed(2);

        const roundedRange = datum.range.map(
          (value) => Math.round(value * 100) / 100
        );

        return {
          name: "Cuenta",
          // value: `${roundedCount} (${percentage}%)`,
          value: `${percentage}%`,
          title: roundedRange,
        };
      },
    },
  };
  return (
    <Fragment>
      <div className="flex flex-row justify-between">
        <strong className="text-gray-700 font-medium">{chartName}</strong>
      </div>

      <div className="mt-3 flex flex-1 text-xs mb-5">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <Histogram {...config} />
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
