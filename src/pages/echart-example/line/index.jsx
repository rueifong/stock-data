import React, { useEffect, useState, useRef, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { Select } from "antd";
import dayjs from "dayjs";
// import echarts from 'echarts/lib/echarts';

const LineChart = ({
  // originData = {},
  originData = { xAxis: [], yAxis: [] },
  // onDateFormatChange,
}) => {
  const [data, setData] = useState({});
  // console.log('originData1', originData);
  const chartRef = useRef(null);
  let chartInstance = null;

  function renderChart() {
    const renderedInstance = ReactECharts.getInstanceByDom(chartRef.current)
    if (renderedInstance) {
      chartInstance = renderedInstance
    } else {
      chartInstance = ReactECharts.init(chartRef.current)
    }
    chartInstance.setOption(options)
  }

  useEffect(() => {
    // console.log('originData2', originData);
    setData(originData);
    // renderChart();
    // if (data?.series?.length) {
    //   let max = 10;
    //   data.series.forEach((deta) => {
    //     if (Math.abs(deta) > max) max = Math.abs(deta) + 10;
    //   });
    //   setYAxisMax(max);
    // }
  });

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
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
      data: ["成交量"],
    },
    // backgroundColor: "black",
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        // data: [1, 2, 3, 4],
        data: data.xAxis,
        axisLabel: {
          formatter: (value, index) => {
            return Number(value).toFixed(2);
            // const day = dayjs(value).format("HH:mm:ss");
            // return day;
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        scale: true,
        name: "成交價",
      },
    ],
    // dataZoom: [
    //   {
    //     show: true,
    //     realtime: true,
    //     startValue: dataZoom ? data.xAxis.length - dataZoom : 0,
    //     endValue: data.xAxis.length - 1,
    //     onChange: (val) => {
    //       console.log(val);
    //     },
    //   },
    // ],
    series: [
      {
        name: "成交價2",
        type: "line",
        // step: "end",
        // data: [10, 12, 8, 15],
        data: data.yAxis,
        // itemStyle: {
        //   color: "black",
        // },
      },
    ],
  };

  return (
    <>
      {useMemo(() => {
        return <>
          <ReactECharts 
            option={options}
            // key={(originData.xAxis.length === 0) ? 0: data.xAxis[data.xAxis.length - 1]}
          />
        </>
      }, [data, options, originData])}
    </>
  );
};

export default LineChart;
