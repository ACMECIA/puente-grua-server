import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import mapIcon from "../images/placeholder.png";
import { Icon } from "leaflet";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { getHostPath } from "../../utils/host";
import useLocalStorage from "use-local-storage";
import "leaflet/dist/leaflet.css";
export default function DeviceLocation({
  chartName,
  dataPath,
  dataRate = 10000,
}) {
  const [data, setData] = useLocalStorage(`${dataPath}`, 0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(getHostPath(dataPath))
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

  useEffect(() => {
    fetchData();

    // Configurar un intervalo para ejecutar fetchData cada 500 milisegundos
    const intervalId = setInterval(fetchData, dataRate);

    // Limpieza cuando el componente se desmonta
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 h-full">
      <strong className="text-gray-700 font-medium"> {chartName}</strong>
      <div className="mt-3 relative w-full flex h-full pb-5">
        <Map position={data} />
      </div>
    </div>
  );
}

function Map({ position = [-12.142218, -76.99065] }) {
  // Comprobar si position es un array con dos elementos
  if (!Array.isArray(position) || position.length !== 2) {
    position = [-12.142218, -76.99065];
  }

  const iconMap = new Icon({
    iconUrl: mapIcon,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  return (
    <MapContainer
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "none",
        maxWidth: "none",
        zIndex: 10,
        position: "absolute",
        top: 0,
        left: 0,
      }}
      center={[-12.0472533, -77.1002881]}
      zoom={18}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={iconMap}>
        <Popup>Montacarga</Popup>
      </Marker>
    </MapContainer>
  );
}
