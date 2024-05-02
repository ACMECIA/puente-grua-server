import React from "react";
import { ResponsiveContainer } from "recharts";

import { Heatmap } from "@ant-design/plots";

import { useState } from "react";
import { useEffect } from "react";
import DatePickerComponent from "./components/DatePicker";
import RefreshButton from "./components/RefreshButton";
import layoutImage from "../images/layout.jpg";
import { getHostPath } from "../../utils/host";
import useLocalStorage from "use-local-storage";

export default function HeatMapAntChart({
  chartName,
  dataPath,
  dataRate = 10000,
}) {
  const [data, setData] = useLocalStorage(`${dataPath}`, []);
  const [dateRange, setDates] = useState([]);

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
      fetch(getHostPath(dataPath), {
        method: "POST",
        body: JSON.stringify({ dateRange }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setData(data);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  const DemoHeatmap = () => {
    // useEffect(() => {
    //   asyncFetch();
    // }, []);

    const config = {
      data,
      //   label: {
      //     fill: 'black',
      //   },
      // xAxis:{label: {
      //     style : {
      //         fill: '#000',

      //         }
      //     },
      // },

      // yAxis:{label: {
      //     style : {
      //         fill: '#000',

      //         }
      //     },
      // },
      xAxis: {
        min: 0,
        max: 75,
      },
      yAxis: {
        min: 0,
        max: 38,
      },

      type: "density",
      xField: "g",
      yField: "l",
      colorField: "tmp",
      // color:
      //   "#F51D27-#FA541C-#FF8C12-#FFC838-#FAFFA8-#80FF73-#12CCCC-#1890FF-#6E32C2",
      color:
        "#6E32C2-#1890FF-#12CCCC-#80FF73  -#FAFFA8-#FFC838-#FF8C12-#FA541C-#F51D27",
      legend: {
        // label: {
        //     style : {
        //         fill: '#000',

        //     }
        // },border-solid
        position: "bottom",
        rail: {
          // type:"size",
        },
      },
      annotations: [
        {
          type: "image",
          start: ["min", "max"],
          end: ["max", "min"],
          src: layoutImage,
        },
      ],
    };

    return <Heatmap {...config} />;
  };
  return (
    <div>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="mt-3 flex flex-1 text-xs">
        <ResponsiveContainer className={"relative"}>
          {isFetching && (
            <div className="absolute flex flex-row justify-center gap-4 items-center justify-center bg-white z-50 w-full h-full bg-opacity-70">
              Loading...
            </div>
          )}
          <DemoHeatmap />
        </ResponsiveContainer>
      </div>

      <FilterDates
        onRangeChange={onRangeChange}
        onClickFunction={onClickFunction}
      />
    </div>
  );
}

export function FilterDates({ onRangeChange, onClickFunction }) {
  return (
    <div className="flex flex-row justify-center gap-4">
      <div>
        <DatePickerComponent onRangeChange={onRangeChange} />
      </div>

      <RefreshButton onClickFunction={onClickFunction} />
    </div>
  );
}
