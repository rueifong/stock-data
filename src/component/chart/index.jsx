import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../../pages/echart-example/bar";
import BarStatisticsChart from "../../pages/echart-example/bar-statistics";
import BarLineChart from "../../pages/echart-example/bar-line";
import { Button, Select } from "antd";
import { StockSelector } from "../stock-selector";
import { api, defaultAxios } from "../../environment/api";
// import errorNotification from "../../utils/errorNotification";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const DisplayTickChart = ({ data = {} }) => {
  const [showType, setShowType] = useState("all");
  // console.log('test data', data);
  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <div>
          圖表模式
          <Select
            value={showType}
            style={{ width: 120, marginLeft: "20px" }}
            onChange={(value) => {
              setShowType(value);
            }}
            options={[
              {
                label: "全部",
                value: "all",
              },
              {
                label: "買賣五檔",
                value: "allfive",
              },
              {
                label: "買五檔",
                value: "buyfive",
              },
              {
                label: "賣五檔",
                value: "sellfive",
              },
            ]}
          />
        </div>
      </div>
      <BarChart originData={data} showType={showType} />
    </div>
  );
};

const DisplayChart = ({
  chartData,
}) => {
  return (
    <div>
      <DisplayTickChart data={chartData} />
      {/* {useMemo(() => {
        return <DisplayTickChart data={chartData} />;
      }, [chartData])} */}
    </div>
  );
};

export default DisplayTickChart;
