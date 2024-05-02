import React from "react";

import { Fragment } from "react";

import Clock from "../utils/Clock";
import { GoAlert } from "react-icons/go";
import { useState, useEffect } from "react";

export default function Header() {
  return (
    <div className="bg-komatsu-gray h-16 px-4 flex justify-between items-center border-b border-gray-200">
      <div>
        <DeviceSchedule />
      </div>

      <div>
        <Clock />
      </div>

      <div className="flex items-center gap-2 mr-2"></div>
    </div>
  );
}

export function DeviceSchedule({
  dataPath = "schedule",
  chartName,
  serverType = "settings",
}) {
  const [edit, setEdit] = useState(false);
  const [weekdays, setWeekdays] = useState([0, 1, 1, 1, 1, 1, 0]);
  const [initHour, setInitHour] = useState(8);
  const [endHour, setEndHour] = useState(18);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = () => {
    if (!isFetching) {
      setIsFetching(true);
      fetch(`api/${serverType}/${dataPath}`)
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setWeekdays(data.weekdays);
          setInitHour(data.initHour);
          setEndHour(data.endHour);
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

  const onEdit = () => {
    setEdit(true);
  };

  return (
    <Fragment>
      <strong className="text-gray-700 font-medium">{chartName}</strong>
      <div className="overflow:hidden w-full h-full p-4">
        <CurrentSchedule
          onEdit={onEdit}
          weekdays={weekdays}
          initHour={initHour}
          endHour={endHour}
        />
      </div>
    </Fragment>
  );
}

export function CurrentSchedule({ onEdit, weekdays, initHour, endHour }) {
  const days = ["D", "L", "M", "M", "J", "V", "S"];

  const endHour_hour = Math.floor(endHour);
  const endHour_minutes = Math.round((endHour - endHour_hour) * 60);
  const initHour_hour = Math.floor(initHour);
  const initHour_minutes = Math.round((initHour - initHour_hour) * 60);

  // Format hours and minutes

  return (
    <Fragment>
      <div className="pb-4 flex flex-row">
        <div className="flex justify-center gap-4 mt-4">
          <ul className="flex flex-row justify-center gap-4 list-none flex-wrap">
            {days.map((day, index) => (
              <li
                key={index}
                className={`w-9 h-9 flex items-center justify-center rounded-full select-none ${
                  weekdays[index] ? "bg-komatsu-blue text-white" : "bg-gray-50"
                }`}
              >
                {day}
              </li>
            ))}
          </ul>
        </div>

        <div className="justify-center align-middle mt-10 ml-6">
          Horario: {initHour_hour < 10 ? "0" + initHour_hour : initHour_hour}:
          {initHour_minutes < 10 ? "0" + initHour_minutes : initHour_minutes} -{" "}
          {endHour_hour < 10 ? "0" + endHour_hour : endHour_hour}:
          {endHour_minutes < 10 ? "0" + endHour_minutes : endHour_minutes}
        </div>
      </div>
    </Fragment>
  );
}
