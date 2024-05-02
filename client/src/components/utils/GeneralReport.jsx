import React, { Fragment } from "react";
import MonthPickerComponent from "../charts/components/MonthPicker";
import { useState } from "react";
import DownloadReport from "../charts/components/DownloadReport";

export default function GeneralReport({ dataPath, serverType }) {
  const [date, setDate] = useState({});
  const onDateChange = (date_values, dateStrings) => {
    console.log("date_values", date_values);
    if (date_values) {
      setDate({ target_month: date_values.$M, target_year: date_values.$y });
    } else {
      setDate({});
    }

    console.log("date_values", date);
  };
  return (
    <div className="py-10 px-5 space-y-2">
      <div className="flex flex-row justify-between">
        <strong className="text-gray-700 font-medium">Reporte General</strong>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <div>
          <MonthPickerComponent onChange={onDateChange} />
        </div>

        <DownloadReport
          dateMonth={date}
          dataPath={dataPath}
          serverType={serverType}
        />

        {/* <RefreshButton /> */}
      </div>
    </div>
  );
}
