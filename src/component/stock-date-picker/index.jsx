import { DatePicker } from "antd";
import { StockSelector } from "../../component/stock-selector";
import dayjs from "dayjs";

const StockDatePicker = ({ onStockChange, onStartChange, onEndChange }) => {


  return (
    <div>
      <div className="flex justify-around my-6 items-center">
        <div className="w-1/6">
          選擇股票
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              onStockChange && onStockChange(e);
            }}
          />
        </div>
        <div className="w-1/6">
          開始時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            showTime
            placeholder="選擇開始時間"
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              const tempTime = time ? dayjs(time).toISOString() : time;

              onStartChange && onStartChange(tempTime);
            }}
          />
        </div>
        <div className="w-1/6">
          結束時間
          <DatePicker
            allowClear
            style={{ width: "100%" }}
            showTime
            placeholder="選擇結束時間"
            disabledDate={(current) => current && current > dayjs()}
            onChange={(time) => {
              const tempTime = time ? dayjs(time).toISOString() : time;

              onEndChange && onEndChange(tempTime);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StockDatePicker;
