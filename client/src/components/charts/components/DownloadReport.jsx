import { Button } from "antd";
import React, { Fragment } from "react";
import { ConfigProvider } from "antd";
import { useState } from "react";
import { websiteColors } from "../../lib/utils/colors";
import { getHostPath } from "../../../utils/host";

function downloadCSV(csv, filename) {
  var csvFile;
  var downloadLink;

  //define the file type to text/csv
  csvFile = new Blob([csv], { type: "text/csv" });
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function downloadPDF(pdfBase64, filename) {
  const pdf = base64ToArrayBuffer(pdfBase64);
  const pdfFile = new Blob([pdf], { type: "application/pdf" });
  var downloadLink = document.createElement("a");

  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(pdfFile);
  downloadLink.style.display = "none";

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function base64ToArrayBuffer(base64) {
  var binaryString = window.atob(base64);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export default function DownloadReport({ dataPath, dateMonth, width = "25%" }) {
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async () => {
    if (!isFetching) {
      try {
        setIsFetching(true);

        const response = await fetch(getHostPath(dataPath), {
          method: "POST",
          body: JSON.stringify({ dateMonth }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 204) {
          alert("No hay datos en el rango de fechas seleccionado");
          setIsFetching(false);
          return;
        }

        const data = await response.json();

        downloadPDF(data.data, data.filename);
        setIsFetching(false);
      } catch (err) {
        console.log(err);
        setIsFetching(false);
      }
    }
  };
  // Ejecutar fetchData inicialmente

  const onClickFunction = () => {
    // console.log("copntent", dateMonth);
    if (dateMonth.target_year) {
      console.log(dateMonth);
      fetchData();
      return;
    } else {
      alert("Seleccione un rango de fechas");
    }

    // alert("Descargando datos...");
  };

  return (
    <Fragment>
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: websiteColors["komatsu-blue-h"],
          },
        }}
      >
        <Button
          type="primary"
          onClick={onClickFunction}
          style={{ width: width }}
        >
          {isFetching ? <div>Descargando...</div> : "Descargar"}
        </Button>
      </ConfigProvider>
    </Fragment>
  );
}
