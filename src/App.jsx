import "antd/dist/antd.css";

import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import EchartExample from "./pages/echart-example";
import Main from "./pages/main";
import Login from "./pages/login";
import RouterLink from "./component/router-link";
import { AUTH_MAPPING_DATA } from "./authData";

import { useEffect, useState } from "react";
import { settingToken, api, defaultAxios } from "./environment/api";
const events = require("events");

export const appEventEmitter = new events.EventEmitter();

const App = () => {
  const [router, setRouter] = useState("");
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [permission, setPermission] = useState(
    JSON.parse(localStorage.getItem("permission")) || []
  );

  const GuardedRoute = ({ component: Component, ...rest }) => {
    setRouter(rest.path);
    return (
      <Route
        {...rest}
        render={(props) =>
          // auth ? (
            <Component {...props} />
          // ) : (
          //   <Redirect to="/stock-font-end/login/" />
          // )
        }
      />
    );
  };
  useEffect(() => {
    appEventEmitter.on("unauthorization", (msg) => {
      localStorage.removeItem("token");
      // setAuth(false);
    });
  }, []);

  useEffect(() => {
    setAuth(!!token);
    settingToken(token);
  }, [token]);

  // useEffect(() => {
  //   defaultAxios({
  //     url: api.getRolePermission.url,
  //     method: api.getRolePermission.method,
  //   })
  //     .then((res) => {
  //       setPermission(res.data);
  //     })
  //     .catch((err) => {
  //       errorNotification(err?.response?.data);
  //     });
  // }, [router]);

  return (
    <HashRouter>
      <div className="flex ">
        {<RouterLink setToken={setToken} permission={['Q1-chart', 'replay-chart']} />}
        <div className="flex-1 my-10 ">
          <Switch>
            {/* <Route
              path="/stock-font-end/login/"
              component={() => (
                <Login setToken={setToken} setPermission={setPermission} />
              )}
            /> */}
            <Route path="/stock-font-end/" exact component={Main} />
            <GuardedRoute
              path="/stock-font-end/echart-example"
              component={EchartExample}
            />
            {['Q1-chart', 'replay-chart'].map((data) => (
              <GuardedRoute
                key={Math.random()}
                path={`/stock-font-end/${data}`}
                component={AUTH_MAPPING_DATA[data]}
              />
            ))}
            {/* <Redirect
              from="*"
              to={auth ? "/stock-font-end/" : "/stock-font-end/login"}
            /> */}
          </Switch>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
