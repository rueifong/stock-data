import React, { useEffect, useMemo, useRef, useState } from "react";
// import Settings from "./settings";
import { defaultAxios, api } from "../../environment/api";
import { Button, Slider, Tabs, Typography, Table } from "antd";
import DisplayTickChart from "../../component/chart";
import DisplayTimeChart from "../../component/line-chart";
import BarChart from "../../pages/echart-example/bar";
import LineChart from "../../pages/echart-example/line";
// import errorNotification from "../../utils/errorNotification";

import { configConsumerProps } from "antd/lib/config-provider";
import { renderData } from "./settings/math-model";


const { Title } = Typography;
const { TabPane } = Tabs;


const Q1Chart = () => {
  // const [stockId, setStockId] = useState();
  const [buttonStatus, setButtonStatus] = useState("stop");

  ////////////////////////////////////////////////////////////////////////
  const displayData = useRef();
  const timeSet = useRef();
  const [nextTime, setNextTime] = useState(0);

  const [q, setQ] = useState({
    array_a: [],
    array_b: [],
    q1_array: [],
  });

  const [showType, setShowType] = useState("all");
  const [returnData, setReturnData] = useState({});
  const [timeData, setTimeData] = useState({
    xAxis: [],
    yAxis: [],
  });
  const [setting, setSetting] = useState({
    returnData: {
      xAxis: [97, 98],
      series: [-3, 2],
      Q1: {
        up: 0,
        down: 0,
        total: 0,
      }
    },
    current_tab: 1,
    default_B: 3,
    default_A: 2,
    default_alpha_B: 0.52,
    default_alpha_A: 0.52,
    default_lambda_B: 5,
    default_lambda_B_K: 1.92,
    default_lambda_A: 5,
    default_lambda_A_K: 1.92,
    R_B: 0.8,
    R_A: 0.8,
    default_theta_B: 5,
    default_theta_B1: 0.71,
    default_theta_B2: 0.81,
    default_theta_B3: 0.68,
    default_theta_B4: 0.56,
    default_theta_B5: 0.47,
    default_theta_A: 5,
    default_theta_A1: 0.71,
    default_theta_A2: 0.81,
    default_theta_A3: 0.68,
    default_theta_A4: 0.56,
    default_theta_A5: 0.47,
    R_theta_B: 0.8,
    R_theta_A: 0.8,
    mu_B: 0.94,
    mu_A: 0.94,
    n: 1, 
    p: 1,
    batch_size: 1,
    s: 1,
    max_a: 13,
    max_b: 11,
    gap: 3,
  });

  const [table, setTable] = useState({
    columns: [
      {
        title: 'b \\ a',
        dataIndex: 'name',
        key: Math.random(),
      },
      {
        title: 1,
        dataIndex: 1,
        key: Math.random(),
      },
      {
        title: 4,
        dataIndex: 4,
        key: Math.random(),
      },
      {
        title: 7,
        dataIndex: 7,
        key: Math.random(),
      },
      {
        title: 10,
        dataIndex: 10,
        key: Math.random(),
      },
      {
        title: 13,
        dataIndex: 13,
        key: Math.random(),
      },
    ],
    dataSource: [
      {
        key: 2,
        name: 2,
      },
      {
        key: 5,
        name: 5,
      },
      {
        key: 8,
        name: 8,
      },
      {
        key: 11,
        name: 11,
      },
    ],
  });

  useEffect(() => {
    let [next, renderReturnData, renderTimeData, renderButtonStatus] = renderData(setting, true, buttonStatus, timeData);
    setNextTime(next);
    setReturnData(renderReturnData);
    setTimeData(renderTimeData);
    // setButtonStatus(renderButtonStatus);
  }, []);

  useEffect(() => {
    if (nextTime && buttonStatus !== "stop") {
      setTimeout(() => {
        setNextTime(() => {
          console.log('nextTime', nextTime);
          let [next, renderReturnData, renderTimeData, renderButtonStatus] = renderData(setting, false, buttonStatus, timeData);
          setNextTime(next);
          setReturnData(renderReturnData);
          setTimeData(renderTimeData);
          // setButtonStatus(renderButtonStatus);
          console.log('timeData2', timeData);
        });
      }, nextTime);
    }
  }, [nextTime, buttonStatus]);

  const handleInputChangeDefaultB = (value) => {
    setSetting({ ...setting, default_B: value });
    setReturnData({
      series: [-value, setting.default_A],
    })
    // setSetting({ ...setting, returnData: { series: [-value, setting.default_A] } });
  };

  const handleInputChangeDefaultA = (value) => {
    setSetting({ ...setting, default_A: value });
    setReturnData({
      series: [-setting.default_B, value],
    })
    // setSetting({ ...setting, returnData: { series: [-setting.default_B, value] } });
  };

  const handleInputChangeAlphaB = (value) => {
    setSetting({ ...setting, default_alpha_B: value });
  };

  const handleInputChangeAlphaA = (value) => {
    setSetting({ ...setting, default_alpha_A: value });
  };

  const handleInputChangeLambdaB = (value) => {
    setSetting({ ...setting, default_lambda_B: value });
  };

  const handleInputChangeLambdaBK = (value) => {
    setSetting({ ...setting, default_lambda_B_K: value });
  };

  const handleInputChangeLambdaA = (value) => {
    setSetting({ ...setting, default_lambda_A: value });
  };

  const handleInputChangeLambdaAK = (value) => {
    setSetting({ ...setting, default_lambda_A_K: value });
  };

  const handleInputChangeLambdaRatioB = (value) => {
    setSetting({ ...setting, R_B: value });
  };

  const handleInputChangeLambdaRatioA = (value) => {
    setSetting({ ...setting, R_A: value });
  };

  const handleInputChangeThetaB = (value) => {
    setSetting({ ...setting, default_theta_B: value });
  };

  const handleInputChangeThetaB1 = (value) => {
    setSetting({ ...setting, default_theta_B1: value });
  };

  const handleInputChangeThetaB2 = (value) => {
    setSetting({ ...setting, default_theta_B2: value });
  };

  const handleInputChangeThetaB3 = (value) => {
    setSetting({ ...setting, default_theta_B3: value });
  };

  const handleInputChangeThetaB4 = (value) => {
    setSetting({ ...setting, default_theta_B4: value });
  };

  const handleInputChangeThetaB5 = (value) => {
    setSetting({ ...setting, default_theta_B5: value });
  };

  const handleInputChangeThetaA = (value) => {
    setSetting({ ...setting, default_theta_A: value });
  };

  const handleInputChangeThetaA1 = (value) => {
    setSetting({ ...setting, default_theta_A1: value });
  };
  const handleInputChangeThetaA2 = (value) => {
    setSetting({ ...setting, default_theta_A2: value });
  };
  const handleInputChangeThetaA3 = (value) => {
    setSetting({ ...setting, default_theta_A3: value });
  };
  const handleInputChangeThetaA4 = (value) => {
    setSetting({ ...setting, default_theta_A4: value });
  };
  const handleInputChangeThetaA5 = (value) => {
    setSetting({ ...setting, default_theta_A5: value });
  };

  const handleInputChangeThetaRatioB = (value) => {
    setSetting({ ...setting, R_theta_B: value });
  };

  const handleInputChangeThetaRatioA = (value) => {
    setSetting({ ...setting, R_theta_A: value });
  };

  const handleInputChangeMuB = (value) => {
    setSetting({ ...setting, mu_B: value });
  };

  const handleInputChangeMuA = (value) => {
    setSetting({ ...setting, mu_A: value });
  };

  const handleInputChangeN = (value) => {
    setSetting({ ...setting, n: value });
  };

  const handleInputChangeP = (value) => {
    setSetting({ ...setting, p: value });
  };

  const handleInputChangeBatchSize = (value) => {
    setSetting({ ...setting, batch_size: value });
  };

  const handleTabsChange = (key) => {
    setSetting({ ...setting, current_tab: key });
  };

  const handleInputChangeS = (key) => {
    setSetting({ ...setting, s: key });
  };

  const handleInputChangeMaxA = (key) => {
    setSetting({ ...setting, max_a: key });
    // renderTable(setting.gap, key, setting.max_b);
    // setQ1Array();
  };

  const handleInputChangeMaxB = (key) => {
    setSetting({ ...setting, max_b: key });
    // renderTable(setting.gap, setting.max_a, key);
    // setQ1Array();
  };

  const handleInputChangeGap = (key) => {
    setSetting({ ...setting, gap: key });
    // renderTable(key, setting.max_a, setting.max_b);
    // setQ1Array();
  };

  ////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <DisplayTickChart data={returnData} />
      {/* <DisplayChart
        chartData={returnData}
        // onStockIdChange={(e) => {
        //   setStockId(e);
        // }}
      /> */}
      <div className="flex justify-around my-6 items-center">
        <Button
          type="primary"
          onClick={() => setButtonStatus("start")}
        >
          開始模擬
        </Button>
        <Button
          style={{ background: "#91A194", color: "white" }}
          onClick={() => setButtonStatus("stop")}
        >
          暫停模擬
        </Button>
      </div>

      <DisplayTimeChart data={timeData} />

      {/* <DisplayLineChart
        chartData={timeData}
        // onStockIdChange={(e) => {
        //   setStockId(e);
        // }}
      /> */}
      {/* <div>{timeData.xAxis}</div>
      <div>{timeData.yAxis}</div> */}


      {/* {useMemo(() => {
        return <> */}
          {/* <LineChart data={timeData} />; */}
        {/* </>
      }, [])} */}
      {/* <BarChart originData={returnData} showType={showType} /> */}

      <Title className="m-4 mb-0" level={5}>
        使用情境
      </Title>
      {/* <Settings buttonStatus={buttonStatus} stockId={stockId} /> */}

      <div className="card-container px-5">
        <Tabs type="card" centered onChange={handleTabsChange}>
          <TabPane tab="Model (1)" key="1">
            <div>
              <div className="flex justify-center">
                <div className="w-full mx-5">
                  <div>Q1 up: {setting.returnData.Q1.up}</div>
                  <div>Q1 down: {setting.returnData.Q1.down}</div>
                  <div>Q1 toatl: {setting.returnData.Q1.total}</div>
                  <div>Q1: {setting.returnData.Q1.up/setting.returnData.Q1.total}</div>
                </div>
              </div>
              <hr className="my-3" />
              <div className="flex justify-center mx-5">
                <div className="mr-5 pr-5 border-r w-1/2">
                  <div>
                    <div>
                      B<sub>def.</sub>: {setting.default_B}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={setting.default_B}
                      onChange={handleInputChangeDefaultB}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      λ<sub>B</sub>: {setting.default_lambda_B}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={0.1}
                      value={setting.default_lambda_B}
                      onChange={handleInputChangeLambdaB}
                    />
                  </div>
                  {/* <div>
                    <div>
                      R<sub>B</sub>: {setting.R_B}
                    </div>
                    <Slider
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={setting.R_B}
                      onChange={handleInputChangeLambdaRatioB}
                    />
                  </div> */}
                  <hr className="my-3" />
                  <div>
                    <div>
                      θ<sub>B</sub>: {setting.default_theta_B}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={0.1}
                      value={setting.default_theta_B}
                      onChange={handleInputChangeThetaB}
                    />
                  </div>
                  {/* <div>
                    <div>
                      R<sub>B</sub>: {setting.R_theta_B}
                    </div>
                    <Slider
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={setting.R_theta_B}
                      onChange={handleInputChangeThetaRatioB}
                    />
                  </div> */}
                  <hr className="my-3" />
                  <div>
                    <div>
                      μ<sub>B</sub>: {setting.mu_B}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.mu_B}
                      onChange={handleInputChangeMuB}
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div>
                    <div>
                      A<sub>def.</sub>: {setting.default_A}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={1}
                      value={setting.default_A}
                      onChange={handleInputChangeDefaultA}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      λ<sub>A</sub>: {setting.default_lambda_A}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={0.1}
                      value={setting.default_lambda_A}
                      onChange={handleInputChangeLambdaA}
                    />
                  </div>
                  {/* <div>
                    <div>
                      R<sub>A</sub>: {setting.R_A}
                    </div>
                    <Slider
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={setting.R_A}
                      onChange={handleInputChangeLambdaRatioA}
                    />
                  </div> */}
                  <hr className="my-3" />
                  <div>
                    <div>
                      θ<sub>A</sub>: {setting.default_theta_A}
                    </div>
                    <Slider
                      min={1}
                      max={100}
                      step={0.1}
                      value={setting.default_theta_A}
                      onChange={handleInputChangeThetaA}
                    />
                  </div>
                  {/* <div>
                    <div>
                      R<sub>A</sub>: {setting.R_theta_A}
                    </div>
                    <Slider
                      min={0.1}
                      max={5}
                      step={0.1}
                      value={setting.R_theta_A}
                      onChange={handleInputChangeThetaRatioA}
                    />
                  </div> */}
                  <hr className="my-3" />
                  <div>
                    <div>
                      μ<sub>A</sub>: {setting.mu_A}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.mu_A}
                      onChange={handleInputChangeMuA}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tab="Model (2)" key="2">
            <div>
              <div className="flex justify-center mx-5 border-b pb-3">
                <div className="mr-5 pr-5 w-1/2">
                  <div>n: {setting.n}</div>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={setting.n}
                    onChange={handleInputChangeN}
                  />
                </div>
                <div className="w-1/2">
                  <div>p: {setting.p}</div>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={setting.p}
                    onChange={handleInputChangeP}
                  />
                </div>
              </div>
              <div className="flex justify-center mx-5 mt-3">
                <div className="mr-5 pr-5 border-r w-1/2">
                  <div>
                    <div>
                      α<sub>B</sub>: {setting.default_alpha_B}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_alpha_B}
                      onChange={handleInputChangeAlphaB}
                    />
                  </div>
                  <div>
                    <div>
                      k<sub>B</sub>: {setting.default_lambda_B_K}
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={0.01}
                      value={setting.default_lambda_B_K}
                      onChange={handleInputChangeLambdaBK}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      θ<sub>B1</sub>: {setting.default_theta_B1}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_B1}
                      onChange={handleInputChangeThetaB1}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>B2</sub>: {setting.default_theta_B2}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_B2}
                      onChange={handleInputChangeThetaB2}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>B3</sub>: {setting.default_theta_B3}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_B3}
                      onChange={handleInputChangeThetaB3}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>B4</sub>: {setting.default_theta_B4}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_B4}
                      onChange={handleInputChangeThetaB4}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>B5</sub>: {setting.default_theta_B5}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_B5}
                      onChange={handleInputChangeThetaB5}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      μ<sub>B</sub>: {setting.mu_B}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.mu_B}
                      onChange={handleInputChangeMuB}
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <div>
                    <div>
                      α<sub>A</sub>: {setting.default_alpha_A}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_alpha_A}
                      onChange={handleInputChangeAlphaA}
                    />
                  </div>
                  <div>
                    <div>
                      k<sub>A</sub>: {setting.default_lambda_A_K}
                    </div>
                    <Slider
                      min={1}
                      max={10}
                      step={0.01}
                      value={setting.default_lambda_A_K}
                      onChange={handleInputChangeLambdaAK}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      θ<sub>A1</sub>: {setting.default_theta_A1}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_A1}
                      onChange={handleInputChangeThetaA1}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>A2</sub>: {setting.default_theta_A2}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_A2}
                      onChange={handleInputChangeThetaA2}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>A3</sub>: {setting.default_theta_A3}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_A3}
                      onChange={handleInputChangeThetaA3}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>A4</sub>: {setting.default_theta_A4}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_A4}
                      onChange={handleInputChangeThetaA4}
                    />
                  </div>
                  <div>
                    <div>
                      θ<sub>A5</sub>: {setting.default_theta_A5}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.default_theta_A5}
                      onChange={handleInputChangeThetaA5}
                    />
                  </div>
                  <hr className="my-3" />
                  <div>
                    <div>
                      μ<sub>A</sub>: {setting.mu_A}
                    </div>
                    <Slider
                      min={0.01}
                      max={10}
                      step={0.01}
                      value={setting.mu_A}
                      onChange={handleInputChangeMuA}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </Tabs>
      </div>

    </div>
  );
};

export default Q1Chart;
