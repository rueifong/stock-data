import React, { useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import DisplayChart from "../../component/chart/display-chart";
import Simulator from "../simulator";

const ReplayChart = () => {
  const [replayStockId, setReplayStockId] = useState();
  const [isResetChart, setIsResetChart] = useState(false);

  return (
    <div>
      {/* <DisplayChart
        isResetChart={isResetChart}
        setIsResetChart={setIsResetChart}
        stock={replayStockId ? { id: replayStockId } : {}}
      /> */}
      <Simulator
        onReset={() => {
          setIsResetChart(true);
        }}
        customResetStock={async (stockId) => {
          const { url, method } = api.resetStock;
          return await defaultAxios({
            url,
            method,
            data: { id: stockId, isReset: false },
          }).then(({ data }) => {
            setReplayStockId(data.display.stockId);
            return data.display.stockId;
          });
        }}
      />
    </div>
  );
};

export default ReplayChart;
