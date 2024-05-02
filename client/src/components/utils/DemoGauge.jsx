import { Gauge } from "@ant-design/plots";
import { ResponsiveContainer } from "recharts";

import { useRef, useState } from "react";
import { useEffect } from "react";
import { getHostPath } from "../../utils/host";
import useLocalStorage from "use-local-storage";

export default function DemoGauge({
  chartName,
  dataPath,
  dataRate = 10000,
  gaugeUnit = "%",
  maxValue = 1,
  gaugeColors = ["#30BF78", "#FAAD14", "#F4664A"],
  gaugeTicks = [0, 1 / 3, 2 / 3, 1],
}) {
  const [data, setData] = useLocalStorage(`${dataPath}`, 0);
  const [dateRange, setDates] = useState([]);
  const ref = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(getHostPath(dataPath))
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          setData(data / maxValue);
          setIsFetching(false);

          // setPosts(data);
        })
        .catch((err) => {
          console.log(err.message);
          setIsFetching(false);
        });
    }
  };

  useEffect(() => {
    fetchData();

    // Configurar un intervalo para ejecutar fetchData cada 500 milisegundos
    const intervalId = setInterval(fetchData, dataRate);

    // Limpieza cuando el componente se desmonta
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.changeData(data);
    console.log("data: ", data);
  }, [data, ref.current]);

  const config = {
    percent: data,
    range: {
      ticks: gaugeTicks,
      color: gaugeColors,
    },
    axis: {
      label: {
        formatter(v) {
          return Number(v) * maxValue;
        },
      },
      subTickLine: {
        count: 3,
      },
    },
    indicator: {
      pointer: {
        style: {
          stroke: "#D0D0D0",
        },
      },
      pin: {
        style: {
          stroke: "#D0D0D0",
        },
      },
    },
    statistic: {
      content: {
        formatter: ({ percent }) =>
          `${(percent * maxValue).toFixed(2)} ${gaugeUnit}`,
        style: {
          fontSize: 25,
          lineHeight: 1,
        },
      },
    },
  };
  return (
    <div>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="mt-3 flex flex-1 text-xs">
        <ResponsiveContainer className={"relative"}>
          <Gauge {...config} chartRef={ref} />
        </ResponsiveContainer>
      </div>
    </div>
  );
}
