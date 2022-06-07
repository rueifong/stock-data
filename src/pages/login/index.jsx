import React, { useState } from "react";
import { Form, Input, Button, Alert } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { useHistory } from "react-router-dom";
import Create from "./create";

const Login = ({ setToken, setPermission }) => {
  const [loginError, setLoginError] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  return (
    <div
      className=" flex flex-col justify-center items-center"
      style={{ height: "90vh" }}
    >
      {loginError && (
        <Alert
          className="w-96 mb-4"
          message="登入錯誤"
          description={loginError}
          type="error"
          showIcon
        />
      )}
      <Form
        layout="vertical"
        name="login"
        className="w-96"
        onChange={() => {
          setLoginError(null);
        }}
        onFinish={(data) => {
          defaultAxios({ url: api.login.url, method: api.login.method, data })
            .then((res) => {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem(
                "permission",
                JSON.stringify(res.data.permission)
              );
              setToken(res.data.token);
              setPermission(res.data.permission);
              history.replace("/");
            })
            .catch((err) => {
              errorNotification(err?.response?.data);
              setLoginError(err.message);
            });
        }}
      >
        <Form.Item
          name="account"
          label="帳號"
          rules={[{ required: true, message: "請填入帳號" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密碼"
          rules={[{ required: true, message: "請填入密碼" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit" className="w-full">
            登入
          </Button>
        </Form.Item>
        <Form.Item className="mt-4">
          <Button
            onClick={() => {
              setIsModalVisible(true);
            }}
            className="w-full"
          >
            註冊
          </Button>
        </Form.Item>
      </Form>
      <Create visible={isModalVisible} setVisible={setIsModalVisible} />
    </div>
  );
};

export default Login;
