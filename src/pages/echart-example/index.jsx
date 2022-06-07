import React, { useEffect, useRef, useState } from "react";
import Candlestick from "./candlestick";
import BarChart from "./bar";
import BarLineChart from "./bar-line";

const EchartExample = () => {
  return (
    <div>
      <Candlestick />
      <BarChart
        data={{
          100: 15,
          102: 11,
          108: 23,
          109: 2,
          111: 12,
        }}
      />
      <BarLineChart />
    </div>
  );
};

export default EchartExample;
