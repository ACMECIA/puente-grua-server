import React, { useEffect, useRef } from "react";
import HighchartsReact from "highcharts-react-official";

const Bell = ({ options, highcharts, onStart }) => {
  return (
    <HighchartsReact
      highcharts={highcharts}
      constructorType={"chart"}
      options={options}
      callback={onStart}
    />
  );
};
export default Bell;
