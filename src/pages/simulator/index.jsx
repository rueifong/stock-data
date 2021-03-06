import { Button, DatePicker, Table, Slider, Tabs, Select } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { StockSelector } from "../../component/stock-selector";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import moment from "moment";
import dayjs from "dayjs";
import { CSVDownloader } from "react-papaparse";

const { TabPane } = Tabs;

const getRealDataOrderContent = async (params) => {
  const { url, method } = api.getRealDataStockOrderContent;
  params.isSimulatedOrder = true;
  return defaultAxios({
    url,
    method,
    params,
  });
};

const resetStock = (stockId) => {
  return defaultAxios({
    url: api.resetStock.url,
    method: api.resetStock.method,
    data: {
      id: stockId,
      isReset: true,
      isAutoDisplay: false,
    },
  });
};

const getOrder = (stockId, startTime, endTime) => {
  const { url, method } = api.getOrder;
  return defaultAxios({
    url,
    method,
    params: {
      stockId,
      createdTime: {
        min: startTime,
        max: endTime,
      },
      order: {
        orderBy: "createdTime",
        order: "ASC",
      },
    },
  });
};

const sendOrder = ({ id, realDataOrderId, ...order }) => {
  const { url, method } = api.postOrder;
  return defaultAxios({
    url,
    method,
    data: {
      ...order,
      investorId: null,
    },
  });
};

export const OrderSender = ({ orders, stockId, onReset }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunnung] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timeOut = useRef();
  const speedRef = useRef(1);
  const sliderDelay = useRef();

  useEffect(() => {
    if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = undefined;
    }
    setCurrentIndex(0);
    setIsRunnung(false);

    return () => {
      if (sliderDelay.current) clearTimeout(sliderDelay.current);
      if (timeOut.current) clearTimeout(timeOut.current);
    };
  }, [orders]);

  const handleTimeOut = useCallback(() => {
    const currentOrder = orders[currentIndex];
    const nextOrder = orders[currentIndex + 1];
    sendOrder(currentOrder).catch((err) => {
      errorNotification(err?.response?.data);
    });
    if (nextOrder) {
      const delay =
        Date.parse(nextOrder.createdTime) -
        Date.parse(currentOrder.createdTime);
      timeOut.current = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, Math.max(delay / speedRef.current, 50));
    }
  }, [currentIndex, orders]);

  useEffect(() => {
    if (isRunning) {
      handleTimeOut();
    } else if (timeOut.current) {
      clearTimeout(timeOut.current);
      timeOut.current = undefined;
    }
  }, [isRunning, handleTimeOut]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <Button
          type="primary"
          onClick={() => {
            setIsRunnung(true);
          }}
          disabled={!stockId || !orders.length}
        >
          ????????????
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => {
            setIsRunnung(false);
          }}
          disabled={!stockId || !isRunning}
        >
          ????????????
        </Button>
        <div style={{ width: "200px" }}>
          ???????????? {speed} ???
          <Slider
            value={speed}
            max={10}
            disabled={!stockId || !orders.length}
            onChange={(e) => {
              setSpeed(e);
            }}
          />
        </div>
      </div>
      <div style={{ width: "100%" }}>
        ??????({orders.length ? currentIndex + 1 : 0} / {orders.length} )
        <Slider
          value={currentIndex}
          max={orders.length - 1}
          disabled={!stockId || !orders.length}
          onChange={(e) => {
            setCurrentIndex(e);
            setIsRunnung(false);
            if (sliderDelay.current) clearTimeout(sliderDelay.current);
            sliderDelay.current = setTimeout(() => {
              onReset && onReset();
              const order = orders[currentIndex];
              resetStock(
                order.stockId === stockId ? stockId : order.stockId
              ).catch((err) => {
                errorNotification(err?.response?.data);
              });
            }, 1000);
          }}
        />
        <Table
          rowKey="id"
          columns={[
            // {
            //   title: "????????????",
            //   dataIndex: "priceType",
            //   render: (data) => <span>{data ? "LIMIT" : "MARKET"}</span>,
            //   key: Math.random(),
            // },
            {
              title: "??????",
              dataIndex: "o_type",
              render: (data) => <span>{data == 'B' ? "buy" : "sell"}</span>,
              key: Math.random(),
            },
            {
              title: "??????",
              dataIndex: "odr_price",
              key: Math.random(),
            },
            {
              title: "??????",
              dataIndex: "t_vol",
              key: Math.random(),
            },

            // {
            //   title: "?????????",
            //   dataIndex: "subMethod",
            //   render: (data) => (
            //     <span>
            //       {data ? "UPDATE" : data === null ? "NULL" : "CANCEL"}
            //     </span>
            //   ),
            //   key: Math.random(),
            // },
            // {
            //   title: "????????????",
            //   dataIndex: "timeRestriction",
            //   render: (data) => (
            //     <span>{data ? "IOC" : data === 2 ? "FOK" : "ROD"}</span>
            //   ),
            //   key: Math.random(),
            // },
            {
              title: "??????",
              dataIndex: "o_datetime",
              render: (data) => {
                console.log(data);
                const date = Number(data.toString().substring(0, data.toString().length - 3));
                return (
                  <span>{dayjs(date).format("YYYY/MM/DD HH:mm:ss")}</span>
                )
              }
            },
          ]}
          pagination={false}
          dataSource={
            orders.length && [{ ...orders[currentIndex], key: Math.random() }]
          }
          sticky
        />
      </div>
    </div>
  );
};

const getRealDataAvailableAPI = (marketType) => {
  switch (marketType) {
    case "stock":
      return api.getAvailableStock;
    default:
      return api.getAvailableFutures;
  }
};

const RealDataSimulator = ({ customResetStock, onReset }) => {
  // Functional state
  const [orders, setOrders] = useState([]);
  const [marketType, setMarketType] = useState("stock");
  const [isLoading, setIsLoading] = useState(false);
  const [availableDate, setAvailableDate] = useState([]);

  //Query state
  const [stockId, setStockId] = useState();
  const [startMonth, setStartMonth] = useState();
  const [startDate, setStartDate] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  // useEffect(() => {
  //   if (stockId) {
  //     setIsLoading(true);
  //     const { url, method } = getRealDataAvailableAPI(marketType);
  //     return defaultAxios({
  //       url: url + `/${stockId}`,
  //       method,
  //       params: {
  //         type: "order",
  //       },
  //     })
  //       .then(({ data }) => {
  //         setAvailableDate(data);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         errorNotification(err?.response?.data);
  //         setIsLoading(false);
  //       });
  //   }
  // }, [stockId]);
  
  useEffect(() => {
    if (startMonth) {
      // setIsLoading(true);
      // const { url, method } = getRealDataAvailableAPI(marketType);
      return defaultAxios({
        url: 'http://140.118.118.173:13278/api/v1/getStockData',
        credentials: 'include',
        method: 'GET',
        headers: new Headers({
          // 'access-control-allow-origin': '*',
          'Content-Type': 'application/json'
        }),
        params: {
          cmd: "get_data_exist_date",
          s_code: stockId,
          sc_type: "dsp",
          year_month: startMonth,
        },
      })
        .then(({ data }) => {
          console.log('data', data.data);
          setAvailableDate(data.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log('error', err)
          errorNotification(err?.response?.data);
          setIsLoading(false);
        });
    }
  }, [startMonth]);
  
  return (
    <div>
      <div className="flex justify-around my-6 px-6 items-center">
        {/* <div className="w-1/6">
          ??????????????????
          <Select
            className="w-20 ml-2"
            value={marketType}
            options={[
              { value: "stock", label: "??????" },
              { value: "futures", label: "??????" },
            ]}
            onChange={(val) => {
              setMarketType(val);
            }}
          />
        </div> */}
        <div className="w-1/6">
          ????????????
          <StockSelector
            style={{ width: "100%" }}
            // isRealData={{
            //   marketType,
            //   fileType: "order",
            // }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        </div>
        <div className="w-1/6">
          ????????????
          <DatePicker
            picker="month"
            disabled={!stockId}
            onChange={(time, month) => {
              setStartMonth(month);
            }}
          />
        </div>
        <div className="w-1/6">
          ????????????
          <DatePicker
            allowClear
            // style={{ width: "100%" }}
            disabled={!stockId && availableDate.length == 0}
            disabledDate={(current) => {
              const transferedCurrent = current && current.startOf("day");
              return (
                (transferedCurrent && transferedCurrent > moment()) ||
                (transferedCurrent &&
                  !availableDate.includes(
                    transferedCurrent.format("YYYY-MM-DD")
                  ))
              );
            }}
            onChange={(time, day) => {
              setStartDate(day);
            }}
          />
        </div>
        <div className="w-1/6">
          ??????????????????
          <DatePicker
            picker="time"
            disabled={!stockId}
            onChange={(e, time) => {              
              const dateTime = new Date(startDate + ' ' + time).getTime() + '000';
              setStartTime(dateTime);
            }}
          />
        </div>
        <div className="w-1/6">
          ??????????????????
          <DatePicker
            picker="time"
            disabled={!stockId}
            onChange={(e, time) => {              
              const dateTime = new Date(startDate + ' ' + time).getTime() + '000';
              setEndTime(dateTime);
            }}
          />
        </div>
        
        <div className="w-1/6">
          &nbsp;<br />
          <Button
            type="primary"
            danger
            onClick={async () => {
              let tempStockId = stockId;
              // if (customResetStock) {
              //   tempStockId = await customResetStock(stockId);
              // } else {
              //   await resetStock(stockId).catch((err) => {
              //     errorNotification(err?.response?.data);
              //   });
              // }

              defaultAxios({
                url: 'http://140.118.118.173:13278/api/v1/getStockData',
                credentials: 'include',
                method: 'GET',
                headers: new Headers({
                  // 'access-control-allow-origin': '*',
                  'Content-Type': 'application/json'
                }),
                params: {
                  cmd: "get_stock",
                  s_code: stockId,
                  sc_type: "odr",
                  start_time: startTime,
                  end_time: endTime,
                },
              })
                .then(({ data }) => {
                  console.log('stockData', data);
                  setOrders(
                    data.data.map((v) => {
                      return {
                        stockId: tempStockId,
                        ...v,
                      };
                    })
                  );

                  // setAvailableDate(data.data);
                  // setIsLoading(false);
                })
                .catch((err) => {
                  console.log('error', err)
                  errorNotification(err?.response?.data);
                  setIsLoading(false);
                });
        
              // defaultAxios({
              //   stockId,
              //   createdTime: {
              //     min: startTime.startOf("day").toISOString(),
              //     max: endTime.endOf("day").toISOString(),
              //   },
              // })
              //   .then(({ data }) => {
              //     setOrders(
              //       data.content.map((v) => {
              //         return {
              //           ...v,
              //           investorId: null,
              //           stockId: tempStockId,
              //         };
              //       })
              //     );
              //   })
              //   .catch((err) => {
              //     errorNotification(err?.response?.data);
              //   });
            }}
            disabled={!stockId || !startTime}
          >
            ????????????
          </Button>
        </div>
        <div className="w-1/6">
          &nbsp;<br />
          <CSVDownloader
            // type={Button}
            filename={'filename'}
            bom={true}
            config={{
              delimiter: ',',
            }}
            data={orders}
          >
            Download CSV
          </CSVDownloader>
        </div>
      </div>
      {/* <OrderSender orders={orders} stockId={stockId} onReset={onReset} /> */}
    </div>
  );
};

const Simulator = ({ customResetStock, onReset }) => {
  return (
    <>
      <RealDataSimulator
        customResetStock={customResetStock}
        onReset={onReset}
      />
    </>
  );
};

export default Simulator;
