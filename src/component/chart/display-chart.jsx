import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BarChart from "../../pages/echart-example/bar";
import BarStatisticsChart from "../../pages/echart-example/bar-statistics";
import BarLineChart from "../../pages/echart-example/bar-line";
import { Button, Select } from "antd";
import { StockSelector } from "../stock-selector";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";

const check = (...arg) => {
  if (false) {
    console.log(...arg);
  }
};

const getChartData = (
  stockId,
  dateFormat,
  latestTimeChartTime,
  // latestStatisticsChartTime
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
    defaultAxios({
      url: api.getDisplayChart.url,
      method: api.getDisplayChart.method,
      params: {
        stockId,
        dateFormat,
        createdTime:
          latestTimeChartTime &&
          JSON.stringify({
            min: new Date(latestTimeChartTime).toISOString(),
          }),
      },
    }),
    // defaultAxios({
    //   url: api.getDisplay.url,
    //   method: api.getDisplay.method,
    //   params: {
    //     stockId,
    //     createdTime:
    //       latestStatisticsChartTime &&
    //       JSON.stringify({
    //         min: new Date(latestStatisticsChartTime).toISOString(),
    //       }),
    //     order: JSON.stringify({ order: "ASC", orderBy: "createdTime" }),
    //   },
    // }),
  ]);
};

const DisplayTimeChart = ({
  data = { xAxis: [], price: [], quantity: [] },
  onDateFormatChange,
}) => {
  return (
    <div>
      <BarLineChart
        data={data}
        onDateFormatChange={(v) => {
          onDateFormatChange && onDateFormatChange(v);
        }}
      />
    </div>
  );
};

const DisplayStatisticsChart = ({
  data = { xAxis: [], quantity: [], type: "" },
  onDateFormatChange,
}) => {
  return (
    <div>
      <BarStatisticsChart
        data={data}
        onDateFormatChange={(v) => {
          onDateFormatChange && onDateFormatChange(v);
        }}
      />
    </div>
  );
};
const DisplayTickChart = ({ data = {} }) => {
  const [showType, setShowType] = useState("all");
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

const DisplaySplitChart = ({ data = [] }) => {
  const option = {
    xAxis: {
      type: "category",
      data: data.map((v) => v.x),
      axisLabel: {
        formatter: (value, index) => {
          const day = dayjs(value).format("HH:mm:ss");
          return day;
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data.map((v) => v.y),
        type: "line",
      },
    ],
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
  };
  return <ReactECharts option={option} />;
};

const DisplayChart = ({
  onStockIdChange,
  stock,
  isResetChart,
  setIsResetChart,
}) => {
  //chart status
  const [isRunning, setIsRunning] = useState(false);
  const [frequency, setFrequency] = useState(1);
  const interval = useRef();

  //query state
  const [stockId, setStockId] = useState();
  const [dateFormat, setDateFormat] = useState(4);
  const [latestTimeChartTime, setLatestTimeChartTime] = useState();
  // const [latestStatisticsChartTime, setLatestStatisticsChartTime] = useState();

  // chart data
  const [tickChartData, setTickChartData] = useState({});
  const [timeChartData, setTimeChartData] = useState([]);
  // const [statisticsChartData, setStatisticsChartData] = useState([]);
  const [splitChartData, setSplitChartData] = useState([]);

  const clearInterval = () => {
    if (interval.current) window.clearInterval(interval.current);
    interval.current = undefined;
  };

  const resetChart = () => {
    setTickChartData({});
    setTimeChartData([]);
    // setStatisticsChartData([]);
    setSplitChartData([]);
    setLatestTimeChartTime(undefined);
    // setLatestStatisticsChartTime(undefined);
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
      // latestStatisticsChartTime
    );
    getChartData(
      (stock && stock.id) || stockId,
      dateFormat,
      latestTimeChartTime,
      // latestStatisticsChartTime
    )
      .then(
        ([
          { data: tickChartData },
          { data: _timeChartData },
          // { data: _statisticsChart },
        ]) => {
          // tick chart
          setTickChartData(tickChartData);

          // time chart
          const newTimeChartData = JSON.parse(JSON.stringify(timeChartData));
          if (_timeChartData.length) {
            _timeChartData.forEach(({ originCreatedTime, ...timeChart }) => {
              const LENGTH = newTimeChartData.length;
              if (
                LENGTH &&
                newTimeChartData[LENGTH - 1].xAxis === timeChart.createdTime
              ) {
                newTimeChartData[LENGTH - 1] = {
                  xAxis: timeChart.createdTime,
                  price: timeChart.close,
                  quantity:
                    timeChart.quantity + newTimeChartData[LENGTH - 1].quantity,
                  buy: timeChart.firstOrderBuy,
                  sell: timeChart.firstOrderSell,
                };
              } else {
                newTimeChartData.push({
                  xAxis: timeChart.createdTime,
                  price: timeChart.close,
                  quantity: timeChart.quantity,
                  buy: timeChart.firstOrderBuy,
                  sell: timeChart.firstOrderSell,
                });
              }
              if (originCreatedTime) {
                setLatestTimeChartTime(
                  new Date(originCreatedTime).getTime() + 1
                );
              }
            });
            setTimeChartData(newTimeChartData);
            // setStatisticsChartData(newTimeChartData);
            // split chart
            setSplitChartData(
              newTimeChartData.slice(-10).map(({ buy, sell, xAxis }) => {
                return {
                  x: xAxis,
                  y: sell - buy,
                };
              })
            );
          }

          // statistics chart
          // const _statisticsChartData = _statisticsChart.content;
          // const newStatisticsChartData = JSON.parse(
          //   JSON.stringify(statisticsChartData)
          // );
          // if (_statisticsChartData.length) {
          //   _statisticsChartData.forEach((statisticsChart, index, arr) => {
          //     const LENGTH = newStatisticsChartData.length;
          //     if (
          //       LENGTH &&
          //       newStatisticsChartData[LENGTH - 1].xAxis ===
          //         statisticsChart.createdTime
          //     ) {
          //       newStatisticsChartData[LENGTH - 1] = {
          //         xAxis: statisticsChart.createdTime,
          //         fiveTickRange: statisticsChart.fiveTickRange,
          //         marketBuyQuantity: statisticsChart.marketBuyQuantity,
          //         marketSellQuantity: statisticsChart.marketSellQuantity,
          //       };
          //     } else {
          //       newStatisticsChartData.push({
          //         xAxis: statisticsChart.createdTime,
          //         fiveTickRange: statisticsChart.fiveTickRange,
          //         marketBuyQuantity: statisticsChart.marketBuyQuantity,
          //         marketSellQuantity: statisticsChart.marketSellQuantity,
          //       });
          //     }
          //     if (arr.length - 1 === index && statisticsChart.createdTime) {
          //       setLatestStatisticsChartTime(
          //         new Date(statisticsChart.createdTime).getTime() + 1
          //       );
          //     }
          //   });
          //   setStatisticsChartData(newStatisticsChartData);
          // }
        }
      )
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, [
    stock,
    stockId,
    dateFormat,
    timeChartData,
    // statisticsChartData,
    latestTimeChartTime,
    // latestStatisticsChartTime,
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
        return <DisplayTickChart data={tickChartData} />;
      }, [tickChartData])}
      {/* {useMemo(() => {
        return (
          <DisplayTimeChart
            data={timeChartData.reduce(
              (p, v) => {
                const { xAxis, price, quantity, buy, sell } = v;
                p.xAxis.push(xAxis);
                p.price.push(price);
                p.quantity.push(quantity);
                p.buy.push(buy);
                p.sell.push(sell);
                return p;
              },
              {
                xAxis: [],
                price: [],
                quantity: [],
                buy: [],
                sell: [],
              }
            )}
            onDateFormatChange={(v) => {
              setDateFormat(v);
            }}
          />
        );
      }, [timeChartData])} */}
      {/* {useMemo(() => {
        return <DisplaySplitChart data={splitChartData} />;
      }, [splitChartData])} */}
      {/* {useMemo(() => {
        return (
          <div className="flex justify-around mt-3 mb-0 items-center">
            <div className="w-1/2">
              <DisplayStatisticsChart
                data={statisticsChartData.reduce(
                  (p, v) => {
                    const {
                      xAxis,
                      // quantity,
                      fiveTickRange,
                      marketBuyQuantity,
                      marketSellQuantity,
                    } = v;
                    p.xAxis.push(xAxis);
                    p.quantityB1.push(fiveTickRange[5].buyQuantity);
                    p.quantityB2.push(fiveTickRange[6].buyQuantity);
                    p.quantityB3.push(fiveTickRange[7].buyQuantity);
                    p.quantityB4.push(fiveTickRange[8].buyQuantity);
                    p.quantityB5.push(fiveTickRange[9].buyQuantity);
                    p.marketBuyQuantity.push(marketBuyQuantity);
                    p.marketSellQuantity.push(marketSellQuantity);
                    return p;
                  },
                  {
                    xAxis: [],
                    quantityA5: [],
                    quantityA4: [],
                    quantityA3: [],
                    quantityA2: [],
                    quantityA1: [],
                    quantityB1: [],
                    quantityB2: [],
                    quantityB3: [],
                    quantityB4: [],
                    quantityB5: [],
                    fiveTickRange: [],
                    marketBuyQuantity: [],
                    marketSellQuantity: [],
                    charts: ["B1", "B2", "B3", "B4", "B5"],
                    type: "buy",
                  }
                )}
                onDateFormatChange={(v) => {
                  setDateFormat(v);
                }}
              />
            </div>
            <div className="w-1/2">
              <DisplayStatisticsChart
                data={statisticsChartData.reduce(
                  (p, v) => {
                    const {
                      xAxis,
                      // quantity,
                      fiveTickRange,
                      marketBuyQuantity,
                      marketSellQuantity,
                    } = v;
                    p.xAxis.push(xAxis);
                    p.quantityA5.push(fiveTickRange[0].sellQuantity);
                    p.quantityA4.push(fiveTickRange[1].sellQuantity);
                    p.quantityA3.push(fiveTickRange[2].sellQuantity);
                    p.quantityA2.push(fiveTickRange[3].sellQuantity);
                    p.quantityA1.push(fiveTickRange[4].sellQuantity);
                    p.marketBuyQuantity.push(marketBuyQuantity);
                    p.marketSellQuantity.push(marketSellQuantity);
                    return p;
                  },
                  {
                    xAxis: [],
                    quantityA5: [],
                    quantityA4: [],
                    quantityA3: [],
                    quantityA2: [],
                    quantityA1: [],
                    quantityB1: [],
                    quantityB2: [],
                    quantityB3: [],
                    quantityB4: [],
                    quantityB5: [],
                    fiveTickRange: [],
                    marketBuyQuantity: [],
                    marketSellQuantity: [],
                    charts: ["A1", "A2", "A3", "A4", "A5"],
                    type: "sell",
                  }
                )}
                onDateFormatChange={(v) => {
                  setDateFormat(v);
                }}
              />
            </div>
          </div>
        );
      }, [statisticsChartData])} */}
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6" style={{ display: stock ? "none" : undefined }}>
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              onStockIdChange && onStockIdChange(e);
              setStockId(e);
            }}
          />
        </div>
        <Button
          type="primary"
          onClick={() => setIsRunning(true)}
          disabled={!stockId && !(stock && stock.id)}
        >
          開始播放
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setIsRunning(false)}
          disabled={!isRunning}
        >
          暫停播放
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            resetChart();
          }}
          disabled={!stockId && !(stock && stock.id)}
        >
          重製畫面
        </Button>
        <div>
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
        </div>
      </div>
    </div>
  );
};

export default DisplayChart;
