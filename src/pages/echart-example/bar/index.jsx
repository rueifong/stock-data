import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const BarChart = ({ originData = {} }) => {
  const [yAxisMax, setYAxisMax] = useState(20);
  const [data, setData] = useState({});
  const [center, setCenter] = useState(0);

  useEffect(() => {
    setData(originData);

    if (data?.series?.length) {
      let max = 10;
      data.series.forEach((deta) => {
        if (Math.abs(deta) > max) max = Math.abs(deta) + 10;
      });
      setYAxisMax(max);
    }
  }, [originData]);

  const options = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: (param) => {
        if (typeof param[0].data === "string") return "";
        return (
          "Price: " +
          param[0].name +
          "<br/>" +
          param[0].seriesName +
          " : " +
          Math.abs(param[0].data)
        );
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: data.xAxis,
      },
    ],
    yAxis: [
      {
        type: "value",
        splitNumber: 10,
        max: yAxisMax,
        min: -yAxisMax,
        axisLabel: {
          formatter: (value) => {
            return Math.abs(value);
          },
        },
      },
    ],
    series: [
      {
        name: "委託量",
        type: "bar",
        data: data.series,
        itemStyle: {
          color: (param) => {
            return param.data > 0 ? "green" : "red";
          },
        },
        // markPoint: {
        //   symbol:
        //     "path://M479.046,283.925c-1.664-3.989-5.547-6.592-9.856-6.592H352.305V10.667C352.305,4.779,347.526,0,341.638,0H170.971 c-5.888,0-10.667,4.779-10.667,10.667v266.667H42.971c-4.309,0-8.192,2.603-9.856,6.571c-1.643,3.989-0.747,8.576,2.304,11.627 l212.8,213.504c2.005,2.005,4.715,3.136,7.552,3.136s5.547-1.131,7.552-3.115l213.419-213.504 C479.793,292.501,480.71,287.915,479.046,283.925z",
        //   symbolSize: 30,
        //   itemStyle: {
        //     color: "black",
        //   },
        //   data: [
        //     {
        //       coord: [`${originData.matchPrice}`, 0],
        //       value: originData.matchPrice,
        //       y: 50,
        //       name: "qwe",
        //     },
        //   ],
        // },
      },
    ],
  };
  return <ReactECharts option={options} />;
};

export default BarChart;
