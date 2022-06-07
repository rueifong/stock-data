import { Select } from "antd";
import { useEffect, useState } from "react";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";

const { Option } = Select;
export const StockSelector = ({ style, mode, onChange, isRealData, onEnd }) => {
  const [stocks, setStocks] = useState();
  const [stockList, setStockList] = useState();

  // useEffect(() => {
  //   if (isRealData) {
  //     const { marketType, fileType } = isRealData;
  //     const { url, method } =
  //       marketType === "futures"
  //         ? api.getAvailableFutures
  //         : api.getAvailableStock;
  //     defaultAxios({
  //       url,
  //       method,
  //       params: {
  //         type: fileType,
  //       },
  //     })
  //       .then(({ data }) => {
  //         setStockList(
  //           data.map((id) => {
  //             return { id };
  //           })
  //         );
  //       })
  //       .catch((err) => {
  //         // errorNotification(err?.response?.data);
  //       });
  //   } else {
  //     defaultAxios({
  //       url: api.getStock.url,
  //       method: api.getStock.method,
  //     })
  //       .then(({ data: { content: stockList } }) => {
  //         setStockList(stockList);
  //       })
  //       .catch((err) => {
  //         // errorNotification(err?.response?.data);
  //       });
  //   }
  // }, [isRealData]);

  return (
    <Select
      style={{ ...style }}
      onChange={(e) => {
        setStocks(e);
        onChange && onChange(e);
      }}
      mode={mode}
      value={stocks}
      placeholder="選擇股票"
      showSearch
      onDropdownVisibleChange={(e) => {
        if (e === false) {
          onEnd && onEnd();
        }
      }}
    >
      {[{
        id: '2330'
      }].map((stock) => {
          return (
            <Option key={Math.random()} value={stock.id}>
              {stock.id}
            </Option>
          );
        })}
    </Select>
  );
};
