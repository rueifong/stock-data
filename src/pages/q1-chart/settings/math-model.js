function lowestValueAndKey(obj) {
  let [lowestItems] = Object.entries(obj).sort(([, v1], [, v2]) => v1 - v2);
  return [lowestItems[0], lowestItems[1]];
}

function geometricDistribution(min, max, prob) {
  let q = 0;
  let p = Math.pow(prob, 1 / (max - min));
  while (true) {
    q = Math.ceil(Math.log(1 - Math.random()) / Math.log(p)) + (min - 1);
    if (q <= max) {
      return q;
    }
  }
}

function renderQ1(Q1, series, buttonStatus) {
  if (series[1] === 0) {
    // 股票上漲
    Q1.up += 1;
    Q1.total += 1;
    // buttonStatus = 'stop';
  } else if (series[0] === 0) {
    // 股票下跌
    Q1.down += 1;
    Q1.total += 1;
    // buttonStatus = 'stop';
  }

  return [{
    up: Q1.up,
    down: Q1.down,
    total: Q1.total,
  }, buttonStatus];
}

export const renderData = function (params, firstTime, buttonStatus, timeData = []) {
  let Times = [];
  let returnData = params.returnData;

  let current_tab = params.current_tab;
  let default_alpha_B = params.default_alpha_B;
  let default_alpha_A = params.default_alpha_A;
  let default_lambda_B = params.default_lambda_B;
  let default_lambda_B_K = params.default_lambda_B_K;
  let default_lambda_A = params.default_lambda_A;
  let default_lambda_A_K = params.default_lambda_A_K;
  let R_B = params.R_B;
  let R_A = params.R_A;
  let default_theta_B = params.default_theta_B;
  let default_theta_B1 = params.default_theta_B1;
  let default_theta_B2 = params.default_theta_B2;
  let default_theta_B3 = params.default_theta_B3;
  let default_theta_B4 = params.default_theta_B4;
  let default_theta_B5 = params.default_theta_B5;
  let default_theta_A = params.default_theta_A;
  let default_theta_A1 = params.default_theta_A1;
  let default_theta_A2 = params.default_theta_A2;
  let default_theta_A3 = params.default_theta_A3;
  let default_theta_A4 = params.default_theta_A4;
  let default_theta_A5 = params.default_theta_A5;
  let R_theta_B = params.R_theta_B;
  let R_theta_A = params.R_theta_A;
  let mu_B = params.mu_B;
  let mu_A = params.mu_A;
  let n = params.n;
  let p = params.p;
  let batch_size = params.batch_size;
  let s = params.s;
  let max_a = params.max_a;
  let max_b = params.max_b;
  let gap = params.gap;

  Times["LA"] = -Math.log(Math.random()) / default_lambda_A;
  Times["CA"] = -Math.log(Math.random()) / (default_theta_A * returnData.series[1]);
  Times["MA"] = -Math.log(Math.random()) / mu_A;
  Times["LB"] = -Math.log(Math.random()) / default_lambda_B;
  Times["CB"] = -Math.log(Math.random()) / (default_theta_B * returnData.series[0]);
  Times["MB"] = -Math.log(Math.random()) / mu_B;

  let minimum = lowestValueAndKey(Times);

  // let lowest = lowestValueAndKey(T);
  let next = minimum[1] * 1000;

  let kind = minimum[0].substring(0, 1);
  let type = minimum[0].substring(1, 2);


  // console.log("T", T);
  console.log('=====================start=====================');

  let xAxis = 0;
  if (!firstTime)
    switch (kind) {
      // 限價單
      case "L":
        console.log("Limit order");
        if (timeData.xAxis.length == 0) {
          xAxis = next;
        } else { 
          xAxis = timeData.xAxis[timeData.xAxis.length - 1] + next;
        }
        timeData.xAxis.push(xAxis);
        if (type == "A") {
          returnData.series[1] += 1;
          timeData.yAxis.push(1);
        } else if (type == "B") {
          returnData.series[0] -= 1;
          timeData.yAxis.push(0);
        }
        [returnData.Q1, buttonStatus] = renderQ1(returnData.Q1, returnData.series, buttonStatus);
        break;

      // 市價單
      case "M":
        console.log("Market order");
        if (timeData.xAxis.length == 0) {
          xAxis = next;
        } else { 
          xAxis = timeData.xAxis[timeData.xAxis.length - 1] + next;
        }
        timeData.xAxis.push(xAxis);
        if (type == "A") {
          returnData.series[1] += 1;
          timeData.yAxis.push(1);
        } else if (type == "B") {
          returnData.series[0] -= 1;
          timeData.yAxis.push(0);
        }
        [returnData.Q1, buttonStatus] = renderQ1(returnData.Q1, returnData.series, buttonStatus);
        break;

      // 取消單
      case "C":
        console.log("Cancel order");
        if (type == "A" && returnData.series[1] > 0) {
          returnData.series[1] -= 1;
        } else if (type == "B" && returnData.series[0] < 0) {
          returnData.series[0] += 1;
        }
        [returnData.Q1, buttonStatus] = renderQ1(returnData.Q1, returnData.series, buttonStatus);
        break;
    }
    console.log('test3 data', returnData);
    console.log('timeData', timeData);
  
  return [next, returnData, timeData, buttonStatus];
};
