import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";

const Create = ({ visible, setVisible, defaultValue, reset, role = [] }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (defaultValue) {
      form.setFieldsValue(defaultValue);
    }
  }, [defaultValue]);
  return (
    <Modal
      title={defaultValue ? "修改權限" : "新增權限"}
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      okText="確認"
      cancelText="取消"
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={(value) => {
          const { restApiTime, ...other } = value;
          if (defaultValue) {
            defaultAxios({
              url: api.putInvestor.url,
              method: api.putInvestor.method,
              data: {
                id: defaultValue.id,
                restApiTime: parseInt(restApiTime),
                ...other,
              },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          } else {
            defaultAxios({
              url: api.postInvestor.url,
              method: api.postInvestor.method,
              data: {
                restApiTime: parseInt(restApiTime),
                ...other,
              },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          }
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="帳戶名稱"
          name="account"
          rules={[{ required: true, message: "請輸入帳戶名稱" }]}
        >
          <Input placeholder="請輸入帳戶名稱" />
        </Form.Item>
        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: !defaultValue, message: "請輸入密碼" }]}
        >
          <Input placeholder="請輸入密碼" />
        </Form.Item>
        <Form.Item
          label="剩餘請求次數"
          name="restApiTime"
          rules={[
            { required: defaultValue ? true : false, message: "請輸入次數" },
          ]}
          style={{ display: defaultValue ? undefined : "none" }}
        >
          <Input type="number" placeholder="請輸入數字" />
        </Form.Item>
        <Form.Item
          label="角色"
          name="roleId"
          rules={[{ required: defaultValue ? true : false, message: "請選擇" }]}
          style={{ display: defaultValue ? undefined : "none" }}
        >
          <Select
            placeholder="請選擇"
            options={role?.map((val) => ({ value: val.id, label: val.name }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
