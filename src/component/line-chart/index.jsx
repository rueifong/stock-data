import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../../pages/echart-example/bar";
import BarStatisticsChart from "../../pages/echart-example/bar-statistics";
import LineChart from "../../pages/echart-example/line";
import { Button, Select } from "antd";
import { StockSelector } from "../stock-selector";
import { api, defaultAxios } from "../../environment/api";
// import errorNotification from "../../utils/errorNotification";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const check = (...arg) => {
  if (false) {
    // console.log(...arg);
  }
};

const getChartData = (
  stockId,
  dateFormat,
  latestTimeChartTime,
  latestStatisticsChartTime
) => {
  return Promise.all([
    defaultAxios({
      url: api.getDisplay.url,
      method: api.getDisplay.method,
      params: {
        stockId,
        isGetLatest: true,
      },
    }),
  ]);
};

const DisplayTimeChart = ({ data = {} }) => {
  const [showType, setShowType] = useState("all");
  // console.log('test data', data);
  // console.log('=?????????', data);
  return (
    <>
      <LineChart originData={data} />
    </>
  );
};

const DisplayLineChart = ({
  chartData,
  // onStockIdChange,
  stock,
  isResetChart,
  setIsResetChart,
}) => {
  //chart status
  const [isRunning, setIsRunning] = useState(true);
  const [frequency, setFrequency] = useState(1);
  const interval = useRef();

  //query state
  const [stockId, setStockId] = useState();
  const [dateFormat, setDateFormat] = useState(4);
  const [latestTimeChartTime, setLatestTimeChartTime] = useState();
  const [latestStatisticsChartTime, setLatestStatisticsChartTime] = useState();

  // chart data
  const [tickChartData, setTickChartData] = useState({});

  const clearInterval = () => {
    if (interval.current) window.clearInterval(interval.current);
    interval.current = undefined;
  };

  const resetChart = () => {
    setTickChartData({});
    setLatestTimeChartTime(undefined);
    setLatestStatisticsChartTime(undefined);
  };

  useEffect(() => {
    resetChart();
    check("----");
  }, [stock, stockId, dateFormat]);

  useEffect(() => {
    if (isResetChart) {
      resetChart();
      setIsResetChart(false);
    }
  }, [isResetChart, setIsResetChart]);

  const handleInterval = useCallback(() => {
    check(
      (stock && stock.id) || stockId,
      dateFormat,
      interval.current,
      latestTimeChartTime,
      latestStatisticsChartTime
    );
    getChartData(
      (stock && stock.id) || stockId,
      dateFormat,
      latestTimeChartTime,
      latestStatisticsChartTime
    )
      .then(
        ([
          { data: tickChartData },
        ]) => {
          // tick chart
          // console.log('?????????', chartData);
          setTickChartData(tickChartData);
        }
      )
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, [
    stock,
    stockId,
    dateFormat,
    latestTimeChartTime,
    latestStatisticsChartTime,
  ]);

  useEffect(() => {
    clearInterval();

    if (isRunning) {
      interval.current = setInterval(() => {
        handleInterval();
      }, 1000 * frequency);
    }

    return () => {
      clearInterval();
    };
  }, [handleInterval, isRunning, frequency]);

  return (
    <div>
      {useMemo(() => {
        return <>
          <DisplayTimeChart data={chartData} />
        </>;
      }, [tickChartData])}
      <div className="flex justify-around my-6 items-center">
        {/* <div className="w-1/6" style={{ display: stock ? "none" : undefined }}>
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              onStockIdChange && onStockIdChange(e);
              setStockId(e);
            }}
          />
        </div> */}
        {/* <Button
          type="primary"
          onClick={() => setIsRunning(true)}
          >
          開始播放
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          暫停播放
        </Button> */}
        {/* <div>
          圖表更新頻率
          <Select
            className="w-20 ml-2"
            value={frequency}
            options={[
              { value: 60, label: "1m" },
              { value: 10, label: "10s" },
              { value: 5, label: "5s" },
              { value: 1, label: "1s" },
              { value: 0.5, label: "0.5s" },
            ]}
            onChange={(val) => {
              setFrequency(val);
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

export default DisplayTimeChart;
