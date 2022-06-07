import React, { useCallback, useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import moment from "moment";
import {
  Button,
  DatePicker,
  Select,
  Switch,
  Row,
  Col,
  InputNumber,
  Tooltip,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { StockSelector } from "../../component/stock-selector";
import errorNotification from "../../utils/errorNotification";
const { Option } = Select;
const ORDER_FIELDS = [
  "count",
  "method",
  "subMethod",
  "price",
  "quantity",
  "priceType",
  "timeRestriction",
  "stockId",
  "trdate",
  "ts",
];
const TRANSACTION_FIELDS = [
  "count",
  "stockId",
  "price",
  "quantity",
  "trdate",
  "ts",
];
const DISPLAY_FIELDS = [
  "count",
  "mthpx",
  "mthsz",
  "a1px",
  "a1sz",
  "a2px",
  "a2sz",
  "a3px",
  "a3sz",
  "a4px",
  "a4sz",
  "a5px",
  "a5sz",
  "b1px",
  "b1sz",
  "b2px",
  "b2sz",
  "b3px",
  "b3sz",
  "b4px",
  "b4sz",
  "b5px",
  "b5sz",
  "asz",
  "bsz",
  "sym",
  "trdate",
  "ts",
];

const getFileTypeFields = (fileType) => {
  switch (fileType) {
    case "transaction":
      return TRANSACTION_FIELDS;
    case "display":
      return DISPLAY_FIELDS;
    default:
      return ORDER_FIELDS;
  }
};
const getRealDataContentAPI = (fileType, marketType) => {
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.getRealDataStockTransactionContent
        : api.getRealDataFuturesTransactionContent;
    case "display":
      return marketType === "stock"
        ? api.getRealDataStockDisplayContent
        : api.getRealDataFuturesDisplayContent;
    default:
      return marketType === "stock"
        ? api.getRealDataStockOrderContent
        : api.getRealDataFuturesOrderContent;
  }
};

const getRealDataAvailableAPI = (marketType) => {
  switch (marketType) {
    case "stock":
      return api.getAvailableStock;
    default:
      return api.getAvailableFutures;
  }
};

const FILET_TYPE = [
  { header: "委託檔", value: "order" },
  { header: "成交檔", value: "transaction" },
  { header: "揭示檔", value: "display" },
];
const DATE_FORMAT = [
  {
    header: "毫秒",
    value: 4,
  },
  {
    header: "秒",
    value: 3,
  },
  {
    header: "分",
    value: 0,
  },
  {
    header: "時",
    value: 1,
  },
  {
    header: "日",
    value: 2,
  },
];
const SAMPLE_MODE = [
  {
    header: "第一筆",
    value: 0,
  },
  {
    header: "成交價最大",
    value: 1,
  },
  {
    header: "成交價最小",
    value: 2,
  },
  {
    header: "平均成交價",
    value: 3,
  },
];

const FrequentDataElement = function ({ marketType }) {
  const [group, setGroup] = useState();
  const [stocks, setStocks] = useState([]);
  const [fileType, setFileType] = useState("order");
  const [datePickerMode, setDatePickerMode] = useState({
    start: "year",
    end: "year",
  });
  const [unit, setUnit] = useState(1);
  const [isSample, setIsSample] = useState(true);
  const [dateFormat, setDateFormat] = useState(3);
  const [sampleMode, setSampleMode] = useState(0);
  const [fields, setFields] = useState(ORDER_FIELDS);

  const [availableDate, setAvailableDate] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [isGroup, setIsGroup] = useState(false);

  const [groupList, setGroupList] = useState();

  const getTitle = (marketType) => {
    switch (marketType) {
      case "stock":
        return "證交";
      case "futures":
        return "期交";
      default:
        return "";
    }
  };
  const handleStockSelectorChange = useCallback(() => {
    if (stocks.length !== 0) {
      setIsLoading(true);
      const { url, method } = getRealDataAvailableAPI(marketType);
      Promise.all(
        stocks.map((stock) => {
          return defaultAxios({
            url: url + `/${stock}`,
            method,
            params: {
              type: fileType,
            },
          });
        })
      )
        .then((datas) => {
          const dateSet = new Set();
          datas.forEach(({ data }) => {
            data.forEach((date) => {
              dateSet.add(date);
            });
          });
          setAvailableDate(Array.from(dateSet));
          setIsLoading(false);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
          setIsLoading(false);
        });
    }
  }, [fileType, marketType, stocks]);

  useEffect(() => {
    handleStockSelectorChange();
  }, [handleStockSelectorChange]);
  useEffect(() => {
    defaultAxios({
      url: api.getGroup.url,
      method: api.getGroup.method,
    })
      .then(({ data: { content: groupList } }) => {
        setGroupList(groupList);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, []);
  return (
    <Spin spinning={isLoading}>
      <div style={{ padding: "20px" }}>
        {getTitle(marketType)}
        <Row>
          <Col span={6}>
            {/* <Switch
            checked={isGroup}
            onChange={() => {
              setIsGroup(!isGroup);
            }}
          /> */}
            檔案類型
            <Select
              style={{ width: "100%" }}
              onChange={(e) => {
                setFileType(e);
                setFields(getFileTypeFields(e));
                setStartTime(null);
                setEndTime(null);
              }}
              value={fileType}
              placeholder="選擇檔案類型"
            >
              {FILET_TYPE.map((fileType) => {
                return (
                  <Option key={Math.random()} value={fileType.value}>
                    {fileType.header}
                  </Option>
                );
              })}
            </Select>
          </Col>
          <Col span={6}>
            {isGroup ? "類股" : "股票"}
            <Select
              style={{
                width: "100%",
                display: isGroup ? undefined : "none",
              }}
              onChange={(e) => {
                setGroup(e);
              }}
              value={group}
              placeholder="選擇類股"
            >
              {groupList &&
                groupList.map((group, index) => {
                  return (
                    <Option key={Math.random()} value={index}>
                      {group.name}
                    </Option>
                  );
                })}
            </Select>
            <StockSelector
              isRealData={{
                marketType,
                fileType,
              }}
              style={{
                width: "100%",
                display: !isGroup ? undefined : "none",
              }}
              onChange={(e) => {
                setStocks(e);
              }}
              mode="multiple"
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={6}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Tooltip
                title={`開始時間與結束時間間隔不可大於5天，沒資料的不可選`}
              >
                <ExclamationCircleOutlined />
              </Tooltip>
              開始時間
            </div>
            <DatePicker
              picker="date"
              mode={datePickerMode.start}
              onPanelChange={(value, mode) => {
                setDatePickerMode({ ...datePickerMode, start: mode });
              }}
              onOpenChange={(open) => {
                if (!open)
                  setDatePickerMode({ ...datePickerMode, start: "year" });
              }}
              value={startTime}
              allowClear
              style={{ width: "100%" }}
              placeholder="選擇開始時間"
              disabled={stocks.length === 0}
              disabledDate={(current) => {
                const transferedCurrent = current && current.startOf("day");
                const transferedEndTime = endTime && endTime;
                return (
                  (transferedCurrent && transferedCurrent > moment()) ||
                  (transferedCurrent &&
                    !availableDate.includes(
                      transferedCurrent.format("YYYY-MM-DD")
                    )) ||
                  (transferedEndTime &&
                    transferedCurrent > transferedEndTime) ||
                  (transferedEndTime &&
                    transferedEndTime.diff(transferedCurrent) / 86400000 >= 5)
                );
              }}
              onChange={(time) => {
                setStartTime(time && time.startOf("day"));
              }}
            />
          </Col>
          <Col span={6}>
            結束時間
            <DatePicker
              picker="date"
              mode={datePickerMode.end}
              onPanelChange={(value, mode) => {
                setDatePickerMode({ ...datePickerMode, end: mode });
              }}
              onOpenChange={(open) => {
                if (!open)
                  setDatePickerMode({ ...datePickerMode, end: "year" });
              }}
              value={endTime}
              allowClear
              style={{ width: "100%" }}
              placeholder="選擇結束時間"
              disabled={stocks.length === 0}
              disabledDate={(current) => {
                const transferedCurrent = current && current.startOf("day");
                const transferedStartTime = startTime && startTime;
                return (
                  (transferedCurrent && transferedCurrent > moment()) ||
                  (transferedCurrent &&
                    !availableDate.includes(
                      transferedCurrent.format("YYYY-MM-DD")
                    )) ||
                  (transferedStartTime &&
                    transferedCurrent < transferedStartTime) ||
                  (transferedStartTime &&
                    transferedCurrent.diff(transferedStartTime) / 86400000 >= 5)
                );
              }}
              onChange={(time) => {
                setEndTime(time && time.startOf("day"));
              }}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={6}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Tooltip title={`若選擇不取樣，會將原始資料全部下載`}>
                <ExclamationCircleOutlined />
              </Tooltip>
              {isSample ? "時間頻率" : "不取樣"}
              <Switch
                checked={isSample}
                onChange={() => {
                  setIsSample(!isSample);
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <InputNumber
                disabled={!isSample}
                style={{ width: "100%" }}
                value={unit}
                step={1}
                onChange={(e) => {
                  setUnit(Math.floor(e));
                }}
              />
              <Select
                disabled={!isSample}
                allowClear
                style={{ width: "100%" }}
                onChange={(e) => {
                  setDateFormat(e);
                }}
                value={dateFormat}
                placeholder="選擇時間頻率"
              >
                {DATE_FORMAT.map((dateFormat) => {
                  return (
                    <Option key={Math.random()} value={dateFormat.value}>
                      {dateFormat.header}
                    </Option>
                  );
                })}
              </Select>
            </div>
          </Col>
          <Col span={6}>
            取樣模式
            <Select
              disabled={dateFormat === undefined || !isSample}
              style={{ width: "100%" }}
              onChange={(e) => {
                setSampleMode(e);
              }}
              value={sampleMode}
              placeholder="選擇取樣模式"
            >
              {SAMPLE_MODE.map((sampleMode) => {
                return (
                  <Option key={Math.random()} value={sampleMode.value}>
                    {sampleMode.header}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col span={12}>
            欄位
            <Select
              style={{ width: "100%" }}
              onChange={(e) => {
                setFields(e);
              }}
              value={fields}
              mode="multiple"
              placeholder="選擇欄位"
            >
              {getFileTypeFields(fileType).map((field) => {
                return (
                  <Option key={Math.random()} value={field}>
                    {field}
                  </Option>
                );
              })}
            </Select>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Button
            loading={isButtonLoading}
            onClick={async () => {
              let stockIds = [];
              if (isGroup) {
                if (!isNaN(group)) {
                  stockIds = groupList[group].stocks.map((stock) => stock.id);
                }
              } else {
                if (stocks) stockIds = stocks;
              }

              if (stockIds.length && startTime && endTime) {
                const { url, method } = getRealDataContentAPI(
                  fileType,
                  marketType
                );
                setIsButtonLoading(true);
                await Promise.all(
                  stockIds.map((stockId) => {
                    return defaultAxios({
                      url,
                      method,
                      params: {
                        unit,
                        dateFormat: isSample ? dateFormat : undefined,
                        sampleMode,
                        fields,
                        stockId,
                        futuresId: stockId,
                        startTime: startTime.startOf("day").toISOString(),
                        endTime: endTime.endOf("day").toISOString(),
                      },
                    })
                      .then(({ data, headers }) => {
                        const fileName = headers["filename"];
                        const header = data.length
                          ? Object.keys(data[0]).join(",") + "\n"
                          : "";
                        const transferData =
                          header +
                          data
                            .map((v) => {
                              return Object.values(v).join(",");
                            })
                            .join("\n");

                        const url = window.URL.createObjectURL(
                          new Blob([transferData])
                        );
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", fileName);
                        document.body.appendChild(link);
                        link.click();
                        window.URL.revokeObjectURL(url);
                        setIsButtonLoading(false);
                      })
                      .catch((err) => {
                        errorNotification(err?.response?.data);
                        setIsButtonLoading(false);
                      });
                  })
                );
              } else {
                errorNotification({
                  statusCode: 400,
                  message: "stock, startTime, endTime are required",
                });
              }
            }}
          >
            DOWNLOAD CSV
          </Button>
        </Row>
      </div>
    </Spin>
  );
};

const FrequentData = function () {
  return (
    <div>
      <FrequentDataElement marketType="stock" />
      <FrequentDataElement marketType="futures" />
    </div>
  );
};

export default FrequentData;
