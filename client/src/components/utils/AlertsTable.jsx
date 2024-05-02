import React from "react";
import { Checkbox } from "antd";
import { Select } from "antd";
import useLocalStorage from "use-local-storage";
import { useState } from "react";
import { useEffect } from "react";
import { Input } from "antd";

import { getHostPath } from "../../utils/host";

// import getOrderStatus from "./lib/utils";
const recentMaintenance = [
  {
    id: "1",
    fecha: "05/01/2023",
    hora: "18:42",
    tipo_alerta: "Batería baja",
    cod_activo: "KM061657",
    horometro: "125",
    tonelaje: "4.5",
    tipo_mantenimiento: "",
    checklist: "",
    comentarios: "",
  },
  {
    id: "2",
    fecha: "04/01/2023",
    hora: "09:42",
    tipo_alerta: "Mantenimiento - Fin",
    cod_activo: "KM061657",
    horometro: "125",
    tonelaje: "4.5",
    tipo_mantenimiento: "",
    checklist: <Checkbox />,
    comentarios: "Mtto 125 planificado",
  },

  {
    id: "3",
    fecha: "03/01/2023",
    hora: "06:30",
    tipo_alerta: "Mantenimiento - Inicio",
    cod_activo: "KM061657",
    horometro: "125",
    tonelaje: "4.5",
    tipo_mantenimiento: <SelectState label={"Tipo mantenimiento"} />,
    checklist: <Checkbox />,
    comentarios: "Mtto 125 planificado",
  },
];

export default function AlertsTable({ tableName, serverType, dataPath }) {
  // const [data, setData] = useLocalStorage(`${dataPath}`, []);
  const [data, setData] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  // const [heatFilters, setHeatFilters] = useState({});

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.payload);
          console.log(dataHandling(data.payload));
          setData(dataHandling(data.payload));

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
    <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
      <strong className="text-gray-700 font-medium">{tableName}</strong>
      <div className="mt-3">
        <table className="w-full text-grey-700 border-x border-gray-200 rounded-sm">
          <thead>
            <tr>
              <td className="text-center">Fecha</td>
              <td className="text-center">Hora</td>
              <td className="text-center">Tipo de Alerta</td>
              <td className="text-center">Cod. Activo</td>
              <td className="text-center">Horómetro</td>
              <td className="text-center">Tonelaje</td>
              <td className="text-center">Tipo de Mantenimiento</td>
              <td className="text-center">Comentarios</td>
              <td className="text-center">Checklist</td>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td className="text-center">{row.date}</td>
                <td className="text-center">{row.hora}</td>
                <td className="text-center">{row.tipo_alerta}</td>
                <td className="text-center">{row.cod_activo}</td>
                <td className="text-center">{row.horometro}</td>
                <td className="text-center">{row.tonelaje}</td>
                <td className="text-center">{row.tipo_mantenimiento}</td>
                <td className="text-center">{row.comentarios}</td>
                <td className="text-center">{row.checklist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SelectState({ label, width, value, defaultValue, rowId, checkValue }) {
  const handleChange = (val) => {
    let current = value ? [...value] : "";
    current = val;
    // onChange(current);
    handleMaintenanceTypeChange(current, rowId);
  };

  return (
    <Select
      placeholder={label}
      defaultValue={defaultValue}
      style={{ width: width }}
      disabled={checkValue}
      onChange={handleChange}
      // onChange={(event) => handleMaintenanceTypeChange(event, rowId)}
      // disabled={true}
      options={[
        { value: "correctivo", label: "Correctivo" },
        { value: "preventivo", label: "Preventivo" },
      ]}
    />
  );
}

function dataHandling(dataIn) {
  const dataOut = dataIn.map((row) => ({
    id: row.id,
    // Get fecha from row.date (date is timestamp, and i need the date only)
    date: convertISOToReadableDate(row.date),
    hora: convertISOToReadableHour(row.date),
    tipo_alerta: alertTypes[row.alert_type],
    cod_activo: row.code_device,
    horometro: row.hourmeter,
    tonelaje: row.ton,
    tipo_mantenimiento: handleMaintenanceType(
      row.mant_type,
      row.id,
      row.checklist
    ),
    checklist: handleChecklist(row.checklist, row.mant_type, row.id),
    comentarios: handleComments(
      row.comments,
      row.id,
      row.mant_type,

      row.checklist
    ),
  }));

  return dataOut;
}

function convertISOToReadableDate(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }
  const dateStr = `${day}/${month}/${year}`;

  return `${dateStr}`;
}
function convertISOToReadableHour(timestamp) {
  const date = new Date(timestamp);

  let hour = date.getHours();
  let minutes = date.getMinutes();

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const timeStr = `${hour}:${minutes}`;

  return `${timeStr}`;
}

function handleMaintenanceType(currentValue, rowId, checklist) {
  let typesArray = ["preventivo", "correctivo"];
  if (typesArray.includes(currentValue)) {
    return (
      <SelectState
        label={"Tipo mantenimiento"}
        defaultValue={currentValue}
        checkValue={checklist}
        rowId={rowId}
      ></SelectState>
    );
  } else {
    return;
  }
}

function handleChecklist(checkValue, mantType, rowId) {
  const onChange = (e) => {
    console.log(`checked = ${e.target.checked}`);
    checkValue = e.target.checked;
    handleChecklistChange(e, rowId);
  };

  if (mantType === "mant-end") {
    return;
  } else {
    return (
      <Checkbox
        defaultChecked={checkValue}
        disabled={checkValue}
        onChange={onChange}
      />
    );
  }
}

function handleComments(comments, rowId, mantType, checklist) {
  console.log("MATENIMIENTO", mantType);
  // console.log(mantType === "mant-end");
  // console.log("no comments");
  if (mantType === "mant-end") {
    return;
  } else {
    return (
      <Input
        defaultValue={comments}
        disabled={checklist}
        onChange={(event) => handleCommentsChange(event, rowId)}
      />
    );
  }
}

const alertTypes = [
  "Batería baja",
  "Mantenimiento - Inicio",
  "Mantenimiento - Fin",
  "Mantenimiento preventivo 1",
  "Mantenimiento preventivo 2",
  "Mantenimiento preventivo 3",
];

function handleMaintenanceTypeChange(value, id) {
  const newMaintenanceType = value;
  // console.log(newMaintenanceType, id);

  // Call your server function to update the database
  updateDatabase(id, { maintenanceType: newMaintenanceType });
}

function handleChecklistChange(event, id) {
  const newCheckValue = event.target.checked;
  console.log(newCheckValue, id);

  // Call your server function to update the database
  updateDatabase(id, { checklist: newCheckValue });
  console.log("Check value", newCheckValue);

  if (newCheckValue) {
    disableAlertWarning();
  } else {
    enableAlertWarning();
  }
}

function handleCommentsChange(event, id) {
  const newComments = event.target.value;
  // console.log(newComments, id);

  // Call your server function to update the database
  updateDatabase(id, { comments: newComments });
}

function updateDatabase(id, updatedValues) {
  fetch(`/api/alerts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedValues),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function disableAlertWarning() {
  fetch(`/api/alerts/statusoff`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch(getHostPath("alertflagoff"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

function enableAlertWarning() {
  fetch(`/api/alerts/statuson`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  fetch(getHostPath("alertflagon"), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}
