import React, { useEffect, useState } from "react";
// import ReactDOM from 'react-dom';
// import CSVReader from 'react-csv-reader';
import ReadFile from "./read-file";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { Button, Checkbox, InputNumber, Select } from "antd";
import { StockSelector } from "../../component/stock-selector";

const QuickOrder = () => {
  let timer;
  const [stockId, setStockId] = useState(undefined);
  const [isRunning, setIsRunning] = useState(true);
  const [containerData, setContainerData] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [showType, setShowType] = useState("請選擇情境");
  const [timeRestriction, setTimeRestriction] = useState(0);
  const [isAutoTime, setIsAutoTime] = useState(false);
  // const [isSimulated, setIsSimulated] = useState(false);

  const [display, setDisplay] = useState();

  // 標記A1、B1
  function matchFiveTick(price, type) {
    if (display) {
      if (type == "buyQuantity") {
        return price == display.B1;
      } else if (type == "sellQuantity") {
        return price == display.A1;
      }
    }
  }

  // 限價單
  function sendOrder(data) {
    if (showType == "請選擇情境") {
      if (stockId)
        defaultAxios({
          url: api.postOrder.url,
          method: api.postOrder.method,
          data: {
            // investorId: 1,
            stockId,
            method: data.method, // BUY = 0, SELL = 1
            price: data.price,
            quantity: data.quantity,
            priceType: data.priceType, // MARKET = 0, LIMIT = 1
            timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
            isAutoTime,
          },
        })
          .then((res) => {
            refreshDisplay(showType);
          })
          .catch((err) => {
            errorNotification(err?.response?.data);
          });
    } else {
      defaultAxios({
        url: api.postVirtualOrder.url,
        method: api.postVirtualOrder.method,
        data: {
          method: data.method, // BUY = 0, SELL = 1
          price: data.price,
          quantity: data.quantity,
          priceType: data.priceType, // MARKET = 0, LIMIT = 1
          timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
          virtualOrderContainerId: showType,
        },
      })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    }
  }

  // 市價單
  function sendMarketOrder(data) {
    if (showType == "請選擇情境") {
      defaultAxios({
        url: api.postOrder.url,
        method: api.postOrder.method,
        data: {
          // investorId: 1,
          stockId,
          method: data.method, // BUY = 0, SELL = 1
          price: data.price,
          quantity: data.quantity,
          priceType: data.priceType, // MARKET = 0, LIMIT = 1
          timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
          isAutoTime,
        },
      })
        .then((res) => {
          refreshDisplay(showType);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    } else {
      defaultAxios({
        url: api.postVirtualOrder.url,
        method: api.postVirtualOrder.method,
        data: {
          method: data.method, // BUY = 0, SELL = 1
          price: data.price,
          quantity: data.quantity,
          priceType: data.priceType, // MARKET = 0, LIMIT = 1
          timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
          virtualOrderContainerId: showType,
        },
      })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    }
  }

  // 取消單
  function cancelOrder(data) {
    if (showType == "請選擇情境") {
      defaultAxios({
        url: api.postOrder.url,
        method: api.postOrder.method,
        data: {
          // investorId: 1,
          stockId,
          method: data.method, // BUY = 0, SELL = 1
          price: data.price,
          quantity: data.quantity,
          priceType: data.priceType, // MARKET = 0, LIMIT = 1
          timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
          subMethod: 0,
          isAutoTime,
        },
      })
        .then((res) => {
          refreshDisplay(showType);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    } else {
      defaultAxios({
        url: api.postVirtualOrder.url,
        method: api.postVirtualOrder.method,
        data: {
          method: data.method, // BUY = 0, SELL = 1
          price: data.price,
          quantity: data.quantity,
          priceType: data.priceType, // MARKET = 0, LIMIT = 1
          timeRestriction: timeRestriction, // ROD = 0, IOC = 1, FOK = 2
          subMethod: 0,
          virtualOrderContainerId: showType,
        },
      })
        .then((res) => {
          setData(res.data);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    }
  }
  function refreshDisplay(showType) {
    if (showType == "請選擇情境") {
      if (stockId)
        defaultAxios({
          url: api.getDisplay.url,
          method: api.getDisplay.method,
          params: {
            stockId,
            isGetLatest: true,
          },
        }).then((res) => {
          setData(res.data);
        });
    } else {
      defaultAxios({
        url: api.getVirtualOrder.url + "/" + showType,
        method: api.getVirtualOrder.method,
        params: {
          isGetLatest: true,
        },
      })
        .then((res) => {
          setData(res.data.display);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
        });
    }
  }

  function setData(data) {
    let newFiveTickRangeData = JSON.parse(JSON.stringify(data.fiveTickRange));
    newFiveTickRangeData = newFiveTickRangeData.sort(
      (a, b) => a.price - b.price
    );

    data.fiveTickRange.forEach(function (item) {
      if (item.sellQuantity > 0) {
        data.A1 = item.price;
      }
    });
    newFiveTickRangeData.forEach(function (item) {
      if (item.buyQuantity > 0) {
        data.B1 = item.price;
      }
    });
    setDisplay(data);
  }

  useEffect(() => {
    defaultAxios({
      url: api.getVirtualOrderContainer.url,
      method: api.getVirtualOrderContainer.method,
      params: {
        page: { page: page, pageSize: pageSize },
      },
    })
      .then((res) => {
        let data = [];
        res.data.content.forEach(function (content) {
          data.push({
            label: content.name,
            value: content.id,
          });
        });
        setContainerData(data);
        setTotalSize(res.data.totalSize);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });

    if (isRunning) {
      timer = setInterval(() => {
        refreshDisplay(showType);
      }, 1000);
    } else {
      // refreshDisplay(showType);
    }

    return () => clearInterval(timer);
  }, [isRunning, stockId]);

  return (
    <div className="w-10/12 mx-auto">
      {/* <div>
        <ReadFile />
        <hr className="mb-5" />
      </div> */}
      <div>
        <Select
          value={showType}
          style={{ width: 120, marginBottom: "10px", marginRight: "10px" }}
          onChange={(value) => {
            setIsRunning(value === "請選擇情境");
            clearInterval(timer);
            setShowType(value);
            refreshDisplay(value);
          }}
          options={[
            { label: "請選擇情境", value: "請選擇情境" },
            ...containerData,
          ]}
        />

        <InputNumber
          min={1}
          defaultValue={quantity}
          style={{ marginRight: "10px" }}
          onChange={(value) => {
            setQuantity(value);
          }}
        />

        <Select
          value={timeRestriction}
          style={{ width: 120, marginBottom: "10px", marginRight: "10px" }}
          onChange={(value) => {
            setTimeRestriction(value);
          }}
          options={[
            {
              label: "ROD",
              value: 0,
            },
            {
              label: "IOC",
              value: 1,
            },
            {
              label: "FOK",
              value: 2,
            },
          ]}
        />
        {showType == "請選擇情境" ? (
          <StockSelector
            style={{ width: 120 }}
            onChange={(e) => {
              setStockId(e);
            }}
          />
        ) : (
          <Button
            type="primary"
            danger
            onClick={() => {
              defaultAxios({
                url: api.resetVirtualOrder.url + "/" + showType,
                method: api.resetVirtualOrder.method,
                data: {
                  id: 1,
                  isReset: true,
                },
              })
                .then(() => {
                  refreshDisplay(showType);
                })
                .catch((err) => {
                  errorNotification(err?.response?.data);
                });
            }}
          >
            Reset
          </Button>
        )}
        {/* <Checkbox
          checked={isAutoTime}
          onChange={(e) => {
            const { checked } = e.target;
            setIsAutoTime(checked);
            // if (!checked) {
            //   setIsSimulated(false);
            // }
          }}
        >
          是否自動填入過去時間
        </Checkbox> */}
        {/* <Checkbox
          checked={isSimulated}
          onChange={(e) => {
            setIsSimulated(e.target.checked);
          }}
          disabled={!isAutoTime}
        >
          是否為虛擬單
        </Checkbox> */}
      </div>

      <div
        style={{
          display: showType === "請選擇情境" && !stockId ? "none" : undefined,
        }}
      >
        <div className="flex mb-1 items-center">
          <Button
            className="w-full"
            style={{ background: "lightpink", borderColor: "lightpink" }}
            onClick={() => {
              sendMarketOrder({
                method: 0,
                price: 0,
                quantity: quantity,
                priceType: 0,
              });
            }}
          >
            &nbsp;
          </Button>
          <div className={"bg-blue-300 text-center w-1/4 mx-1 h-full py-1.5"}>
            市價
          </div>
          <Button
            className="w-full py-3"
            style={{ background: "lightgreen", borderColor: "lightgreen" }}
            onClick={() => {
              sendMarketOrder({
                method: 1,
                price: 0,
                quantity: quantity,
                priceType: 0,
              });
            }}
          >
            &nbsp;
          </Button>
        </div>
        <hr className="my-2" />
        <div className="flex mb-1 items-center">
          <Button
            className="w-1/2 mr-1"
            style={{ background: "none", border: "none" }}
          >
            取消單
          </Button>
          <Button
            className="w-1/2"
            style={{ background: "none", border: "none" }}
          >
            限價單
          </Button>
          <div className={"text-center w-1/4 mx-1 h-full py-1.5"}>&nbsp;</div>
          <Button
            className="w-1/2 mr-1"
            style={{ background: "none", border: "none" }}
          >
            限價單
          </Button>
          <Button
            className="w-1/2"
            style={{ background: "none", border: "none" }}
          >
            取消單
          </Button>
        </div>
        {display &&
          display.tickRange.map((range, key) => (
            <div key={key} className="flex mb-1 items-center">
              <Button
                className="w-1/2 mr-1"
                style={{ background: "#ffb6c180", borderColor: "lightpink" }}
                onClick={() => {
                  cancelOrder({
                    method: 0,
                    price: range.price,
                    quantity: quantity,
                    priceType: 1,
                  });
                }}
              >
                {range.investorBuyQuantity || " "}
              </Button>
              <Button
                className="w-1/2"
                style={{
                  background: matchFiveTick(range.price, "buyQuantity")
                    ? "lightcoral"
                    : "lightpink",
                  borderColor: "lightpink",
                }}
                onClick={() => {
                  sendOrder({
                    method: 0,
                    price: range.price,
                    quantity: quantity,
                    priceType: 1,
                  });
                }}
              >
                {range.buyQuantity > 0 ? range.buyQuantity : " "}
              </Button>
              <div
                className={
                  (display && display.matchPrice == range.price
                    ? "bg-yellow-400"
                    : "bg-yellow-200") + " text-center w-1/4 mx-1 h-full py-1.5"
                }
              >
                {range.price}
              </div>
              <Button
                className="w-1/2 mr-1"
                style={{
                  background: matchFiveTick(range.price, "sellQuantity")
                    ? "lightseagreen"
                    : "lightgreen",
                  borderColor: "lightgreen",
                }}
                onClick={() => {
                  sendOrder({
                    method: 1,
                    price: range.price,
                    quantity: quantity,
                    priceType: 1,
                  });
                }}
              >
                {range.sellQuantity > 0 ? range.sellQuantity : " "}
              </Button>
              <Button
                className="w-1/2"
                style={{ background: "#90ee9080", borderColor: "lightgreen" }}
                onClick={() => {
                  cancelOrder({
                    method: 1,
                    price: range.price,
                    quantity: quantity,
                    priceType: 1,
                  });
                }}
              >
                {range.investorSellQuantity || " "}
              </Button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default QuickOrder;
