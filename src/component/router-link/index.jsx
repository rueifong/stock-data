import { NavLink } from "react-router-dom";
import React from "react";
import { Button } from "antd";
import { defaultAxios, api } from "../../environment/api";
import { useHistory } from "react-router-dom";
import errorNotification from "../../utils/errorNotification";

import { LINK_MAPPING_DATA } from "../../authData";

const RouterLink = ({ setToken, permission }) => {
  const history = useHistory();
  return (
    <ul className="sticky px-4 bg-gray-200 w-48 flex-shrink-0 min-h-screen">
      {/* <li className=" text-center text-xl border-b border-black">
        <Button
          className="w-full"
          size="large"
          onClick={() => {
            defaultAxios({
              url: api.logout.url,
              method: api.logout.method,
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally((res) => {
                setToken(null);
                history.replace("/login/");
              });
          }}
        >
          登出
        </Button>
      </li> */}
      {permission.map((data) => (
        <li className="py-5 text-xl" key={Math.random()}>
          <NavLink to={`/${data}`}>
            {LINK_MAPPING_DATA[data]}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default RouterLink;
