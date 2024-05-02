import React, { Fragment } from "react";
import DatePickerComponent from "../charts/components/DatePicker";
import DownloadButton from "../charts/components/DownloadButton";
import { useState } from "react";

export default function DownloadData({ dataPath, serverType }) {
  const [dates, setDates] = useState([]);
  const onRangeChange = (date_values, dateStrings) => {
    console.log(date_values);
    if (date_values) {
      setDates(date_values.map((item) => Math.round(item.valueOf() / 1000)));
    } else {
      setDates([]);
    }

    console.log(dates);
  };
  return (
    <div className="py-10 px-5 space-y-2">
      <div className="flex flex-row justify-between">
        <strong className="text-gray-700 font-medium">Descarga de data</strong>
      </div>

      <div className="flex flex-row justify-center gap-4">
        <div>
          <DatePickerComponent onRangeChange={onRangeChange} />
        </div>

        <DownloadButton
          dateRange={dates}
          dataPath={dataPath}
          serverType={serverType}
        />

        {/* <RefreshButton /> */}
      </div>
    </div>
  );
}
