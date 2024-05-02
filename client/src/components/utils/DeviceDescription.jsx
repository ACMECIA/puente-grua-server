import React, { useState } from "react";
import { useEffect } from "react";
import { getHostPath } from "../../utils/host";
import useLocalStorage from "use-local-storage";

export default function Description({
  chartName,
  dataPath,
  dataRate = 10000,
  serverType,
}) {
  const [status, setStatus] = useLocalStorage(`${dataPath}`, false);
  const [description, setDescription] = useState([]); // [description, setDescription
  let isFetching = false;

  const fetchData = () => {
    if (!isFetching) {
      isFetching = true;
      fetch(getHostPath(dataPath))
        .then((res) => res.json())
        .then((data) => {
          console.log("data-status", data);
          setStatus(data);
          isFetching = false;
        })
        .catch((err) => {
          console.log(err.message);
          setStatus(false); // Valor por defecto
          isFetching = false;
        });
    }
  };

  const fetchDescription = () => {
    // if (!isFetching) {
    isFetching = true;
    fetch(`/api/${serverType}/status`)
      .then((res) => res.json())
      .then((data) => {
        console.log("fetchDesc", data);
        setDescription(data);

        isFetching = false;
      })
      .catch((err) => {
        console.log(err.message);
        setStatus(false); // Valor por defecto
        isFetching = false;
      });
    // }
  };

  useEffect(() => {
    // Ejecutar fetchData inicialmente
    fetchData();
    fetchDescription();

    // Configurar un intervalo para ejecutar fetchData cada 500 milisegundos
    const intervalId = setInterval(fetchData, dataRate);

    // Limpieza cuando el componente se desmonta
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-2 w-full">
      <strong className="text-gray-700 font-medium">{chartName}</strong>

      <div className="mt-10  mx-20   items-justify flex flex-col">
        {description.map((item, index) => (
          <div className="flex flex-row my-1" key={index}>
            <div className="flex flex-1 mr-10">{item.name}:</div>
            <div className="flex flex-1 ">{item.json}</div>
          </div>
        ))}

        <div className="flex flex-row my-1">
          <div className="flex flex-1 mr-10">Estatus: </div>
          <div className={`flex flex-1  ${status ? "text-green-700" : ""}`}>
            {status ? "Uso" : "No Uso"}
          </div>
        </div>

        <div className="flex flex-row m3-5">
          <div className="flex flex-1 mr-10">Horómetro: </div>
          <div className="flex flex-1 text-komatsu-blue text-xl">
            <Hourmeter dataRate={60000} dataPath={"hourmeter"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hourmeter({ dataPath, dataRate = 1000 }) {
  // const [minutes, setMinutes] = useLocalStorage(`${dataPath}`, 0);
  // const [hours, setHours] = useLocalStorage(`${dataPath}2`, 0);

  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const fetchData = () => {
      fetch(getHostPath(dataPath))
        .then((res) => res.json())
        .then((data) => {
          console.log("data-hourmeter", data);
          setMinutes(data.minutes);
          setHours(data.hours);
        })
        .catch((err) => {
          console.log(err.message);
          setMinutes(0); // Valor por defecto
          setHours(0); // Valor por defecto
        });
    };
    // Ejecutar fetchData inicialmente
    fetchData();

    // Configurar un intervalo para ejecutar fetchData cada 500 milisegundos
    const intervalId = setInterval(fetchData, dataRate);

    // Limpieza cuando el componente se desmonta
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Función para formatear los minutos y las horas con dos dígitos
  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <div className="flex flex-row">
      <div className="hour">
        <span id="hourDisplay">{formatTime(hours)}</span>
      </div>
      <div className="separator">:</div>
      <div className="minute">
        <span id="minuteDisplay">{formatTime(minutes)}</span>
      </div>
    </div>
  );
}
