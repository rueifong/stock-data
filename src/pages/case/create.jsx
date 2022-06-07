import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";

const Create = ({ visible, setVisible, defaultValue, reset }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(defaultValue);
    if (defaultValue) {
      form.setFieldsValue(defaultValue);
    }
  }, [defaultValue]);
  return (
    <Modal
      title={defaultValue ? "修改情境" : "新增情境"}
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
          if (defaultValue) {
            defaultAxios({
              url: api.putContainer.url,
              method: api.putContainer.method,
              data: { ...value, id: defaultValue.id },
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
              url: api.postContainer.url,
              method: api.postContainer.method,
              data: value,
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

          console.log(value);
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="情境名稱"
          name="name"
          rules={[{ required: true, message: "請輸入情境" }]}
        >
          <Input placeholder="請輸入情境名稱" />
        </Form.Item>
        <Form.Item
          label="股票id"
          name="stockId"
          rules={[{ required: true, message: "請選擇股票" }]}
        >
          <Select
            placeholder="請選擇股票"
            options={[{ value: 1, label: "1號股票" }]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
