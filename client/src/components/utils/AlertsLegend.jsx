import React, { Fragment } from "react";

import { useState, useEffect } from "react";

const AlertsLegend = ({ serverType, dataPath }) => {
  const [data, setData] = useState({});

  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("leyendaaa", data.payload);

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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="font-sans text-black ml-6">
      <div className="mb-4">Leyenda de alertas</div>
      <ul className="list-disc pl-4 mb-2 text-black ">
        <li>
          <span className="text-komatsu-blue">Mantenimiento preventivo 1</span>:{" "}
          {data.prev1} horas
        </li>
        <li>
          <span className="text-komatsu-blue-light">
            Mantenimiento preventivo 2
          </span>
          : {data.prev2} horas
        </li>
        <li>
          <span className="text-gray-600">Mantenimiento preventivo 3</span>:{" "}
          {data.prev3} horas
        </li>
      </ul>
    </div>
  );
};

export default AlertsLegend;
