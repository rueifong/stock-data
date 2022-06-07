import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { Select } from "antd";
import dayjs from "dayjs";

const BarStatisticsChart = ({
  data = { 
    xAxis: [], 
    // quantity: [], 
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
    marketBuyQuantity: [],
    marketSellQuantity: [],
    charts: [], 
    type: ""
  },
  onDateFormatChange,
}) => {
  let timer;
  const [dataChart, setDataChart] = useState(1);
  const [dataZoom, setDataZoom] = useState(10);
  const [dateFormat, setDateFormat] = useState(4);
  const [quantity, setQuantity] = useState([]);
  const [average, setAverage] = useState(0);
  const [variance, setVariance] = useState(0);
  const [standardD, setStandardD] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  function sd(a){
    var sd=0;
    for(var i in a){
        sd += Math.pow((Math.abs(a[i]-mean(a))),2);
    }
    return sqrt(sd/a.length);
  }

  function sqrt(n){
    var i =1;
    var answer=1;
    while(i<n){
        //console.log('i= '+ i + ' answer= '+answer);
        if(i*i<=n && (i+0.0001)*(i+0.0001)>n){            
            answer= Math.round(i*100)/100;
            return answer;   
        }
        i=i+0.0001;
    }
    return 1;
  }

  function mean(a){
    var total = 0;
    for (var i in a){
        total += a[i];
    }
    return total/a.length;
  }
  
  const findVariance = (arr = []) => {
    if(!arr.length){
       return 0;
    };
    const sum = arr.reduce((acc, val) => acc + val);
    const { length: num } = arr;
    const median = sum / num;
    let variance = 0;
    arr.forEach(num => {
       variance += ((num - median) * (num - median));
    });
    variance /= num;
    return variance;
  };

  const getQuantity = (value) => {
    if (data.type == "buy") {
      switch(value) { 
        case 0: setQuantity(data.marketBuyQuantity); break;
        case 1: setQuantity(data.quantityB1); break;
        case 2: setQuantity(data.quantityB2); break;
        case 3: setQuantity(data.quantityB3); break;
        case 4: setQuantity(data.quantityB4); break;
        case 5: setQuantity(data.quantityB5); break;
        default: setQuantity(data.marketBuyQuantity); break;
      }
    } else if (data.type == "sell") {
      switch(value) { 
        case 0: setQuantity(data.marketSellQuantity); break;
        case 1: setQuantity(data.quantityA1); break;
        case 2: setQuantity(data.quantityA2); break;
        case 3: setQuantity(data.quantityA3); break;
        case 4: setQuantity(data.quantityA4); break;
        case 5: setQuantity(data.quantityA5); break;
        default: setQuantity(data.marketSellQuantity); break;
      }
    }

  }

  useEffect(() => {
    getQuantity(dataChart);
    if (isRunning) {
    //   // getQuantity(1);
    //   timer = setInterval(() => {
    //     // if (quantity.length > 0) {
    //     const avg = (quantity.reduce((acc, val) => acc + val, 0) / quantity.length).toFixed(4);
    //     if (!isNaN(avg)) {
    //       console.log(avg);
    //       setAverage(avg);
    //     }
    //     // }
    //   }, 1000);
    } else {

    }


    const avg = (quantity.reduce((acc, val) => acc + val, 0) / quantity.length).toFixed(4);
    if (!isNaN(avg)) {
      setAverage(avg);
    }
    const varce = findVariance(quantity).toFixed(4);
    if (!isNaN(varce)) {
      setVariance(varce);
    }
    const standard = sd(quantity).toFixed(4);
    if (!isNaN(standard)) {
      setStandardD(standard);
    }
  }, [data]);
  
  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      containLabel: true,
    },
    legend: {
      data: ["單量"],
    },
    // backgroundColor: "black",
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        data: data.xAxis,
        axisLabel: {
          formatter: (value, index) => {
            const day = dayjs(value).format("HH:mm:ss");
            return day;
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        scale: true,
        name: "單量",
      },
    ],
    dataZoom: [
      {
        show: true,
        realtime: true,
        startValue: dataZoom ? data.xAxis.length - dataZoom : 0,
        endValue: data.xAxis.length - 1,
        onChange: (val) => {
          console.log(val);
        },
      },
    ],
    series: [
      {
        name: "單量",
        type: "bar",
        yAxisIndex: 0,
        data: quantity,
        itemStyle: {
          color: (data.type == "buy") ? "LightCoral" : "DarkSeaGreen",
        },
      },
    ],
  };

  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-col justify-end p-4 pb-0">
          平均數: {average}
        </div>
        <div className="flex flex-col justify-end p-4 pb-0">
          變異數: {variance}
        </div>
        <div className="flex flex-col justify-end p-4 pb-0">
          標準差: {standardD}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col justify-end p-4">
          統計圖表之表
          <Select
            className="w-40"
            value={dataChart}
            options={[
              { label: "Market", value: 0 },
              { label: "Order " + data.charts[0], value: 1 },
              { label: "Order " + data.charts[1], value: 2 },
              { label: "Order " + data.charts[2], value: 3 },
              { label: "Order " + data.charts[3], value: 4 },
              { label: "Order " + data.charts[4], value: 5 },
              // { label: "Cancel " + data.charts[0], value: 6 },
              // { label: "Cancel " + data.charts[1], value: 7 },
              // { label: "Cancel " + data.charts[2], value: 8 },
              // { label: "Cancel " + data.charts[3], value: 9 },
              // { label: "Cancel " + data.charts[4], value: 10 },
            ]}
            onChange={(val) => { 
              setDataChart(val);
              getQuantity(val);
            }}
          />
        </div>
        <div className="flex flex-col justify-end p-4">
          統計圖表顯示筆數
          <Select
            className="w-40"
            value={dataZoom}
            options={[
              { label: "顯示10筆", value: 10 },
              { label: "顯示50筆", value: 50 },
              { label: "顯示100筆", value: 100 },
              { label: "顯示全部筆", value: 0 },
            ]}
            onChange={(val) => setDataZoom(val)}
          />
        </div>
        <div className="flex flex-col justify-end p-4">
          統計圖表時間格局
          <Select
            className="w-40"
            value={dateFormat}
            options={[
              { label: "毫秒", value: 4 },
              { label: "秒", value: 3 },
              { label: "分", value: 0 },
              { label: "時", value: 1 },
              { label: "日", value: 2 },
            ]}
            onChange={(val) => {
              onDateFormatChange && onDateFormatChange(val);
              setDateFormat(val);
            }}
          />
        </div>
      </div>
      <ReactECharts option={options} />
    </>
  );
};

export default BarStatisticsChart;
